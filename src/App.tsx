import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography, Snackbar, Alert } from '@mui/material';
import { QRScanner } from './components/QRScanner';
import { QRGenerator } from './components/QRGenerator';
import { QRList } from './components/QRList';
import { QRCode } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleScanSuccess = (result: QRCode) => {
    setNotification({
      open: true,
      message: `Código QR escaneado: ${result.data}`,
      severity: 'success'
    });
    // Cambiar a la pestaña de historial después de escanear
    setTabValue(2);
  };

  const handleScanError = (error: string) => {
    setNotification({
      open: true,
      message: `Error: ${error}`,
      severity: 'error'
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          ScanQR App
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Escanear" />
            <Tab label="Generar" />
            <Tab label="Historial" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <QRScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <QRGenerator />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <QRList />
        </TabPanel>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
