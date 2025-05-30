import axios from 'axios';
import { QRCode, ScanResult } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    // Obtener todos los códigos QR
    getCodes: async (): Promise<QRCode[]> => {
        const response = await axios.get(`${API_URL}/codigos`);
        return response.data;
    },

    // Obtener un código QR por ID
    getCode: async (id: string): Promise<QRCode> => {
        const response = await axios.get(`${API_URL}/codigos/${id}`);
        return response.data;
    },

    // Crear un nuevo código QR
    createCode: async (data: string, type: string): Promise<QRCode> => {
        const response = await axios.post(`${API_URL}/codigos`, { data, type });
        return response.data;
    },

    // Eliminar un código QR
    deleteCode: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/codigos/${id}`);
    },

    // Guardar un código QR escaneado
    saveScannedCode: async (qrData: string): Promise<ScanResult> => {
        const response = await axios.post(`${API_URL}/scan`, { qrData });
        return response.data;
    }
}; 