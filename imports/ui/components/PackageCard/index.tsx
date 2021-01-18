import React from 'react';
import { CloudDownloadOutline } from 'heroicons-react';
import human from 'human-number';

const mapper = (n: number): string => {
  const ns = n.toString();
  if (ns.includes('.')) {
    return n.toFixed(1);
  }
  return ns;
};

export default ({ data: { packageName, meta, description } }: any): JSX.Element => (
  <li className="bg-white p-5 border, border-gray-300 shadow-lg flex flex-col space-y-5 flex-grow">
    <h2 className="text-lg font-semibold text-blueGray-700">{packageName}</h2>
    <p className="text-gray-500 my-4 flex-grow h-28 break-words">{description}</p>
    <div className='flex items-center space-x-1 text-blueGray-500 text-sm'>
      <div className="from-yellow-600 to-yellow-500 bg-gradient-to-tl px-3 py-1.5 space-x-1 flex items-center rounded-full text-xs text-white">
        <CloudDownloadOutline size={18} />
        <span>{meta.totalAdds > 0 ? human(meta.totalAdds, mapper) : '0'}</span>
      </div>
    </div>
  </li>
);
