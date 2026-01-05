import { Meteor } from 'meteor/meteor';
import { registerMcpRoutes } from './protocol';

// Initialize MCP server when Meteor starts
Meteor.startup(() => {
  registerMcpRoutes();
});

// Re-export for external access if needed
export { getToolDefinitions, executeTool } from './tools';
