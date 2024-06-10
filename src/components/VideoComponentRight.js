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
const VideoComponentRight = (props) =>
{
    const navigate = useNavigate()
    const handleClick = async ( videoId) => {
        const apiUrl = "http://localhost:8080/video/getVideoIdFromThumbnailId/" + videoId;
        const response = await fetch(apiUrl);
        const result = await response.text();
        const apiVideo = "http://localhost:8080/video/get/" + result;
        console.log(apiVideo)
        navigate(`/video?videoId=${result}`)
      };
      const timestamp = new Date(props?.timestamp);
      const formattedTime = formatTimestamp(timestamp);
    return(
        <div className='pl-[20px] my-[10px] flex cursor-pointer peer peer-focus:bg-[#f2f2f2]' onClick={()=>handleClick(props?.videoId)}>

            <div className="w-[650px] h-[170px] ">
              <img className='w-full h-full rounded-[20px]' src={props?.img} alt='other'/>

            </div>
            <div className='font-roboto ml-[20px] w-full mr-2  '>
                <p className='text-[19px] font-bold text-black'>{props?.title}</p>
                <p className='text-[16px]'>{props?.username}</p>
                <div className='flex justify-between text-[12px] mr-4'>
                    <p>{props?.view} views</p>
                    <p>{formattedTime}</p>
                </div>
            </div>
        </div>
    )
}
export default VideoComponentRight