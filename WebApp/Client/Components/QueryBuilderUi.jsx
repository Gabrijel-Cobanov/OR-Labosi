import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, TextField, Button, Box } from '@mui/material';

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

const QueryBuilderUI = () => {
  // State to track selected columns and search text
  const [selectedColumns, setSelectedColumns] = useState(columns); // By default, all columns are selected
  const [searchText, setSearchText] = useState('');

  // Handle toggle of columns
  const handleToggle = (event, newAlignment) => {
    if (newAlignment) {
      setSelectedColumns(prevState =>
        prevState.includes(newAlignment)
          ? prevState.filter(column => column !== newAlignment) // Remove column if already selected
          : [...prevState, newAlignment] // Add column if not selected
      );
    }
  };

  // Handle text search change
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Build query string based on selected columns and search text
  const buildQuery = () => {
    const selectedColumnsStr = selectedColumns.join(', ');
    const query = `SELECT ${selectedColumnsStr} FROM comics WHERE `;
    const searchQuery = searchText ? `title LIKE '%${searchText}%' OR publisher LIKE '%${searchText}%' OR genre LIKE '%${searchText}%'` : '';
    return query + (searchQuery ? searchQuery : '1=1'); // Default to "1=1" if no search text
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={selectedColumns}
        onChange={handleToggle}
        aria-label="column selection"
        sx={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap' }}
      >
        {columns.map((column, index) => (
          <ToggleButton
            key={column}
            value={column}
            aria-label={`show ${column}`}
            color="secondary"
            sx={{ margin: '5px', backgroundColor: '#c9c9c9' }}
          >
            {headers[index]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Search Text Field */}
      <TextField
        label="Search Text"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        sx={{ marginBottom: '20px' }}
      />

      {/* Display the constructed query */}
      <Box>
        <Button variant="contained" onClick={() => alert(buildQuery())}>Build Query</Button>
      </Box>

      {/* Output the generated query for testing */}
      <Box sx={{ marginTop: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <h3>Generated Query:</h3>
        <code>{buildQuery()}</code>
      </Box>
    </Box>
  );
};

export default QueryBuilderUI;
