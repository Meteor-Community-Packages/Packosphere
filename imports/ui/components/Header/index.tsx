import React from 'react';

export interface HeaderLink {
  title: string
  url: string
}

interface HeaderProps {
  links: HeaderLink[]
}

export default ({ links }: HeaderProps): JSX.Element => (
  <header className="px-4 bg-gradient-to-t from-blueGray-800 to-blueGray-900 text-white">
    <div className="flex justify-center md:justify-end container m-auto py-5">
      <ul className="flex space-x-5">
        {links.map(link => (
          <a href={link.url}><li>{link.title}</li></a>
        ))}
      </ul>
    </div>
    <div className="pt-8 pb-4 flex flex-col lg:flex-row container space-y-10 lg:space-y-0 m-auto justify-between items-center">
      <div className="flex items-center space-x-5">
        <span className="flex-shrink-0 p-1.5 from-yellow-600 via-yellow-500 to-yellow-400 bg-gradient-to-tl rounded-full inline-flex">
          <img
            src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
            alt=""
            className="w-20 rounded-full ring-white ring-2"
          />
        </span>
        <div className="flex flex-col">
          <p className="text-sm">Meteor Community</p>
          <h1 className="text-3xl font-semibold">Packosphere</h1>
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <span className="from-yellow-700 to-yellow-600 bg-gradient-to-t rounded-full flex-shrink py-3 px-6 inline-flex lg:flex-grow items-center">
          <input type="text" className="bg-transparent outline-none w-full text-white flex-grow flex-shrink text-xl placeholder-gray-100" placeholder="Search Packages" />
          <svg className="w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>
        <div className="flex items-center justify-center flex-shrink-0">
          <img src="https://ca.slack-edge.com/TNJ4JE5U6-UNHPNU2B1-g4c5d9c8611d-48" className="w-11 h-11 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
        </div>
      </div>
    </div>
  </header>
);
