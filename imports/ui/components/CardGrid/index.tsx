import React from 'react';
import PackageCard from '../PackageCard';

interface CardGridProps<T> {
  cardData: T[]
};

export default function <T>({ cardData }: CardGridProps<T>): JSX.Element {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {cardData.map((data, index) => <PackageCard data={data} key={index} />)}
    </ul>
  );
}
