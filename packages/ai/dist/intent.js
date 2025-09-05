"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectIntent = detectIntent;
function detectIntent(userInput) {
    const input = userInput.toLowerCase();
    // Booking keywords
    if (input.includes('book') ||
        input.includes('appointment') ||
        input.includes('schedule') ||
        input.includes('reserve')) {
        return 'booking';
    }
    // Transfer keywords
    if (input.includes('speak to') ||
        input.includes('talk to') ||
        input.includes('transfer') ||
        input.includes('human') ||
        input.includes('staff')) {
        return 'transfer';
    }
    // Greeting
    if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
        return 'greeting';
    }
    // FAQ indicators
    if (input.includes('hours') ||
        input.includes('open') ||
        input.includes('closed') ||
        input.includes('price') ||
        input.includes('cost') ||
        input.includes('where') ||
        input.includes('location') ||
        input.includes('parking')) {
        return 'faq';
    }
    return 'unknown';
}
