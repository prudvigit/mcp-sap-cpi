import { getCpiClient, formatCpiError } from '../client.js';

export const messageTools = [
  {
    name: 'get_failed_messages',
    description: 'List failed messages from SAP CPI message processing logs. Returns messageId, status, artifact name, error, and timestamp.',
    inputSchema: {
      type: 'object',
      properties: {
        top: { type: 'number', description: 'Max number of messages to return (default 20)' },
        artifactName: { type: 'string', description: 'Filter by iFlow/artifact name (optional)' },
        fromDate: { type: 'string', description: 'ISO date string — messages after this date (optional)' },
      },
    },
  },
  {
    name: 'get_message_details',
    description: 'Get full message processing log details for a specific CPI message ID.',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'The CPI message GUID' },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'get_trace_log',
    description: 'Get step-by-step trace log for a CPI message (only available when trace is enabled on the iFlow).',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'The CPI message GUID' },
      },
      required: ['messageId'],
    },
  },
];

export async function handleMessageTool(name: string, args: Record<string, unknown>) {
  const client = await getCpiClient();

  try {
    if (name === 'get_failed_messages') {
      const top = (args.top as number) || 20;
      let filter = "Status eq 'FAILED'";
      if (args.artifactName) filter += ` and IntegrationFlowName eq '${args.artifactName}'`;
      if (args.fromDate) filter += ` and LogStart gt datetime'${args.fromDate}'`;

      const res = await client.get('/MessageProcessingLogs', {
        params: { $filter: filter, $top: top, $orderby: 'LogStart desc', $format: 'json' },
      });

      const messages = res.data?.d?.results || [];
      return {
        count: messages.length,
        messages: messages.map((m: Record<string, unknown>) => ({
          messageId: m.MessageGuid,
          status: m.Status,
          artifactName: m.IntegrationFlowName,
          error: m.ErrorInformation,
          logStart: m.LogStart,
          logEnd: m.LogEnd,
        })),
      };
    }

    if (name === 'get_message_details') {
      const res = await client.get(`/MessageProcessingLogs('${args.messageId}')`, {
        params: { $format: 'json' },
      });
      return res.data?.d || res.data;
    }

    if (name === 'get_trace_log') {
      const res = await client.get(`/MessageProcessingLogs('${args.messageId}')/MessageStoreEntries`, {
        params: { $format: 'json' },
      });
      return res.data?.d?.results || [];
    }
  } catch (err) {
    return { error: formatCpiError(err) };
  }
}
