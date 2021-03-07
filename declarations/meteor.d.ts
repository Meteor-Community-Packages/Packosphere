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
