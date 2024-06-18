import React from 'react';
import ZKZg from '../assets/images/ZKZg.gif'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loading = ({ src, alt }) => {
  const notify = (msg,choose) => {
    if (choose === 1)
      toast.success(msg)
    else if (choose === 2) 
      toast.error(msg)
  };

  return (
    <div className="">
      <div className="bg-white flex justify-center rounded-md p-4">
        <img src={ZKZg} alt={alt} className="w-[50px] h-[50px] object-contain" />
      </div>
    </div>
  );
};

export default Loading;