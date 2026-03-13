"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCpiClient = getCpiClient;
exports.formatCpiError = formatCpiError;
const axios_1 = __importDefault(require("axios"));
const auth_js_1 = require("./auth.js");
let _client = null;
async function getCpiClient() {
    const token = await (0, auth_js_1.getAccessToken)();
    const baseURL = process.env.CPI_TENANT_URL;
    if (!baseURL) {
        throw new Error('Missing CPI_TENANT_URL in .env');
    }
    _client = axios_1.default.create({
        baseURL: `${baseURL}/api/v1`,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    return _client;
}
function formatCpiError(error) {
    if (axios_1.default.isAxiosError(error)) {
        const data = error.response?.data;
        const code = error.response?.status;
        const message = data?.error?.message?.value || data?.message || error.message;
        return `CPI API error ${code}: ${message}`;
    }
    return String(error);
}
