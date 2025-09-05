"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = sendSMS;
const twilio_1 = __importDefault(require("twilio"));
async function sendSMS(to, message, accountSid, authToken, fromNumber) {
    try {
        const client = (0, twilio_1.default)(accountSid, authToken);
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });
        return {
            success: true,
            messageId: result.sid
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
