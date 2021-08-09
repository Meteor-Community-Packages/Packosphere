import React from 'react';
import { Heart } from 'heroicons-react';

const Footer = (): JSX.Element => {
  return (
    <footer>
      <section className="p-10 flex items-center justify-center space-x-1 lg:order-2 text-xl bg-gradient-to-b from-blueGray-800 to-blueGray-900">
        <span>Created with</span>
        <span className="flex h-7 w-7 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blueGray-600 opacity-30"></span>
          <Heart size={28} className="text-yellow-700 relative z-10" />
        </span>
        <span>by <a href="https://github.com/sponsors/copleykj/" className="text-blueGray-400">copleykj</a></span>
      </section>
      <div className="bg-blueGray-900 px-4 py-6">
        <div className="container m-auto flex flex-col text-center lg:grid grid-cols-4 space-y-10 lg:space-y-0">
          <aside className="space-y-1">
            <h2 className="text-lg font-bold text-yellow-700 mb-4">Packosphere</h2>
            <ul className="li"><a href="https://github.com/sponsors/copleykj">Sponsor Development</a></ul>
            <ul className="li"><a href="https://github.com/Meteor-Community-Packages/Packosphere/issues">Report Issues</a></ul>
            <ul className="li"><a href="https://github.com/Meteor-Community-Packages/Packosphere/">Pitch In</a></ul>
          </aside>
          <aside className="space-y-1">
            <h2 className="text-lg font-bold text-yellow-700 mb-4">Meteor Resources</h2>
            <ul className="li"><a href="https://cloud.meteor.com">Meteor Cloud</a></ul>
            <ul className="li"><a href="https://guide.meteor.com">Meteor Guide</a></ul>
            <ul className="li"><a href="https://docs.meteor.com">Meteor Docs</a></ul>
          </aside>
          <aside className="space-y-1">
            <h2 className="text-lg font-bold text-yellow-700 mb-4">Jobs</h2>
            <ul className="li"><a href="https://weworkmeteor.com">WeWorkMeteor</a></ul>
            <ul className="li"><a href="https://jobs.meteor.com">Meteor Jobs</a></ul>
          </aside>
          <aside className="space-y-1">
            <h2 className="text-lg font-bold text-yellow-700 mb-4">Community Resources</h2>
            <ul className="li"><a href="https://github.com/Urigo/awesome-meteor">Awesome Meteor</a></ul>
            <ul className="li"><a href="https://www.meteor-tuts.com/">Meteor Tuts</a></ul>
          </aside>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
