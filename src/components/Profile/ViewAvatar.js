import React, {useState} from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { useSearchParams } from 'react-router-dom';
const ViewAvatar = (props) => {
    const [searchParams] = useSearchParams()
    return (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="bg-white flex justify-center rounded-md p-2 w-5/12 aspect-square relative">
        <img src={`data:image/jpeg;base64,${props?.im}`} alt={'avatar'} className="w-full h-full object-contain z-80" />
        <IoMdCloseCircle className='bg-white p-0 rounded-[50%] absolute top-0 right-[0px] size-[45px] z-50 cursor-pointer'
                        onClick={props?.handle}/>
        </div>
    </div>
    );
};

export default ViewAvatar;