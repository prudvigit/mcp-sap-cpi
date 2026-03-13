"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeTools = void 0;
exports.handleRuntimeTool = handleRuntimeTool;
const client_js_1 = require("../client.js");
exports.runtimeTools = [
    {
        name: 'get_runtime_artifacts',
        description: 'List all deployed runtime artifacts in SAP CPI with their deployment status (STARTED, STOPPED, ERROR).',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'get_system_status',
        description: 'Get overall SAP CPI system health — active alerts and system status summary.',
        inputSchema: { type: 'object', properties: {} },
    },
];
async function handleRuntimeTool(name, _args) {
    const client = await (0, client_js_1.getCpiClient)();
    try {
        if (name === 'get_runtime_artifacts') {
            const res = await client.get('/IntegrationRuntimeArtifacts', { params: { $format: 'json' } });
            const items = res.data?.d?.results || [];
            return items.map((a) => ({
                id: a.Id,
                name: a.Name,
                type: a.Type,
                status: a.Status,
                deployedOn: a.DeployedOn,
                deployedBy: a.DeployedBy,
                errorInformation: a.ErrorInformation,
            }));
        }
        if (name === 'get_system_status') {
            const res = await client.get('/IntegrationRuntimeArtifacts', { params: { $format: 'json' } });
            const items = res.data?.d?.results || [];
            const summary = {
                total: items.length,
                started: items.filter((a) => a.Status === 'STARTED').length,
                error: items.filter((a) => a.Status === 'ERROR').length,
                stopped: items.filter((a) => a.Status === 'STOPPED').length,
            };
            return summary;
        }
    }
    catch (err) {
        return { error: (0, client_js_1.formatCpiError)(err) };
    }
}
