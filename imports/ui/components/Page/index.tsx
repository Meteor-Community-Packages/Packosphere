import React from 'react';

const PageComponent = ({ children }: { children: React.ReactNode | null }): JSX.Element => (
  <main className="px-4 py-10">
    <div className="container flex flex-col space-y-10 mx-auto">
      {children}
    </div>
  </main>
);

export default PageComponent;
