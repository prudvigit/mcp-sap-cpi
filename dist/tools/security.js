"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityTools = void 0;
exports.handleSecurityTool = handleSecurityTool;
const client_js_1 = require("../client.js");
exports.securityTools = [
    {
        name: 'list_credentials',
        description: 'List all user credential (basic auth) aliases configured in SAP CPI.',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'list_keystores',
        description: 'List all keystore entries in SAP CPI, including alias and expiry date.',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'list_oauth_credentials',
        description: 'List all OAuth2 client credential configurations in SAP CPI.',
        inputSchema: { type: 'object', properties: {} },
    },
];
async function handleSecurityTool(name, _args) {
    const client = await (0, client_js_1.getCpiClient)();
    try {
        if (name === 'list_credentials') {
            const res = await client.get('/UserCredentials', { params: { $format: 'json' } });
            const items = res.data?.d?.results || [];
            return items.map((c) => ({ name: c.Name, kind: c.Kind, description: c.Description }));
        }
        if (name === 'list_keystores') {
            const res = await client.get('/KeystoreEntries', { params: { $format: 'json' } });
            const items = res.data?.d?.results || [];
            return items.map((k) => ({
                alias: k.Alias,
                keyType: k.KeyType,
                validNotAfter: k.ValidNotAfter,
                owner: k.Owner,
            }));
        }
        if (name === 'list_oauth_credentials') {
            const res = await client.get('/OAuthCredentials', { params: { $format: 'json' } });
            const items = res.data?.d?.results || [];
            return items.map((o) => ({
                name: o.Name,
                clientId: o.ClientId,
                tokenServiceUrl: o.TokenServiceUrl,
            }));
        }
    }
    catch (err) {
        return { error: (0, client_js_1.formatCpiError)(err) };
    }
}
