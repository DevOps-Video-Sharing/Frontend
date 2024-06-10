import React from 'react';
import ZKZg from '../assets/images/ZKZg.gif'

const Loading = ({ src, alt }) => {
  return (
    <div className="">
      <div className="bg-white flex justify-center rounded-md p-4">
        <img src={ZKZg} alt={alt} className="w-[50px] h-[50px] object-contain" />
      </div>
    </div>
  );
};

export default Loading;