import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
import App from '../imports/ui/App';
import './api';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});
