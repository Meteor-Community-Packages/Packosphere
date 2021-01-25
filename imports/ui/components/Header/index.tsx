import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'heroicons-react';
import useSearchQuery from '../../hooks/useSearchQuery';

const links = [
  { title: 'About', url: '' },
  { title: 'Packages', url: '' },
  { title: 'Projects', url: '' },
  { title: 'People', url: '' },
  { title: 'Contact', url: '' },
];

export default (): JSX.Element => {
  const [locationQuery, setLocationQuery] = useSearchQuery();
  const [searchState, setSearchState] = useState(locationQuery.q as string);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchState.length > 0) {
      setLocationQuery({ path: '/search', params: { q: searchState } });
    }
  };
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setSearchState(e.target.value);
  };
  return (
    <header className="px-4 bg-gradient-to-t from-blueGray-800 to-blueGray-900 text-white">
      <div className="flex justify-center md:justify-end container m-auto py-5">
        <ul className="flex space-x-5">
          {links.map(link => (
            <a href={link.url} key={link.title}><li>{link.title}</li></a>
          ))}
        </ul>
      </div>
      <div className="pt-8 pb-4 flex flex-col lg:flex-row container space-y-10 lg:space-y-0 m-auto justify-between items-center">
        <Link to="/" className="flex items-center space-x-5">
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
        </Link>
        <div className="flex items-center space-x-5">
          <span className="from-yellow-700 to-yellow-600 bg-gradient-to-t rounded-md flex-shrink py-1 px-6 pr-4 inline-flex lg:flex-grow items-center">
            <form onSubmit={submitHandler} className="flex items-center">
              <input type="text" name='search' onChange={changeHandler} value={searchState} className="bg-transparent outline-none w-full text-white flex-grow flex-shrink text-xl placeholder-gray-100" placeholder="Search Packages" />
              <button className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full focus:outline-none focus:bg-yellow-600 hover:bg-yellow-600">
                <Search size={18} />
              </button>
            </form>
          </span>
          <div className="flex items-center justify-center flex-shrink-0">
            <img src="https://ca.slack-edge.com/TNJ4JE5U6-UNHPNU2B1-g4c5d9c8611d-48" className="w-11 h-11 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
          </div>
        </div>
      </div>
    </header>
  );
};
