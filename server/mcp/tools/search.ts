import { ToolHandler, ToolResult, SearchPackagesSchema } from '../types';
import { QPackageSearch } from '../../../api/LatestPackages';

export const searchPackagesTool: ToolHandler = {
  definition: {
    name: 'search_packages',
    description: 'Search for Meteor packages by name or keywords. Returns packages matching the search query with their name, description, latest version, and download statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term for packages (e.g., "react", "authentication", "router")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10, max: 50)',
        },
      },
      required: ['query'],
    },
  },
  handler: async (args): Promise<ToolResult> => {
    try {
      const { query, limit = 10 } = SearchPackagesSchema.parse(args);
      const actualLimit = Math.min(limit, 50);

      const searchQuery = QPackageSearch.clone({
        query,
      });

      searchQuery.body.$options.limit = actualLimit;
      const results = await searchQuery.fetchAsync();

      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `No packages found matching "${query}".`,
          }],
        };
      }

      const formattedResults = results.map((pkg: any) => ({
        name: pkg.packageName,
        description: pkg.description || 'No description',
        published: pkg.published?.toISOString?.() || 'Unknown',
        downloads: pkg.meta?.totalAdds || 0,
        maintainers: pkg.meta?.maintainers?.map((m: any) => m.username) || [],
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            query,
            count: results.length,
            packages: formattedResults,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error searching packages: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  },
};
