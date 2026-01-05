import { ToolHandler, ToolDefinition } from '../types';
import { searchPackagesTool } from './search';
import { getPackageInfoTool } from './package-info';
import { getPackageVersionsTool } from './versions';
import { getRecentReleasesTool } from './recent';
import { getPackageReadmeTool } from './readme';

// Registry of all available tools
const toolRegistry: Map<string, ToolHandler> = new Map([
  ['search_packages', searchPackagesTool],
  ['get_package_info', getPackageInfoTool],
  ['get_package_versions', getPackageVersionsTool],
  ['get_recent_releases', getRecentReleasesTool],
  ['get_package_readme', getPackageReadmeTool],
]);

// Get list of all tool definitions for tools/list response
export function getToolDefinitions(): ToolDefinition[] {
  return Array.from(toolRegistry.values()).map(tool => tool.definition);
}

// Get a specific tool handler by name
export function getToolHandler(name: string): ToolHandler | undefined {
  return toolRegistry.get(name);
}

// Execute a tool by name with given arguments
export async function executeTool(name: string, args: Record<string, unknown>) {
  const handler = toolRegistry.get(name);

  if (!handler) {
    return {
      content: [{
        type: 'text' as const,
        text: `Unknown tool: ${name}. Available tools: ${Array.from(toolRegistry.keys()).join(', ')}`,
      }],
      isError: true,
    };
  }

  return handler.handler(args);
}

export { toolRegistry };
