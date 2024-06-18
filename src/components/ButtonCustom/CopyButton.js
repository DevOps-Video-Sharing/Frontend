import React from 'react';
import { CiShare1 } from "react-icons/ci";

const CopyButton = (props) => {

  const handleCopy = () => {
    navigator.clipboard.writeText(props?.msg)
      .then(() => {
        console.log('Text copied to clipboard');
        props?.handleSuc()
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        props?.handleLos()
      });
  };

  return (
    <button onClick={handleCopy} className='items-center h-[50px] ml-[20px] flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'>
      Chia sẻ
      <CiShare1 className='size-[30px] ml-[5px]'/>
    </button>       
    );
};

export default CopyButton;
