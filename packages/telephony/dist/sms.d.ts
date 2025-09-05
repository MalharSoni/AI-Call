interface SMSStatus {
    success: boolean;
    messageId?: string;
    error?: string;
}
export declare function sendSMS(to: string, message: string, accountSid: string, authToken: string, fromNumber: string): Promise<SMSStatus>;
export {};
