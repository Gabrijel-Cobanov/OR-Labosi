const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

// Route that calls the Python script
app.get('/', (req, res) => {
    const scriptPath = path.join(__dirname, 'fetch_data.py');
    const query = "SELECT id FROM comics"; 
    const format = "json";

    exec(`python ${scriptPath} "${query}" ${format}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send("Error executing script");
        }

        const outputFilePath = path.join(__dirname, stdout.trim());
        res.download(outputFilePath, `data.${format}`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
