import { WebApp } from 'meteor/webapp';
import {
  McpRequest,
  McpResponse,
  McpErrorCodes,
  SERVER_INFO,
} from './types';
import { getToolDefinitions, executeTool } from './tools';

// Create Express router for MCP endpoints
const router = WebApp.express.Router();

// Parse JSON body
router.use(WebApp.express.json());

// Handle MCP JSON-RPC requests
router.post('/mcp', async (req: any, res: any) => {
  try {
    const request = req.body as McpRequest;

    // Validate JSON-RPC format
    if (request.jsonrpc !== '2.0') {
      return sendError(res, request.id, McpErrorCodes.InvalidRequest, 'Invalid JSON-RPC version');
    }

    if (!request.method) {
      return sendError(res, request.id, McpErrorCodes.InvalidRequest, 'Method is required');
    }

    // Route to appropriate handler
    const response = await handleMethod(request);
    res.json(response);
  } catch (error) {
    console.error('MCP Error:', error);
    sendError(res, null, McpErrorCodes.InternalError, error instanceof Error ? error.message : 'Internal error');
  }
});

// Handle different MCP methods
async function handleMethod(request: McpRequest): Promise<McpResponse> {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: SERVER_INFO.protocolVersion,
          serverInfo: {
            name: SERVER_INFO.name,
            version: SERVER_INFO.version,
          },
          capabilities: {
            tools: {},
          },
        },
      };

    case 'notifications/initialized':
      // Client acknowledgment - no response needed, but we send one anyway for HTTP
      return {
        jsonrpc: '2.0',
        id,
        result: {},
      };

    case 'tools/list':
      const tools = getToolDefinitions();
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools,
        },
      };

    case 'tools/call':
      if (!params || typeof params.name !== 'string') {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: McpErrorCodes.InvalidParams,
            message: 'Tool name is required',
          },
        };
      }

      const toolName = params.name as string;
      const toolArgs = (params.arguments || {}) as Record<string, unknown>;
      const toolResult = await executeTool(toolName, toolArgs);

      return {
        jsonrpc: '2.0',
        id,
        result: toolResult,
      };

    case 'ping':
      return {
        jsonrpc: '2.0',
        id,
        result: {},
      };

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: McpErrorCodes.MethodNotFound,
          message: `Method not found: ${method}`,
        },
      };
  }
}

// Helper to send error responses
function sendError(res: any, id: string | number | null, code: number, message: string) {
  const response: McpResponse = {
    jsonrpc: '2.0',
    id: id ?? 0,
    error: { code, message },
  };
  res.json(response);
}

// Register the router with Meteor's WebApp
export function registerMcpRoutes() {
  WebApp.handlers.use(router);
  console.log('[MCP] Packosphere MCP server registered at /mcp');
}
