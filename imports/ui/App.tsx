import LandingPage from './pages/Landing';
import SearchPage from './pages/Search';
import PackagePage from './pages/Package';
import MaintainerPage from './pages/Maintainer';

import Header from './components/Header';
import Footer from './components/Footer';

import React from 'react';
import { Outlet } from 'react-router-dom';
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr';
import { ShareButton } from './components/ShareButton';

// Layout component wraps all routes
const Layout = (): JSX.Element => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <Outlet />
      </div>
      <div className="fixed bottom-10 right-10 w-14 h-14 rounded-full hover:bg-yellow-500 bg-yellow-600 shadow-lg">
        <ShareButton />
      </div>
      <Footer />
    </>
  );
};

// Routes array for react-router-ssr v6
const AppRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: ':username/:packagename/:version?', element: <PackagePage /> },
      { path: ':username', element: <MaintainerPage /> },
    ],
  },
];

renderWithSSR(AppRoutes);

// Export for potential client-side use
export { AppRoutes };
