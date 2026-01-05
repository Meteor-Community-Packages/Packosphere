import { z } from 'zod';

// MCP Protocol Types

export interface McpRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface McpResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: McpError;
}

export interface McpError {
  code: number;
  message: string;
  data?: unknown;
}

// MCP Error Codes
export const McpErrorCodes = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
} as const;

// Tool Definition Types
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolHandler {
  definition: ToolDefinition;
  handler: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

// Server Info
export const SERVER_INFO = {
  name: 'packosphere',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
};

// Tool Input Schemas
export const SearchPackagesSchema = z.object({
  query: z.string().describe('Search term for packages'),
  limit: z.number().optional().default(10).describe('Maximum number of results'),
});

export const GetPackageInfoSchema = z.object({
  packageName: z.string().describe('Full package name (e.g., "iron:router")'),
});

export const GetPackageVersionsSchema = z.object({
  packageName: z.string().describe('Full package name'),
  limit: z.number().optional().default(20).describe('Maximum number of versions'),
});

export const GetRecentReleasesSchema = z.object({
  limit: z.number().optional().default(20).describe('Maximum number of results'),
  days: z.number().optional().default(7).describe('Within last N days'),
});

export const GetPackageReadmeSchema = z.object({
  packageName: z.string().describe('Full package name'),
  version: z.string().optional().describe('Specific version (default: latest)'),
});

export type SearchPackagesInput = z.infer<typeof SearchPackagesSchema>;
export type GetPackageInfoInput = z.infer<typeof GetPackageInfoSchema>;
export type GetPackageVersionsInput = z.infer<typeof GetPackageVersionsSchema>;
export type GetRecentReleasesInput = z.infer<typeof GetRecentReleasesSchema>;
export type GetPackageReadmeInput = z.infer<typeof GetPackageReadmeSchema>;
