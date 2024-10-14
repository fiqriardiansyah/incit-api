const crpt = require('crypto');

export function generateRandomId(length = 16) {
    return crpt.randomBytes(length).toString('hex');
}