import { ToolHandler, ToolResult, GetRecentReleasesSchema } from '../types';
import { LatestPackages } from '../../../api/LatestPackages';

export const getRecentReleasesTool: ToolHandler = {
  definition: {
    name: 'get_recent_releases',
    description: 'Get recently published or updated Meteor packages. Useful for staying up-to-date with the latest package releases in the ecosystem.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 20)',
        },
        days: {
          type: 'number',
          description: 'Within last N days (default: 7)',
        },
      },
      required: [],
    },
  },
  handler: async (args): Promise<ToolResult> => {
    try {
      const { limit = 20, days = 7 } = GetRecentReleasesSchema.parse(args);
      const actualLimit = Math.min(limit, 100);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const packages = await LatestPackages.find(
        {
          published: { $gte: cutoffDate },
          unmigrated: { $exists: false },
        },
        {
          sort: { published: -1 },
          limit: actualLimit,
          fields: {
            packageName: 1,
            version: 1,
            description: 1,
            published: 1,
          },
        },
      ).fetchAsync();

      if (packages.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `No packages were published or updated in the last ${days} days.`,
          }],
        };
      }

      const formattedPackages = packages.map((pkg: any) => ({
        name: pkg.packageName,
        version: pkg.version,
        description: pkg.description || 'No description',
        published: pkg.published?.toISOString?.() || 'Unknown',
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            period: `Last ${days} days`,
            count: packages.length,
            packages: formattedPackages,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error fetching recent releases: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  },
};
