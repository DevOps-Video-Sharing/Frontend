import React, { useEffect } from "react";
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
const VideoComponent = (props) =>
{
    const navigate = useNavigate()
    const handleClick = async ( videoId) => {
        const apiUrl = "http://localhost:8080/video/getVideoIdFromThumbnailId/" + videoId;
        const response = await fetch(apiUrl);
        const result = await response.text();
        await fetch(`http://localhost:8080/video/updateViews/${videoId}`, {method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },})
        const apiVideo = "http://localhost:8080/video/get/" + result;
        console.log(apiVideo)
        navigate(`/video?videoId=${result}&v=${props?.view}&id=${props?.userid}&thumb=${videoId}`)
      };
      const timestamp = new Date(props?.timestamp);
      const formattedTime = formatTimestamp(timestamp);
    return(
        <div className='w-3/12  flex'  onClick={()=>handleClick(props?.videoId)}>
                    <div className='p-[15px] hover:bg-[#dddddd] bg-white mx-4 my-4 mb-10 drop-shadow-lg rounded-[10px] cursor-pointer peer peer-focus:bg-[#f2f2f2]'>
                        <img className=' w-[370px] h-[220px] rounded-[20px]' src={props?.img} alt='other'/>
                        <div className='font-roboto  mr-2  '>
                            <p className='text-[18px] font-medium text-black mt-3 leading-6'>{props?.title}</p>
                            <p className='text-[16px] mt-1'>{props?.username}</p>
                            <div className='flex text-[16px] justify-between'>
                                <p>{props?.view === undefined? '0':props?.view} views</p>
                                <p>{formattedTime}</p>
                            </div>
                        </div>
                    </div>                 
                   
                </div>
    )
}
export default VideoComponent