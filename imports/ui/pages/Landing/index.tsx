import React from 'react';
import Header from '../../components/Header';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useReactiveQuery';
import { QRecentlyPublishedPackages } from '../../../../api/LatestPackages';

const headerLinks = [
  { title: 'About', url: '' },
  { title: 'Packages', url: '' },
  { title: 'Projects', url: '' },
  { title: 'People', url: '' },
  { title: 'Contact', url: '' },
];

const query = QRecentlyPublishedPackages.clone();
export default (): JSX.Element => {
  const { data, ready } = useQuery(query);
  console.log(data);
  return (
    <>
      <Header links={headerLinks} />
      <section className="flex justify-center bg-gray-200 px-2">
        <div className="container m-auto flex items-center justify-between space-x-5">
          <span className="bg-white rounded-full py-2 px-5 inline-flex items-center w-full md:w-3/5 lg:w-2/5 xl:w-1/3">
            <input type="text" className="bg-transparent outline-none text-yellow-700 flex-grow text-xl placeholder-gray-500" placeholder="Search Packages" />
            <svg className="w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </span>

          <div className="flex items-center justify-center flex-shrink-0 px-3 py-4 cursor- hover:bg-gray-200">
            <img src="https://ca.slack-edge.com/TNJ4JE5U6-UNHPNU2B1-g4c5d9c8611d-48" className="w-10 h-10 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
            <svg className="ml-2 w-4 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-10">
        {ready && <CardGrid cardData={data} />}
      </main>
    </>
  );
};
