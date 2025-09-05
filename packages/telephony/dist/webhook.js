"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIncomingCall = handleIncomingCall;
const twilio_1 = __importDefault(require("twilio"));
function handleIncomingCall(callSid, from, wsUrl) {
    const twiml = new twilio_1.default.twiml.VoiceResponse();
    const start = twiml.start();
    start.stream({
        url: wsUrl,
        track: 'inbound_track'
    });
    twiml.say('Connecting you to our assistant.');
    return twiml.toString();
}
