import LandingPage from './pages/Landing';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};
