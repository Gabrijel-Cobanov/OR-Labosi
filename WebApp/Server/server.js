const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5000;


const { auth } = require('express-oauth2-jwt-bearer');
const dotenv = require('dotenv');
dotenv.config();


app.use(cors());

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'comicsDB',
    password: '2099superB',
    port: 5432,
});

const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_URL,
    tokenSigningAlg: 'RS256'
});


const responseWrapper = (status, message, data) => ({ status, message, data });

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

// TRECI LABOS --------------------------------------------------------------------------------------------

// GET all data
app.get('/comics', jwtCheck, async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM comics');
      res.json(responseWrapper('success', 'Fetched all comics.', result.rows));
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});


// GET single resource by ID
app.get('/comics/:id', jwtCheck, async (req, res) => {
  try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM comics WHERE id = $1', [id]);
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', 'Fetched comic by ID.', result.rows[0]));
      } else {
          res.status(404).json(responseWrapper('error', 'Comic not found.'));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

app.get('/comics/publisher/:publisher', jwtCheck, async (req, res) => {
  try {
      const { publisher } = req.params;
      const result = await pool.query('SELECT * FROM comics WHERE LOWER(publisher) LIKE $1', [`%${publisher.toLowerCase()}%`]);
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', `Fetched comics from publishers matching: ${publisher}`, result.rows));
      } else {
          res.status(404).json(responseWrapper('error', `No comics found for publisher matching: ${publisher}`));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});


// GET comics by title search (e.g., Batman)
app.get('/comics/title/:title', jwtCheck, async (req, res) => {
  try {
      const { title } = req.params;
      const result = await pool.query('SELECT * FROM comics WHERE LOWER(title) LIKE $1', [`%${title.toLowerCase()}%`]);
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', `Fetched all comics with title containing: ${title}`, result.rows));
      } else {
          res.status(404).json(responseWrapper('error', `No comics found with title containing: ${title}`));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

// GET comics by writer search (e.g., Stan Lee)
app.get('/comics/writers/:writer', jwtCheck, async (req, res) => {
  try {
      const { writer } = req.params;
      const result = await pool.query('SELECT * FROM comics WHERE LOWER(writers) LIKE $1', [`%${writer.toLowerCase()}%`]);
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', `Fetched all comics with writers containing: ${writer}`, result.rows));
      } else {
          res.status(404).json(responseWrapper('error', `No comics found with writers containing: ${writer}`));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

// POST to add acomic
app.post('/comics', jwtCheck, async (req, res) => {
  try {
      const { publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre } = req.body;

      // Check if any required field is missing
      const missingFields = [];
      if (!publisher) missingFields.push('publisher');
      if (!publisher_country) missingFields.push('publisher_country');
      if (!title) missingFields.push('title');
      if (!writers) missingFields.push('writers');
      if (!artists) missingFields.push('artists');
      if (!main_character) missingFields.push('main_character');
      if (!side_characters) missingFields.push('side_characters');
      if (!story_arc) missingFields.push('story_arc');
      if (comic_number === undefined || comic_number === null) missingFields.push('comic_number');
      if (!date_published) missingFields.push('date_published');
      if (number_of_pages === undefined || number_of_pages === null) missingFields.push('number_of_pages');
      if (!genre) missingFields.push('genre');

      // If there are any missing fields, return a 400 Bad Request
      if (missingFields.length > 0) {
          return res.status(400).json({
              status: 'error',
              message: `Missing required fields: ${missingFields.join(', ')}`
          });
      }

      const result = await pool.query(
        `INSERT INTO comics (publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
        [publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre]
      );
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', 'Comic updated.', result.rows[0]));
      } else {
          res.status(404).json(responseWrapper('error', 'Comic not found.'));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

// PUT update resource names have to be comma separated values
app.put('/comics/:id', jwtCheck, async (req, res) => {
  try {
      const { id } = req.params;
      const { publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre } = req.body;

      // Check if any required field is missing
      const missingFields = [];
      if (!publisher) missingFields.push('publisher');
      if (!publisher_country) missingFields.push('publisher_country');
      if (!title) missingFields.push('title');
      if (!writers) missingFields.push('writers');
      if (!artists) missingFields.push('artists');
      if (!main_character) missingFields.push('main_character');
      if (!side_characters) missingFields.push('side_characters');
      if (!story_arc) missingFields.push('story_arc');
      if (comic_number === undefined || comic_number === null) missingFields.push('comic_number');
      if (!date_published) missingFields.push('date_published');
      if (number_of_pages === undefined || number_of_pages === null) missingFields.push('number_of_pages');
      if (!genre) missingFields.push('genre');

      // If there are any missing fields, return a 400 Bad Request
      if (missingFields.length > 0) {
          return res.status(400).json({
              status: 'error',
              message: `Missing required fields: ${missingFields.join(', ')}`
          });
      }

      const result = await pool.query(
        `UPDATE comics
         SET publisher = $1, publisher_country = $2, title = $3, writers = $4, artists = $5, main_character = $6, side_characters = $7, story_arc = $8, comic_number = $9, date_published = $10, number_of_pages = $11, genre = $12
         WHERE id = $13 RETURNING *;`,
        [publisher, publisher_country, title, writers, artists, main_character, side_characters, story_arc, comic_number, date_published, number_of_pages, genre, id]
    );

    
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', 'Comic updated.', result.rows[0]));
      } else {
          res.status(404).json(responseWrapper('error', 'Comic not found.'));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

// DELETE resource by ID
app.delete('/comics/:id', jwtCheck, async (req, res) => {
  try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM comics WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length > 0) {
          res.json(responseWrapper('success', 'Comic deleted.', result.rows[0]));
      } else {
          res.status(404).json(responseWrapper('error', 'Comic not found.'));
      }
  } catch (err) {
      res.status(500).json(responseWrapper('error', err.message));
  }
});

app.get('/comics/specification/openapi', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'openapi.json'); // Replace 'data.json' with your file's name and path
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="openapi.json"');
  res.sendFile(jsonFilePath);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
