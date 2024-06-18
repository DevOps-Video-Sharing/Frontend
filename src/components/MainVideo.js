import React, {useEffect,useState, useRef} from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { CiShare1 } from "react-icons/ci";
import axios from "axios";
import CopyButton from "./ButtonCustom/CopyButton";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Mainvideo = (props) =>
{
  const notify = (msg,choose) => {
    if (choose === 1)
      toast.success(msg)
    else if (choose === 2) 
      toast.error(msg)
  };

    const myId = localStorage.getItem('userToken')
    const videoRef = useRef(null);
    const [videoHeight, setVideoHeight] = useState('auto');
    const [values, setValueIds] = useState();
    const [numLike, setNumLike] = useState(0)
    const [isLike, setIsLike] = useState(false)
    const [displayVideo, setDisplayVideo] = useState()


    const handleGetVideoId = async ( videoId) => {
        const apiUrl = `${process.env.REACT_APP_API_URL}/video/getVideoIdFromThumbnailId/` + videoId;
        const response = await fetch(apiUrl);
        const result = await response.text();
        await fetch(`${process.env.REACT_APP_API_URL}/video/updateViews/${videoId}`, {method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },})
        setDisplayVideo(result)
        try {
          const data = await axios.get(`${process.env.REACT_APP_API_URL}/video/getLikeCount?videoId=${videoId}`);
          console.log('dis',displayVideo)
          setNumLike(data.data)
          
          const dataIsLike = await axios.get(`${process.env.REACT_APP_API_URL}/video/isLiked?likerToId=${myId}&likedToId=${videoId}`);
          setIsLike(dataIsLike.data)
  
        } catch (error) {
          
        }
      };
      
    const actLikeVideo = async(act) =>{
        try {
          const body = {
            likerToId: myId,
            likedToId: myId
          }
          if (!act)
          {
            await axios.post(`${process.env.REACT_APP_API_URL}/video/like?likerToId=${myId}&likedToId=${props?.videoId}`, body)
          }
          else{
            await axios.post(`${process.env.REACT_APP_API_URL}/video/unlike?likerToId=${myId}&likedToId=${props?.videoId}`, body)
          }
        } catch (error) {
          
        }
      }
    const handleLike= () =>{
        if (!isLike)
        {
            setNumLike(numLike+1)
            setIsLike(!isLike)
            }
        else 
        {
            setNumLike(numLike-1)
            setIsLike(!isLike)
        }
        actLikeVideo(isLike)
    }
      
    useEffect(() => {
      const video = videoRef.current;
      const resizeVideo = () => {
        if (video) {
          const videoWidth = video.clientWidth;
          const aspectRatio = video.videoWidth / video.videoHeight;
          setVideoHeight(`${videoWidth / aspectRatio}px`);
        }
      };
      window.addEventListener('resize', resizeVideo);
      resizeVideo();
      return () => {
        window.removeEventListener('resize', resizeVideo);
      };
    }, []);
    useEffect(()=>
    {
        handleGetVideoId(props?.videoId)
    },[])
    function formatMongoTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        const year = date.getFullYear();
      
        return `Ngày ${day}, ${month} năm ${year}`;
      }


    return(
        <div className=''>
            <ToastContainer position='bottom-right'/>
            <div className='flex justify-center'>
                <div className='w-full h-auto bg-white'>
                    <video src ={`${process.env.REACT_APP_API_URL}/video/get/${displayVideo}`} controls  
                        autoPlay
                        muted
                        loop
                        ref={videoRef}
                        style={{ height: videoHeight }}
                        className='p-[10px] pb-[15px] w-full h-full'
                        type="video/mp4"/>
                </div>
            </div>
            {/* <div className='flex justify-center w-full'> */}
            <div>
                <p className='font-medium font-roboto  bg-white pl-[20px] text-[24px]'>
                    {props?.title}
                    </p>

                <hr></hr>
            </div>
            <div>
                <div className='font-roboto flex justify-between bg-white pb-[20px] px-[25px] pt-[10px]'>
                    <button className='text-[#3e3e3e] hover:decoration-1 hover:underline'
                        onClick={props?.onClick}>
                        Xem bình luận</button>
                    <div className='flex '>
                        <button className='items-center select-none disabled flex py-[8px] px-[20px] rounded-[20px]  bg-[#f3f3f3]'
                          onClick={handleLike} >
                          {numLike === null || numLike === undefined?'0': numLike}
                          {!isLike?
                            <AiOutlineLike className='size-[30px] ml-[5px]'/>:
                            <AiFillLike className='size-[30px] ml-[5px]'/>
                  
                          }
                        </button>
                        <CopyButton msg={ window.location.href} className='items-center h-[50px] ml-[20px] flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'
                              handleSuc={()=>notify('Đã copy đường dẫn',1)} handleLos={()=>{notify('Copy thất bại',2)}}>
                            Chia sẻ
                            <CiShare1 className='size-[30px] ml-[5px]'/>
                        </CopyButton>      
                    </div>
                </div>
            </div>
            <div>
                <div className={`bg-white py-3 ] shadow-xl ${props?.isActive?'rounded-b-[10px':'rounded-bl-[10px'}`} >
                    <p className='font-medium mx-[20px] rounded-[10px] my-[5px] px-[15px] py-[8px] bg-[#f2f2f2] '> 
                     {props?.view} lượt xem | {formatMongoTimestamp(props?.timestamp)}
                        <br/>
                        <p className='leading-6 mt-[5px] font-normal '>
                        {props?.descript} </p>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Mainvideo