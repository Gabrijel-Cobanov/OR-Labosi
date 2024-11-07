 import './App.css'
 import DynamicDataTable from '../Views/DynamicDataTable'
 import { useState } from 'react'
 import { Button, Box } from '@mui/material'

function App() {

  const handleDownload = (format) => {
    // Directly open the file in the browser
    window.location.href = `http://localhost:5000/download?query=${encodeURIComponent(downloadQuery)}&format=${format}`;
  };

  const [downloadQuery, setDownloadQuery] = useState([])

  return (
    <>
      <h1 style={{ color: 'black'}}>Comics Info</h1>
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',   
          gap: 2,                    
          marginBottom: 2        
        }}>
        <Button variant="contained" onClick={() => handleDownload("csv")}>
          Download .csv
        </Button>
        <Button variant="contained" onClick={() => handleDownload("json")}>
          Download .json
        </Button>
      </Box>
      <DynamicDataTable setDownloadQuery={setDownloadQuery}/> 
    </>
  )
}

export default App
