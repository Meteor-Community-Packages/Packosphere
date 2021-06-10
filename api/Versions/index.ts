import { PackageServer } from 'meteor/peerlibrary:meteor-packages';
import SimpleSchema from 'simpl-schema';

const { Versions } = PackageServer;

const VersionsSchema = new SimpleSchema({
  packageName: String,
  version: String,
  description: String,
  longDescription: String,
  git: {
    type: String,
    optional: true,
  },
  source: new SimpleSchema({
    url: String,
    tarballHash: String,
    treeHash: String,
  }),
  readme: {
    type: new SimpleSchema({
      url: String,
      hash: String,
      fullText: {
        type: String,
        optional: true,
      },
    }),
  },
  dependencies: Array,
  'dependencies.$': new SimpleSchema({
    constraint: {
      type: String,
      optional: true,
    },
    references: Array,
    'references.$': new SimpleSchema({
      arch: String,
      weak: {
        type: Boolean,
        optional: true,
      },
      unordered: {
        type: Boolean,
        optional: true,
      },
      implied: {
        type: Boolean,
        optional: true,
      },
    }),
    packageName: String,
  }),
  exports: Array,
  'exports.$': new SimpleSchema({
    name: String,
    architectures: Array,
    'architectures.$': String,
  }),
  unmigrated: {
    type: Boolean,
    optional: true,
  },
  debugOnly: {
    type: Boolean,
    optional: true,
  },
  earliestCompatibleVersion: String,
  publishedBy: new SimpleSchema({
    username: String,
    id: SimpleSchema.RegEx.Id,
  }),
  published: Date,
  lastUpdated: Date,
  ecRecordFormat: String,
  compilerVersion: String,
  releaseName: {
    type: String,
    optional: true,
  },
  lastFetched: {
    type: Date,
    optional: true,
  },
  lastComputed: {
    type: Date,
    optional: true,
  },
});

Versions.attachSchema(VersionsSchema);

export { Versions, VersionsSchema };
