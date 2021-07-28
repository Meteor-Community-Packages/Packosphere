declare module 'meteor/accounts-base' {
  module Accounts {
    var _defaultPublishFields: {
      projection: any
    };
  }
}

declare module 'meteor/webapp' {
  module WebApp {
    export function addHtmlAttributeHook (callback: () => any): void;
  }
}

declare module 'meteor/communitypackages:react-router-ssr'
declare module 'meteor/communitypackages:fast-render'
