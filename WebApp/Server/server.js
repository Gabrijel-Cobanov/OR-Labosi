const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/data', async (req, res) => {
    console.log('Received request for /data')
    const query = req.query.query;  // Extract the 'query' parameter from the URL
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const scriptPath = path.join(__dirname, 'fetch_data.py'); 
    const format = "json";

    exec(`python ${scriptPath} "${query}" ${format}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send("Error executing script");
        }

        const outputFilePath = path.join(__dirname, stdout.trim());
        
        // Send the file directly as a response
        res.type(format);
        res.sendFile(outputFilePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
    });
});

// Route that calls the Python script for generating CSV or JSON
app.get('/download', async (req, res) => {
    console.log('Received request for /download')
    const query = req.query.query;  // Extract the 'query' parameter from the URL
    const format = req.query.format;  // Extract the 'format' parameter (json or csv)
  
    if (!query || !format) {
      return res.status(400).json({ error: 'Query and format parameters are required' });
    }
  
    // Ensure that the format is either 'json' or 'csv'
    if (format !== 'json' && format !== 'csv') {
      return res.status(400).json({ error: 'Invalid format, must be "json" or "csv"' });
    }
  
    try {
      const scriptPath = path.join(__dirname, 'fetch_data.py');
  
      // Execute the Python script with the query and format arguments
      exec(`python ${scriptPath} "${query}" ${format}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
          return res.status(500).send("Error executing script");
        }
  
        const outputFilePath = path.join(__dirname, stdout.trim());
        res.type(format);
        res.download(outputFilePath, `data.${format}`);  // Send the file for download
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send("Server error");
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
