import React, { useState, useEffect } from 'react';
import { ToggleButton, TextField, Button, Box } from '@mui/material';

// Define columns and their headers (representing the database structure)
const columns = [
  'id', 'publisher', 'publisher_country', 'title', 'writers', 'artists', 
  'main_character', 'side_characters', 'story_arc', 'comic_number', 
  'date_published', 'number_of_pages', 'genre'
];

const headers = [
  'ID', 'Publisher', 'Publisher Country', 'Title', 'Writers', 'Artists',
  'Main Character', 'Side Characters', 'Story Arc', 'Comic Number',
  'Date Published', 'Number of Pages', 'Genre'
];

const QueryBuilderUI = ({ setQueryInTable }) => {
  // State to track selected columns and search text
  const [selectedColumns, setSelectedColumns] = useState(columns); // Default: all columns selected
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState(''); // State to store the query

  // Handle toggle of individual columns
  const handleToggle = (column) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((col) => col !== column) // Remove column if selected
        : [...prevColumns, column] // Add column if not selected
    );
  };

  // Handle text search change
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Build query string based on selected columns and search text
  const buildQuery = () => {
    const selectedColumnsStr = selectedColumns.join(', ');
    let query = `SELECT ${selectedColumnsStr} FROM comics`;
    if (searchText) {
      query += ` WHERE title ILIKE '%${searchText}%' OR publisher ILIKE '%${searchText}%' OR genre ILIKE '%${searchText}%' OR writers ILIKE '%${searchText}%' OR artists ILIKE '%${searchText}%' OR comic_number = '${searchText}'`;
    }
    setQuery(query); // Update the query state
    setQueryInTable(query);
  };

  // Rebuild query on column toggle or search text change
  useEffect(() => {
    buildQuery();
  }, [selectedColumns, searchText]);

  return (
    <Box>
      {/* Individual Toggle Buttons for Columns */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {columns.map((column, index) => (
          <ToggleButton
            key={column}
            value={column}
            selected={selectedColumns.includes(column)}
            onClick={() => handleToggle(column)}
            aria-label={`toggle ${column}`}
            color="secondary"
            sx={{
              backgroundColor: selectedColumns.includes(column) ? '#c9c9c9' : undefined,
              color: selectedColumns.includes(column) ? 'black' : 'gray',
            }}
          >
            {headers[index]}
          </ToggleButton>
        ))}
      </Box>

      {/* Search Text Field */}
      <TextField
        label="Search Text"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        sx={{ marginBottom: '20px' }}
      />

      {/* Output the generated query for testing */}
      <Box sx={{ marginTop: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'black'}}>
        <h3>Generated Query:</h3>
        <code>{query}</code>
      </Box>
    </Box>
  );
};

export default QueryBuilderUI;
