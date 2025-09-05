"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warmTransfer = warmTransfer;
exports.generateWhisper = generateWhisper;
const twilio_1 = __importDefault(require("twilio"));
function warmTransfer(callSid, toNumber, whisper, twilioNumber, whisperUrl) {
    const twiml = new twilio_1.default.twiml.VoiceResponse();
    const dial = twiml.dial({ callerId: twilioNumber });
    dial.number({
        url: `${whisperUrl}?summary=${encodeURIComponent(whisper)}`
    }, toNumber);
    return twiml.toString();
}
function generateWhisper(summary) {
    const twiml = new twilio_1.default.twiml.VoiceResponse();
    twiml.say(`Incoming transferred call. Context: ${summary}`);
    return twiml.toString();
}
