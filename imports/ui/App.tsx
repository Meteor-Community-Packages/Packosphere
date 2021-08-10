import LandingPage from './pages/Landing';
import SearchPage from './pages/Search';
import PackagePage from './pages/Package';
import MaintainerPage from './pages/Maintainer';

import Header from './components/Header';
import Footer from './components/Footer';

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr';
import { ShareButton } from './components/ShareButton';

export const App = (): JSX.Element => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/search">
            <SearchPage />
          </Route>
          <Route exact path="/:username/:packagename/:version?">
            <PackagePage />
          </Route>
          <Route path="/:username">
            <MaintainerPage />
          </Route>
        </Switch>
      </div>
      <div className="fixed bottom-10 right-10 w-14 h-14 rounded-full hover:bg-yellow-500 bg-yellow-600 shadow-lg"><ShareButton /></div>
      <Footer />
    </>
  );
};

renderWithSSR(<App />);
