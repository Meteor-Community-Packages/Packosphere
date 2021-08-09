import React from 'react';
import { Link } from 'react-router-dom';
import { CloudDownloadOutline } from 'heroicons-react';
import human from 'human-number';
import ago from 's-ago';

import { ILatestPackagesQueryResult } from '../../../../api';

interface PackageCardProps {
  cardData: ILatestPackagesQueryResult
}

const mapper = (n: number): string => {
  const ns = n.toString();
  if (ns.includes('.')) {
    return n.toFixed(1);
  }
  return ns;
};

const PackageCardComponent = ({ cardData: { packageName, meta: { totalAdds, maintainers }, published, description, unmigrated } }: PackageCardProps): JSX.Element | null => {
  if (typeof unmigrated !== 'undefined' || typeof packageName === 'undefined') return null;
  let username = 'meteor';
  let packagename;

  if (packageName?.includes(':')) {
    ([username, packagename] = packageName.split(':'));
  } else {
    packagename = packageName;
  }

  return (
    <li className="flex flex-col md:h-72 bg-blueGray-700 text-white p-7 pb-4 border, rounded-md border-gray-300 shadow-lg relative">
      <Link to={`/${username}/${packagename}`} className="absolute inset-0 z-0" >
        <span className="sr-only">{packageName}</span>
      </Link>
      <h2 className="font-semibold">
        {username !== 'meteor' &&
            <span className="inline-block">
              <Link to={`/${username}`} className="relative z-10">{username}</Link>:
            </span>}
        <span className="inline-block">{packagename}</span>
      </h2>
      <p className="text-gray-300 my-4 break-words flex-auto">{description}</p>
      <div className='flex items-center space-x-1 justify-between'>
        <p className="text-xs">{ago(published)}</p>
        <div className="flex items-center space-x-2">
          <div className="space-x-1 flex items-center rounded-sm text-xs font-semibold text-white">
            <CloudDownloadOutline size={18} />
            <span>{typeof totalAdds !== 'undefined' && totalAdds > 0 ? human(totalAdds, mapper) : '0'}</span>
          </div>
          {maintainers.some(maintainer => { return maintainer.username === 'communitypackages'; })
            ? <img
              src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
              alt=""
              className="w-6 rounded-full ring-white ring-1"
              title="Community Maintained"
            />
            : null
          }
        </div>
      </div>
    </li>
  );
};

export default PackageCardComponent;
