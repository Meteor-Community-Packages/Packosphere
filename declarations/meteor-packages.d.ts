declare module 'meteor/peerlibrary:meteor-packages' {
  import { Mongo } from 'meteor/mongo';
  class PackageServer {
    dummy: null;
    static startSyncing: (options?: { logging?: boolean, sync?: { builds?: boolean, realeases?: boolean, stats?: boolean} }) => void;
    static runIfSyncFinished: (callback: () => void) => void;
    static Packages: Mongo.Collection<Package>;
    static LatestPackages: Mongo.Collection<LatestPackage>;
    static ReleaseTracks: Mongo.Collection<ReleaseTrack>;
    static ReleaseVersions: Mongo.Collection<ReleaseVersion>;
    static Versions: Mongo.Collection<Version>;
    static Builds: Mongo.Collection<Build>;
    static Stats: Mongo.Collection<Stat>;
  }

  interface Document {
    _id: string
  }

  interface RepoInfo {
    forks_count: number
    open_issues: number
    watchers_count: number
    fork: boolean
    updated_at: string
    language: string
    stargazers_count: number
    license: {
      spdx_id: string
    }
  }

  interface Package extends Document {
    name: string
    maintainers: Array<{
      username: string
      id: string
      // [key: string]: any;
    }>
    homepage?: string
    lastUpdated: Date
    directAdds?: number
    totalAdds?: number
    repoInfo?: RepoInfo | null
    // [key: string]: any;
  }

  interface Version extends Document{
    packageName: string
    version: string
    description: string
    longDescription: string
    git: string
    source: {
      url: string
      tarballHash: string
      treeHash: string
      // [key: string]: any;
    }
    readme?: {
      url: string
      hash: string
      fullText?: string
      // [key: string]: any;
    }
    dependencies: Array<{
      constraint?: string
      references: Array<{
        arch: string
        weak?: boolean
        unordered?: boolean
        implied?: boolean
        // [key: string]: any;
      }>
      packageName: string
      // [key: string]: any;
    }>
    exports: Array<{
      name: string
      architectures: string[]
      // [key: string]: any;
    }>
    unmigrated?: boolean
    debugOnly?: boolean
    earliestCompatibleVersion: string
    publishedBy: {
      username: string
      id: string
      // [key: string]: any;
    }
    published: Date
    lastUpdated: Date
    ecRecordFormat: string
    compilerVersion: string
    releaseName: string
    // [key: string]: any;
  }

  interface Build extends Document {
    versionId: string
    buildArchitectures: string
    build: {
      url: string
      tarballHash: string
      treeHash: string
      // [key: string]: any;
    }
    builtBy: {
      username: string
      id: string
      [key: string]: any
    }
    buildPublished: Date
    lastUpdated: Date
    // [key: string]: any;
  }

  interface ReleaseTrack extends Document {
    name: string
    maintainers: Array<{
      username: string
      id: string
      isOrganization: boolean
      // [key: string]: any;
    }>
    lastUpdated: Date
    // [key: string]: any;
  }

  interface ReleaseVersion extends Document{
    track: string
    version: string
    description: string
    recommended: boolean
    tool: string
    packages: {
      [key: string]: string
    }
    orderKey: string
    published: Date
    publishedBy: {
      username: string
      id: string
      // [key: string]: any;
    }
    lastUpdated: Date
    // [key: string]: any;
  }

  interface LatestPackage extends Version {
    lastFetched?: Date | null
    lastComputed?: Date
  }

  interface Stat extends Document {
    name: string
    version: string
    totalAdds: number
    directAdds: number
    date: Date
  }

}
