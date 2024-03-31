const fetch = require('node-fetch');

const { parseString } = require('xml2js');

exports.getRssFeed = async function(req, res) {
    try {

        const { xmlLink } = req.body;
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
          
          // Apply dynamic limit to the number of items
          let limit = parseInt(req.query.limit);
          if (!limit || isNaN(limit)) {
            // If limit is not provided or invalid, default to 10
            limit = 10;
          }
    
          // Filter items based on search query
          let filteredItems = items;
          const searchQuery = req.query.query;
          if (searchQuery) {
            const queryRegex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
            filteredItems = items.filter(item => {
              return queryRegex.test(item.title[0]) || queryRegex.test(item.description[0]);
            });
          }
    
          // Apply limit to the filtered items
          const limitedItems = filteredItems.slice(0, limit);
    
          // Send parsed data as JSON response
          res.json(limitedItems);
        });
      } catch (error) {
        console.error('Error retrieving or parsing RSS feed:', error);
        res.status(500).json({ error: 'An error occurred while processing the RSS feed.' });
      }
};