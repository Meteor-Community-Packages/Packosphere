import LandingPage from './pages/Landing';
import SearchPage from './pages/Search';
import PackagePage from './pages/Package';
import MaintainerPage from './pages/Maintainer';

import Header from './components/Header';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = (): JSX.Element => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
