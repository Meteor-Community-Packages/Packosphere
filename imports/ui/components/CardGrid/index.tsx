import React from 'react';
import PackageCard from '../PackageCard';
import { ILatestPackagesQueryResult } from '../../../../client/api';

interface CardGridProps {
  cardData: ILatestPackagesQueryResult[]
};

const CardGridComponent = ({ cardData }: CardGridProps): JSX.Element => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {cardData.map((data, index) => <PackageCard cardData={data} key={index} />)}
    </ul>
  );
};

export default CardGridComponent;
