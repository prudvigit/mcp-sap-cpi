import { getCpiClient, formatCpiError } from '../client.js';

export const runtimeTools = [
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

export async function handleRuntimeTool(name: string, _args: Record<string, unknown>) {
  const client = await getCpiClient();

  try {
    if (name === 'get_runtime_artifacts') {
      const res = await client.get('/IntegrationRuntimeArtifacts', { params: { $format: 'json' } });
      const items = res.data?.d?.results || [];
      return items.map((a: Record<string, unknown>) => ({
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
        started: items.filter((a: Record<string, unknown>) => a.Status === 'STARTED').length,
        error: items.filter((a: Record<string, unknown>) => a.Status === 'ERROR').length,
        stopped: items.filter((a: Record<string, unknown>) => a.Status === 'STOPPED').length,
      };
      return summary;
    }
  } catch (err) {
    return { error: formatCpiError(err) };
  }
}
