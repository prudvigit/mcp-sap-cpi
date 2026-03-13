"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const axios_1 = __importDefault(require("axios"));
let tokenCache = null;
async function getAccessToken() {
    const now = Date.now();
    if (tokenCache && tokenCache.expiresAt > now + 60000) {
        return tokenCache.accessToken;
    }
    const { CPI_TOKEN_URL, CPI_CLIENT_ID, CPI_CLIENT_SECRET } = process.env;
    if (!CPI_TOKEN_URL || !CPI_CLIENT_ID || !CPI_CLIENT_SECRET) {
        throw new Error('Missing OAuth2 config. Set CPI_TOKEN_URL, CPI_CLIENT_ID, CPI_CLIENT_SECRET in .env');
    }
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CPI_CLIENT_ID);
    params.append('client_secret', CPI_CLIENT_SECRET);
    const response = await axios_1.default.post(CPI_TOKEN_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, expires_in } = response.data;
    tokenCache = {
        accessToken: access_token,
        expiresAt: now + expires_in * 1000,
    };
    return access_token;
}
