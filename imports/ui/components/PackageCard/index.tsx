import React from 'react';
import { CloudDownloadOutline } from 'heroicons-react';
import human from 'human-number';

import { ILatestPackagesQueryResult } from '../../../../client/api/LatestPackages';

interface PackageCardProps {
  data: ILatestPackagesQueryResult
}

const mapper = (n: number): string => {
  const ns = n.toString();
  if (ns.includes('.')) {
    return n.toFixed(1);
  }
  return ns;
};

export default ({ data: { packageName, meta: { totalAdds }, description } }: PackageCardProps): JSX.Element => {
  return (
    <li className="bg-blueGray-700 text-white p-7 border, rounded-md border-gray-300 shadow-lg flex flex-col space-y-5 flex-grow">
      <h2 className="text-lg font-semibold">{packageName}</h2>
      <p className="text-gray-300 my-4 flex-grow h-28 break-words">{description}</p>
      <div className='flex items-center space-x-1'>
        <div className="from-blueGray-700 to-blueGray-600 bg-gradient-to-t px-3 py-1.5 space-x-1 flex items-center rounded-sm text-xs font-semibold text-white">
          <CloudDownloadOutline size={18} />
          <span>{typeof totalAdds !== 'undefined' && totalAdds > 0 ? human(totalAdds, mapper) : '0'}</span>
        </div>
      </div>
    </li>
  );
};
