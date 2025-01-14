import './App.css';
import DynamicDataTable from '../Views/DynamicDataTable';
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AppContent = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [downloadQuery, setDownloadQuery] = useState([]);

  const handleDownload = (format) => {
    window.location.href = `http://localhost:5000/download?query=${encodeURIComponent(downloadQuery)}&format=${format}`;
  };

  return (
    <>
      <h1 style={{ color: 'black' }}>Comics Info</h1>
      {!isAuthenticated ? (
        <Button variant="contained" onClick={() => loginWithRedirect()}>
          Log in
        </Button>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
            <Button variant="contained" onClick={() => handleDownload("csv")}>Download .csv</Button>
            <Button variant="contained" onClick={() => handleDownload("json")}>Download .json</Button>
            <Button variant="contained" onClick={() => logout({ returnTo: window.location.origin })}>Log out</Button>
          </Box>
          <DynamicDataTable setDownloadQuery={setDownloadQuery} />
        </>
      )}
    </>
  );
};

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_CLIENT_DOMAIN}
      clientId={import.meta.env.VITE_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AppContent />
    </Auth0Provider>
  );
}

export default App;
