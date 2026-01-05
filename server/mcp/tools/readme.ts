import { ToolHandler, ToolResult, GetPackageReadmeSchema } from '../types';
import { Versions } from '../../../api/Versions';
import { LatestPackages } from '../../../api/LatestPackages';

export const getPackageReadmeTool: ToolHandler = {
  definition: {
    name: 'get_package_readme',
    description: 'Fetch the README content for a Meteor package. Returns the markdown documentation for the package, which typically includes installation instructions, usage examples, and API documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Full package name (e.g., "iron:router")',
        },
        version: {
          type: 'string',
          description: 'Specific version (default: latest)',
        },
      },
      required: ['packageName'],
    },
  },
  handler: async (args): Promise<ToolResult> => {
    try {
      const { packageName, version } = GetPackageReadmeSchema.parse(args);

      let readme: string | null = null;
      let actualVersion: string | null = null;

      if (version) {
        // Fetch specific version
        const versionDoc = await Versions.findOneAsync(
          { packageName, version },
          { fields: { readme: 1, version: 1 } },
        );

        if (versionDoc) {
          readme = (versionDoc as any).readme?.fullText || null;
          actualVersion = version;
        }
      } else {
        // Fetch latest version
        const latestPkg = await LatestPackages.findOneAsync(
          { packageName },
          { fields: { readme: 1, version: 1 } },
        );

        if (latestPkg) {
          readme = (latestPkg as any).readme?.fullText || null;
          actualVersion = (latestPkg as any).version;
        }
      }

      if (!readme) {
        // Try to fetch from Versions collection if not in LatestPackages
        const versionDoc = await Versions.findOneAsync(
          { packageName, ...(version ? { version } : {}) },
          {
            fields: { readme: 1, version: 1 },
            sort: { published: -1 },
          },
        );

        if (versionDoc) {
          readme = (versionDoc as any).readme?.fullText || null;
          actualVersion = (versionDoc as any).version;
        }
      }

      if (!readme) {
        return {
          content: [{
            type: 'text',
            text: `No README found for package "${packageName}"${version ? ` version ${version}` : ''}. The README may not have been fetched yet.`,
          }],
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# README for ${packageName}@${actualVersion}\n\n${readme}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error fetching README: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  },
};
