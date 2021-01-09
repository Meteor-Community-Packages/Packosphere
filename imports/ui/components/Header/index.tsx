import React from 'react';

export interface HeaderLink {
  title: string
  url: string
}

interface HeaderProps {
  links: HeaderLink[]
}

export default ({ links }: HeaderProps): JSX.Element => (
  <header className="py-3 md:py-6 px-4">
    <div className="flex flex-col md:flex-row container m-auto justify-between items-center">
      <div className="flex items-center">
        <span className="flex-shrink-0 p-1.5 mr-3 from-yellow-600 via-yellow-500 to-yellow-400 bg-gradient-to-tl rounded-full inline-flex">
          <img
            src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
            alt=""
            className="w-20 rounded-full ring-white ring-2"
          />
        </span>
        <div className="flex flex-col-reverse">
          <h1 className="text-2xl font-semibold">Packosphere</h1>
          <h2 className="text-sm">Meteor Community</h2>
        </div>
      </div>
      <hr className="m-2" />
      <ul className="flex space-x-5 md:space-x-4 lg:space-x-8 font-semibold from-yellow-400 via- via-yellow-500 bg-gradient-to-b bg-yellow-800 bg-clip-text text-gray-500">
        {links.map(({ url, title }) => (
          <a href={url} className="hover:text-transparent" key={title}><li className="">{title}</li></a>
        ))}
      </ul>
    </div>
  </header>
);
