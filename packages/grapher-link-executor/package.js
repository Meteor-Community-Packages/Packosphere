Package.describe({
  name: 'copleykj:grapher-link-executor',
  version: '3.0.0',
  summary: 'Execute grapher links in correct order - Meteor 3.0 compatible',
  git: 'https://github.com/copleykj/grapher-link-executor',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom(['3.0.1', '3.1']);
  api.use([
    'ecmascript',
    'typescript',
    'mongo',
    'cultofcoders:grapher',
  ]);

  api.mainModule('grapher-link-executor.ts');
});
