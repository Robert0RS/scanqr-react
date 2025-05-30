export interface QRCode {
    id: string;
    data: string;
    type: string;
    created_at: string;
}

export interface ScanResult {
    success: boolean;
    data: QRCode;
} 