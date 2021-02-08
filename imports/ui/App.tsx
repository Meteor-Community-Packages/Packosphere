import LandingPage from './pages/Landing';
import SearchPage from './pages/Search';
import PackagePage from './pages/Package';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default (): JSX.Element => {
  return (
    <Router>
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
      </Switch>
    </Router>
  );
};
