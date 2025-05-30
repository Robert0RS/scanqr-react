import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Box, Typography, Button, Paper } from '@mui/material';
import { api } from '../services/api';
import { QRCode } from '../types';

interface QRScannerProps {
    onScanSuccess: (result: QRCode) => void;
    onScanError?: (error: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const isMounted = useRef(true);

    const startScanner = () => {
        if (!scannerRef.current && isMounted.current) {
            try {
                scannerRef.current = new Html5QrcodeScanner(
                    'qr-reader',
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        showTorchButtonIfSupported: true,
                        showZoomSliderIfSupported: true,
                        defaultZoomValueIfSupported: 2,
                        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    },
                    false
                );

                scannerRef.current.render(
                    async (decodedText) => {
                        if (!isMounted.current) return;
                        
                        try {
                            const result = await api.saveScannedCode(decodedText);
                            if (result.success && isMounted.current) {
                                onScanSuccess(result.data);
                                stopScanner();
                            } else if (isMounted.current) {
                                onScanError?.('Error al guardar el código escaneado');
                            }
                        } catch (error) {
                            if (isMounted.current) {
                                onScanError?.(error instanceof Error ? error.message : 'Error desconocido');
                            }
                        }
                    },
                    (error) => {
                        if (!isMounted.current) return;
                        
                        if (!error.includes('NotFoundException') && !error.includes('No MultiFormat Readers')) {
                            setCameraError(error);
                            onScanError?.(error);
                        }
                    }
                );
                setIsScanning(true);
            } catch (error) {
                if (isMounted.current) {
                    setCameraError('Error al iniciar la cámara');
                    onScanError?.(error instanceof Error ? error.message : 'Error desconocido');
                }
            }
        }
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            try {
                scannerRef.current.clear();
            } catch (error) {
                console.warn('Error al limpiar el escáner:', error);
            }
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        startScanner();

        return () => {
            isMounted.current = false;
            stopScanner();
        };
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Escanear Código QR
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                {cameraError && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        Error de cámara: {cameraError}
                    </Typography>
                )}
                <div id="qr-reader" style={{ width: '100%' }}></div>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {isScanning ? (
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={stopScanner}
                        >
                            Detener Escáner
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={startScanner}
                        >
                            Iniciar Escáner
                        </Button>
                    )}
                </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary" align="center">
                Coloca el código QR dentro del marco para escanearlo
            </Typography>
        </Box>
    );
}; 