import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-6 w-16" />
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
