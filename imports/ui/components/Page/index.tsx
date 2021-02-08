import React from 'react';

export default ({ children }: { children: JSX.Element | null }): JSX.Element => (
  <main className="px-4 py-10">
    <div className="container flex flex-col space-y-10 mx-auto">
      {children}
    </div>
  </main>
);
