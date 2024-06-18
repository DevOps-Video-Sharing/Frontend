import React from "react";
import {  useNavigate } from 'react-router-dom';

function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    // Tính toán số phút, số giờ, số ngày
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Định dạng lại thời gian
    if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else {
      return `${days} ngày trước`;
    }
  }
const VideoSearch = (props) =>
{
    const navigate = useNavigate()
    const handleClick = async ( videoId) => {
        const apiUrl = `${process.env.REACT_APP_API_URL}/video/getVideoIdFromThumbnailId/` + videoId;
        const response = await fetch(apiUrl);
        const result = await response.text();
        const apiVideo = `${process.env.REACT_APP_API_URL}/video/get/` + result;
        console.log(apiVideo)
        navigate(`/video?videoId=${result}&v=${props?.view}&id=${props?.userid}&thumb=${videoId}`)

        window.location.reload()
      };
      const timestamp = new Date(props?.timestamp);
      const formattedTime = formatTimestamp(timestamp);
    return(
        <div className="flex justify-center">
            <div className=' hover:bg-[#dddddd] drop-shadow-xl py-3 px-3 rounded-[20px] border-[3px]  w-[60%] my-[10px] flex cursor-pointer peer peer-focus:bg-[#f2f2f2]' onClick={()=>handleClick(props?.videoId)}>

                <div className="w-[60%] h-[220px] ">
                <img className='w-full h-full rounded-[20px]' src={props?.img} alt='other'/>

                </div>
                <div className='font-roboto ml-[20px] w-full mr-2  '>
                    <p className='text-[30px] font-bold text-black'>{props?.title}</p>
                    <p className='text-[24px]'>{props?.username}</p>
                    <div className='flex justify-between text-[15px] mr-4'>
                        <p>{props?.view} views</p>
                        <p>{formattedTime}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default VideoSearch