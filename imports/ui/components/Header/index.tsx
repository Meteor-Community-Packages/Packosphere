import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState, useRef } from 'react';
import gravatar from 'gravatar';
import { Link, useHistory } from 'react-router-dom';
import { Search, Login, AdjustmentsOutline } from 'heroicons-react';
import useLocationQuery from '../../hooks/useLocationQuery';
import { useTracker } from 'meteor/react-meteor-data';
import Modal from '../Modal';
import SearchFilters, { SearchParameters } from '../SearchFilters';

const links = [
  { title: 'About Us', url: 'https://meteorjs.community', external: true },
  { title: 'Packages', url: '/communitypackages' },
  { title: 'People', url: 'https://github.com/orgs/Meteor-Community-Packages/people', external: true },
  { title: 'GitHub', url: 'https://github.com/Meteor-Community-Packages', external: true },
  { title: 'Slack', url: 'https://tinyurl.com/mcg-slack', external: true },
];

const removeEmptyStrings = (obj: any): any => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string' && obj[key].length > 0) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const HeaderComponent = (): JSX.Element => {
  const [locationQuery, setLocationQuery] = useLocationQuery();
  const q = locationQuery.q as string ?? '';
  const published = locationQuery.published as string ?? '';
  const sort = locationQuery.sort as string ?? '';
  const deprecated = locationQuery.deprecated as string ?? '';
  const [searchQuery, setSearchQuery] = useState(q);
  const [totalAppliedFilters, setTotalAppliedFilters] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useRef<SearchParameters>({ published, sort, deprecated });

  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen((location, action: string) => {
      setTimeout(() => {
        if (action !== 'POP') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      });
    });
    return () => { unlisten(); };
  }, []);

  const user = useTracker(() => {
    return Meteor.user();
  });

  const userImage = gravatar.url(user?.services?.['meteor-developer'].emails[0].address, { s: '100', r: 'pg', d: 'https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png' }, true);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    changeSearchQuery();
  };
  const changeSearchQuery = (): void => {
    if (searchQuery.length > 0) {
      setLocationQuery({ path: '/search', params: { q: searchQuery, ...searchParams.current } });
    }
  };
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };
  const openModalHandler = (): void => {
    setIsModalOpen(true);
  };
  const closeModalHandler = (e: React.MouseEvent, currentTarget?: HTMLDivElement | null): void => {
    if (currentTarget === null || typeof currentTarget === 'undefined' || e.target === currentTarget) {
      setIsModalOpen(false);
    }
  };
  const searchFilterHandler = (filterData: SearchParameters, numAppliedFilters: number): void => {
    searchParams.current = filterData;
    setTotalAppliedFilters(numAppliedFilters);
    setIsModalOpen(false);
    changeSearchQuery();
  };

  const loginHandler = (): void => {
    Meteor.loginWithMeteorDeveloperAccount();
  };
  return (
    <header className="px-4 bg-gradient-to-t from-blueGray-800 to-blueGray-900">
      <div className="flex justify-center md:justify-end container m-auto py-5">
        <ul className="flex space-x-5">
          {links.map(link => (
            <li key={link.title}>
              {typeof link.external === 'undefined'
                ? <Link to={link.url}>{link.title}</Link>
                : <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
              }
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-8 pb-4 flex flex-col lg:flex-row container space-y-10 lg:space-y-0 m-auto justify-between items-center">
        <Link to="/" className="flex items-center space-x-5">
          <span className="flex-shrink-0 p-1.5 from-yellow-600 via-yellow-500 to-yellow-400 bg-gradient-to-tl rounded-full inline-flex">
            <img
              src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
              alt="Meteor Community Logo"
              className="w-20 rounded-full ring-white ring-2"
            />
          </span>
          <div className="flex flex-col">
            <p className="text-sm">Meteor Community</p>
            <p className="text-3xl font-semibold">Packosphere</p>
          </div>
        </Link>
        <div className="flex items-center space-x-5">
          <button onClick={openModalHandler} className="relative items-center justify-center w-12 h-12 flex flex-shrink-0 rounded-md focus:outline-none hover:bg-blueGray-600 active:bg-blueGray-700" aria-label="Search">
            <AdjustmentsOutline size={28} className="z-0" />
            {totalAppliedFilters > 0 ? <span className="absolute w-5 h-5 z-10 -top-0 right-0 text-sm font-semibold bg-yellow-500 rounded-full flex items-center justify-center">{totalAppliedFilters}</span> : null}
          </button>
          <Modal isOpen={isModalOpen} onClose={closeModalHandler}>
            <SearchFilters onApply={searchFilterHandler} onCancel={closeModalHandler} initialValues={removeEmptyStrings({ sort, published, deprecated })} />
          </Modal>
          <span className="from-yellow-700 to-yellow-600 bg-gradient-to-t rounded-md flex-shrink py-1 px-6 pr-4 inline-flex lg:flex-grow items-center">
            <form onSubmit={submitHandler} className="flex items-center" autoComplete="off">
              <input type="text" name='search' autoFocus onChange={changeHandler} value={searchQuery} className="bg-transparent outline-none w-full text-white flex-grow flex-shrink text-xl placeholder-gray-100 p-0 focus:ring-0 border-0" placeholder="Search Packages" />
              <button className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full focus:outline-none focus:bg-yellow-600 hover:bg-yellow-600" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </span>
          <div className="flex items-center justify-center flex-shrink-0">
            {Meteor.userId() !== null
              ? <img src={userImage} alt={`${user?.profile.name}'s Avatar`} className="w-11 h-11 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
              : <button onClick={loginHandler} title="Log In" className="flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-blueGray-500 bg-blueGray-600 flex-shrink-0 focus:outline-none" >
                <Login size={22} />
              </button>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
