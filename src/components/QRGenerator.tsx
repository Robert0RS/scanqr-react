import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { api } from '../services/api';

export const QRGenerator: React.FC = () => {
    const [text, setText] = useState('');
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        if (text.trim()) {
            try {
                await api.createCode(text, 'generated');
                setGenerated(true);
            } catch (error) {
                console.error('Error al generar el código QR:', error);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Generar Código QR
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Texto para el código QR"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    disabled={!text.trim()}
                    sx={{ mt: 2 }}
                >
                    Generar QR
                </Button>
            </Paper>
            {generated && text && (
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <QRCodeSVG value={text} size={200} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {text}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}; 