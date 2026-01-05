import { ToolHandler, ToolResult, GetPackageVersionsSchema } from '../types';
import { Versions } from '../../../api/Versions';

export const getPackageVersionsTool: ToolHandler = {
  definition: {
    name: 'get_package_versions',
    description: 'List all versions of a Meteor package with their release dates and dependencies. Useful for checking version history and compatibility.',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Full package name (e.g., "iron:router")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of versions to return (default: 20)',
        },
      },
      required: ['packageName'],
    },
  },
  handler: async (args): Promise<ToolResult> => {
    try {
      const { packageName, limit = 20 } = GetPackageVersionsSchema.parse(args);
      const actualLimit = Math.min(limit, 100);

      const versions = await Versions.find(
        { packageName },
        {
          sort: { published: -1 },
          limit: actualLimit,
          fields: {
            version: 1,
            published: 1,
            dependencies: 1,
            publishedBy: 1,
            description: 1,
          },
        },
      ).fetchAsync();

      if (versions.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `No versions found for package "${packageName}". The package may not exist.`,
          }],
        };
      }

      const formattedVersions = versions.map((v: any) => ({
        version: v.version,
        published: v.published?.toISOString?.() || 'Unknown',
        publishedBy: v.publishedBy?.username || 'Unknown',
        description: v.description || null,
        dependencyCount: v.dependencies?.length || 0,
        dependencies: v.dependencies?.slice(0, 10).map((d: any) => ({
          name: d.packageName,
          constraint: d.constraint || 'any',
        })) || [],
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            packageName,
            totalVersions: versions.length,
            versions: formattedVersions,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error fetching versions: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  },
};
