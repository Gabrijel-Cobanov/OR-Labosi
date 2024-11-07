import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import QueryBuilderUI from '../Components/QueryBuilderUi';

const DynamicTable = () => {
    const [data, setData] = useState([]); // Stores the JSON data
    const [headers, setHeaders] = useState([]); // Stores the headers dynamically
    const [selectedColumns, setSelectedColumns] = useState([])

    useEffect(() => {
        // Fetch JSON data from the backend upon loading
        fetch('http://localhost:5000')
            .then(response => response.json())
            .then(fetchedData => {
                setData(fetchedData);
                // Dynamically extract headers from the first object
                if (fetchedData.length > 0) {
                    setHeaders(Object.keys(fetchedData[0]));
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Helper function to format cell data
    const formatCellData = (value) => {
        if (Array.isArray(value)) {
            // Join array elements if each item is an object with 'name' and 'lastname'
            return value.map(item => {
                if (item.name && item.lastname) {
                    return `${item.name} ${item.lastname}`;
                }
                return JSON.stringify(item); // fallback to JSON string if structure is unknown
            }).join(", ");
        } else if (typeof value === 'object' && value !== null) {
            // Format individual object with known keys
            if (value.name && value.lastname) {
                return `${value.name} ${value.lastname}`;
            }
            return JSON.stringify(value); // fallback for unknown structure
        }
        return value; // Return value directly if it's not an object or array
    };

    return (
        <>
            <QueryBuilderUI></QueryBuilderUI>
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {headers.map((header) => (
                                <TableCell key={header}>{formatCellData(row[header])}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </> 
    );
};

export default DynamicTable;
