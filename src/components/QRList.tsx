import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { QRCode } from '../types';
import { api } from '../services/api';

export const QRList: React.FC = () => {
    const [codes, setCodes] = useState<QRCode[]>([]);

    const loadCodes = async () => {
        try {
            const data = await api.getCodes();
            setCodes(data);
        } catch (error) {
            console.error('Error al cargar los códigos:', error);
        }
    };

    useEffect(() => {
        loadCodes();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.deleteCode(id);
            setCodes(codes.filter(code => code.id !== id));
        } catch (error) {
            console.error('Error al eliminar el código:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Códigos QR Guardados
            </Typography>
            <Paper>
                <List>
                    {codes.map((code) => (
                        <ListItem
                            key={code.id}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(code.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={code.data}
                                secondary={`Tipo: ${code.type} - Creado: ${new Date(code.created_at).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}; 