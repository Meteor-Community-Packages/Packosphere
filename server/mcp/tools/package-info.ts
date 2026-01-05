import { ToolHandler, ToolResult, GetPackageInfoSchema } from '../types';
import { QPackageInfo } from '../../../api/LatestPackages';

export const getPackageInfoTool: ToolHandler = {
  definition: {
    name: 'get_package_info',
    description: 'Get detailed information about a specific Meteor package including description, versions, repository URL, maintainers, dependencies, and GitHub statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        packageName: {
          type: 'string',
          description: 'Full package name (e.g., "iron:router", "aldeed:collection2", "react-meteor-data")',
        },
      },
      required: ['packageName'],
    },
  },
  handler: async (args): Promise<ToolResult> => {
    try {
      const { packageName } = GetPackageInfoSchema.parse(args);

      // Parse package name to handle both namespaced and non-namespaced packages
      let username = 'meteor';
      let pkgName = packageName;

      if (packageName.includes(':')) {
        const parts = packageName.split(':');
        username = parts[0];
        pkgName = parts[1];
      }

      const query = QPackageInfo.clone({
        username,
        packageName: pkgName,
      });

      const results = await query.fetchAsync();

      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `Package "${packageName}" not found.`,
          }],
        };
      }

      const pkg = results[0] as any;
      const repoInfo = pkg.meta?.repoInfo;

      const info = {
        name: pkg.packageName,
        description: pkg.description || 'No description',
        longDescription: pkg.longDescription || null,
        latestVersion: pkg.version,
        published: pkg.published?.toISOString?.() || 'Unknown',
        git: pkg.git || null,
        github: repoInfo ? {
          url: repoInfo.html_url,
          stars: repoInfo.stargazers_count,
          forks: repoInfo.forks_count,
          openIssues: repoInfo.open_issues,
          language: repoInfo.language,
          license: repoInfo.license?.spdx_id || null,
          lastPush: repoInfo.pushed_at,
        } : null,
        recentVersions: pkg.versions?.map((v: any) => ({
          version: v.version,
          published: v.published?.toISOString?.() || 'Unknown',
        })) || [],
      };

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(info, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error fetching package info: ${error instanceof Error ? error.message : String(error)}`,
        }],
        isError: true,
      };
    }
  },
};
