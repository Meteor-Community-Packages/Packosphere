#!/usr/bin/env node

/**
 * MCP Bridge Script for Packosphere
 *
 * This script bridges the MCP stdio transport (used by Claude Code)
 * to the HTTP transport used by the Packosphere Meteor app.
 *
 * Usage:
 *   node mcp-bridge.js
 *
 * Environment:
 *   PACKOSPHERE_URL - Base URL of Packosphere (default: http://localhost:3000)
 *
 * Claude Code Configuration (~/.claude/settings.json):
 *   {
 *     "mcpServers": {
 *       "packosphere": {
 *         "command": "node",
 *         "args": ["/path/to/packosphere/mcp-bridge.js"],
 *         "env": {
 *           "PACKOSPHERE_URL": "http://localhost:3000"
 *         }
 *       }
 *     }
 *   }
 */

const PACKOSPHERE_URL = process.env.PACKOSPHERE_URL || 'http://localhost:3000';
const MCP_ENDPOINT = `${PACKOSPHERE_URL}/mcp`;

// Buffer for reading stdin
let inputBuffer = '';

// Read from stdin
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  inputBuffer += chunk;

  // Process complete JSON-RPC messages (newline-delimited)
  const lines = inputBuffer.split('\n');
  inputBuffer = lines.pop() || ''; // Keep incomplete line in buffer

  for (const line of lines) {
    if (line.trim()) {
      processMessage(line.trim());
    }
  }
});

process.stdin.on('end', () => {
  // Process any remaining data
  if (inputBuffer.trim()) {
    processMessage(inputBuffer.trim());
  }
});

async function processMessage(message) {
  try {
    const request = JSON.parse(message);

    // Forward to Packosphere HTTP endpoint
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: `HTTP error: ${response.status} ${response.statusText}`,
        },
      };
      sendResponse(errorResponse);
      return;
    }

    const result = await response.json();
    sendResponse(result);
  } catch (error) {
    // Handle JSON parse errors or network errors
    let id = null;
    try {
      id = JSON.parse(message).id;
    } catch {
      // Ignore parse error for getting ID
    }

    const errorResponse = {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: error.message || 'Internal error',
      },
    };
    sendResponse(errorResponse);
  }
}

function sendResponse(response) {
  // Write response to stdout (newline-delimited JSON)
  process.stdout.write(JSON.stringify(response) + '\n');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Log startup (to stderr so it doesn't interfere with MCP protocol)
console.error(`[MCP Bridge] Connecting to ${MCP_ENDPOINT}`);
