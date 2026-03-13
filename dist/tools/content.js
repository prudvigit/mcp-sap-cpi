"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTools = void 0;
exports.handleContentTool = handleContentTool;
const client_js_1 = require("../client.js");
exports.contentTools = [
    {
        name: 'list_packages',
        description: 'List all integration packages in the SAP CPI tenant.',
        inputSchema: { type: 'object', properties: {} },
    },
    {
        name: 'list_artifacts',
        description: 'List all artifacts (iFlows, mappings, scripts) in a specific integration package.',
        inputSchema: {
            type: 'object',
            properties: {
                packageId: { type: 'string', description: 'The integration package ID' },
            },
            required: ['packageId'],
        },
    },
    {
        name: 'get_artifact',
        description: 'Get metadata and configuration details for a specific artifact.',
        inputSchema: {
            type: 'object',
            properties: {
                artifactId: { type: 'string', description: 'The artifact ID' },
                artifactType: { type: 'string', description: 'Artifact type: IntegrationFlow | MessageMapping | ScriptCollection | ValueMapping' },
            },
            required: ['artifactId', 'artifactType'],
        },
    },
    {
        name: 'deploy_artifact',
        description: 'Deploy an artifact version to the SAP CPI runtime.',
        inputSchema: {
            type: 'object',
            properties: {
                artifactId: { type: 'string', description: 'The artifact ID to deploy' },
                artifactType: { type: 'string', description: 'Artifact type (default: IntegrationFlow)' },
            },
            required: ['artifactId'],
        },
    },
    {
        name: 'undeploy_artifact',
        description: 'Undeploy an artifact from the SAP CPI runtime.',
        inputSchema: {
            type: 'object',
            properties: {
                artifactId: { type: 'string', description: 'The artifact ID to undeploy' },
            },
            required: ['artifactId'],
        },
    },
];
async function handleContentTool(name, args) {
    const client = await (0, client_js_1.getCpiClient)();
    try {
        if (name === 'list_packages') {
            const res = await client.get('/IntegrationPackages', { params: { $format: 'json' } });
            const pkgs = res.data?.d?.results || [];
            return pkgs.map((p) => ({
                id: p.Id,
                name: p.Name,
                version: p.Version,
                shortText: p.ShortText,
            }));
        }
        if (name === 'list_artifacts') {
            const res = await client.get(`/IntegrationPackages('${args.packageId}')/IntegrationDesigntimeArtifacts`, {
                params: { $format: 'json' },
            });
            const artifacts = res.data?.d?.results || [];
            return artifacts.map((a) => ({
                id: a.Id,
                name: a.Name,
                version: a.Version,
                type: a.Type,
                packageId: a.PackageId,
            }));
        }
        if (name === 'get_artifact') {
            const type = args.artifactType || 'IntegrationFlow';
            const endpoint = type === 'IntegrationFlow'
                ? `/IntegrationDesigntimeArtifacts(Id='${args.artifactId}',Version='active')`
                : `/IntegrationDesigntimeArtifacts(Id='${args.artifactId}',Version='active')`;
            const res = await client.get(endpoint, { params: { $format: 'json' } });
            return res.data?.d || res.data;
        }
        if (name === 'deploy_artifact') {
            const type = args.artifactType || 'IntegrationFlow';
            const res = await client.post('/DeployIntegrationDesigntimeArtifact', null, {
                params: { Id: `'${args.artifactId}'`, Version: "'active'", type: `'${type}'` },
            });
            return { status: 'deployed', taskId: res.data?.d?.TaskId || res.data };
        }
        if (name === 'undeploy_artifact') {
            await client.delete(`/IntegrationRuntimeArtifacts('${args.artifactId}')`);
            return { status: 'undeployed', artifactId: args.artifactId };
        }
    }
    catch (err) {
        return { error: (0, client_js_1.formatCpiError)(err) };
    }
}
