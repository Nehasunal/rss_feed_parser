const fetch = require('node-fetch');

const { parseString } = require('xml2js');

exports.getRssFeed = async function(req, res) {
    try {

        const xmlLink = req.query.url;
        // Fetch RSS feed
        const response = await fetch(xmlLink);
        const xml = await response.text();

        // Parse XML using xml2js
        parseString(xml, (err, result) => {
            if (err) {
                throw err;
            }
            
            // Extract relevant data from the parsed XML
            const items = result.rss.channel[0].item;
                        
            let filteredItems = items;
            // Apply dynamic limit to the number of items
            let limit = parseInt(req.query.limit);
            if (!limit || isNaN(limit)) {
                // If limit is not provided or invalid, default to 10
                limit = 10;
            }
        
            // Filter items based on search query
            const searchQuery = req.query.search;
            if (searchQuery) {
                const queryRegex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
                filteredItems = items.filter(item => {
                return queryRegex.test(item.title[0]) || queryRegex.test(item.description[0]);
                });
            }

          // Filter items based on published date range if startDate is provided
            if (req.query.startDate) { //mm-dd-yyyy
                const startDate = new Date(req.query.startDate);
                filteredItems = filteredItems.filter(item => {
                    const publishedDate = new Date(item.pubDate);
                    return publishedDate >= startDate;
                });
            }

            // Filter items based on published date range if endDate is provided
            if (req.query.endDate) {
                const endDate = new Date(req.query.endDate);
                filteredItems = filteredItems.filter(item => {
                    const publishedDate = new Date(item.pubDate);
                    return publishedDate <= endDate;
                });
            }
    
            // Apply limit to the filtered items
            const limitedItems = filteredItems.slice(0, limit);
        
            const formattedResponse = limitedItems.map(item => ({
                title: item.title[0],
                description: item.description[0],
                link: item.link[0],
                guid: item.guid[0],
                pubDate: item.pubDate[0]
            }));

            // Send the formatted response
            res.json(formattedResponse);
        });
      } catch (error) {
        console.error('Error retrieving or parsing RSS feed:', error);
        res.status(500).json({ error: 'An error occurred while processing the RSS feed.' });
      }
};