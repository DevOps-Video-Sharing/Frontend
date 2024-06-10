import React, { useEffect, useState, useRef } from 'react';
import NavbarApp from '../components/NavbarApp'
import thumnail from '../assets/images/thumnail.png'
import { IoIosCloudUpload } from "react-icons/io";  
import { AiFillLike, AiOutlineLike, AiOutlineDislike  } from "react-icons/ai";
import st from '../assets/st.mp4'
import { CiShare1 } from "react-icons/ci";
import avar from '../assets/images/avar.jpg'
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useSearchParams, useParams , useNavigate } from 'react-router-dom';
import VideoComponentRight from '../components/VideoComponentRight';
import Loading from '../components/Loading';
import Comment from '../components/Comment/Comment'
import axios from 'axios';


const Video = (props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('videoId');
  const view = searchParams.get('v');
  const usId = searchParams.get('id')
  const thumbId = searchParams.get('thumb')
  const myId = localStorage.getItem('userToken')
  const [videoInfor, setVideoInfor] = useState()

  const [videoUrls, setVideoUrls] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [videoIds, setVideoIds] = useState([]);
  const [formatTime, setFormatTime] = useState()
  const [values, setValueIds] = useState();
  const [numLike, setNumLike] = useState(0)
  const [isLike, setIsLike] = useState(false)
  const [isSub, setIsSub] = useState(false)
  const [numSub, setNumSub] = useState(0)
  // useEffect(() => {
  //   const fetchVideoIds = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/video/getAllIds');
  //       if (response.ok) {
  //         const ids = await response.json();
  //         setVideoIds(ids);
  //         // console.log(videoIds);
  //       } else {
  //         console.error('Failed to fetch video ids');
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch video ids:', error);
  //     }
  //   };

  //   fetchVideoIds();
  // }, []);
  const videoRef = useRef(null);
  const [videoHeight, setVideoHeight] = useState('auto');

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
  useEffect(()=>{
    const fetchInforVideo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/video/getDetails/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          const mongoTimestamp = new Date(data.metadata.timestamp); // Timestamp của MongoDB
          setFormatTime(formatMongoTimestamp(mongoTimestamp));
          setVideoInfor(data)
        } else {
          console.error('Failed ');
        }
      } catch (error) {
        console.error('Failed: ', error);
      }
    };

    fetchInforVideo();
  },[])

  const generateVideoUrls = () => {
    return videoIds.map((id) => `http://localhost:8080/video/get/${id}`);
  };
  const videos = generateVideoUrls();
  function formatMongoTimestamp(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
  
    return `Ngày ${day}, ${month} năm ${year}`;
  }

  useEffect(()=>{
    const getLike= async() =>
    {
      try {
        const data = await axios.get(`http://localhost:8080/video/getLikeCount?videoId=${thumbId}`);
        setNumLike(data.data)
        
        const dataIsLike = await axios.get(`http://localhost:8080/video/isLiked?likerToId=${myId}&likedToId=${thumbId}`);
        console.log('ok',dataIsLike.data)
        setIsLike(dataIsLike.data)

      } catch (error) {
        
      }
    }
    const getSubscribe = async () =>
    {
      try {
          // const data = await axios.post(`http://localhost:8080/video/subscribe?subscriberId=${usId}&subscribedToId=${myId}`)
          const numOfSubs= await axios.get(`http://localhost:8080/video/getSubscriberCount?userId=${usId}`)
          setNumSub(numOfSubs.data)
          const dataIsSub = await axios.get(`http://localhost:8080/video/isSubscribed?subscriberId=${myId}&subscribedToId=${usId}`)
          setIsSub(dataIsSub.data)

      } catch (error) {
        
      }
    }


    getLike()
    getSubscribe()
  },[])
  const actLikeVideo = async(act) =>{
    try {
      const body = {
        likerToId: usId,
        likedToId: videoId
      }
      if (!act)
      {
        await axios.post(`http://localhost:8080/video/like?likerToId=${myId}&likedToId=${thumbId}`, body)
      }
      else{
        await axios.post(`http://localhost:8080/video/unlike?likerToId=${myId}&likedToId=${thumbId}`, body)
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
      console.log('nu1m', numLike-1)
      setIsLike(!isLike)
    }
    actLikeVideo(isLike)
  }
  const actSubVideo = async(act) =>{
    try {
      if (!act)
      {
        await axios.post(`http://localhost:8080/video/subscribe?subscriberId=${myId}&subscribedToId=${usId}`)
      }
      else{
        await axios.post(`http://localhost:8080/video/unsubscribe?subscriberId=${myId}&subscribedToId=${usId}`)
      }
    } catch (error) {
      
    }
  }
  const handleSub= () =>{
    if (!isSub)
    {
      setNumSub(numSub+1)
      setIsSub(!isSub)
      }
    else 
    {
      setNumSub(numSub-1)
      setIsSub(!isSub)
    }
    actSubVideo(isSub)
  }


  useEffect(() => {
    const fetchVideoIds = async () => {
      try {
        const response = await fetch('http://localhost:8080/video/listIdThumbnail');
        if (!response.ok) {
          throw new Error('Failed to fetch video ids');
        }
        const ids = await response.json();
        setVideoIds(ids);
        const fetchDataPromises = ids.map(async id => {
          // console.log(id)
          const response = await fetch(`http://localhost:8080/video/getDetails/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for id: ${id}`);
          }
          return response.json();
        });
        const data = await Promise.all(fetchDataPromises);
        setValueIds(data);
      } catch (error) {
        console.error('Failed to fetch video ids or data:', error);
      }
    };
  
    fetchVideoIds();
  }, []);
  
const generateThumbnailUrls = () => {
    return videoIds.map((id) => {
    return  `http://localhost:8080/video/get/${id}`
    });
};
const handleClickChannel = () =>
{
  navigate(`/profile?userId=${usId}`)
}

const thumbnails =  generateThumbnailUrls();
  return (
    <div>
      <NavbarApp/>
      <div className='h-[60px] '></div>
      <div className='px-[60px] py-[20px] flex'>
        <div className='w-8/12'>
            <div className=' h-auto bg-black'>
                <video src ={`http://localhost:8080/video/get/${videoId}`} controls  
                    autoPlay
                    muted
                    loop
                    style={{ height: '450px' }}
                    className=' pb-[15px] w-full h-full'
                    type="video/mp4"/>
            </div>
            <p className='font-medium font-roboto my-[10px]  bg-white  text-[24px]'>
                    {videoInfor?.metadata.videoName}  
                </p>
            <hr></hr>
            <div className='font-roboto flex justify-between bg-white pb-[15px] px-[5px] pt-[10px]'>
                <div>
                  <div className='flex items-center gap-4'>
                    <img alt='avar' src={avar} className='rounded-[50%] size-[50px] cursor-pointer' onClick={handleClickChannel}/>
                    <div>
                      <p className='text-[20px] cursor-pointer' onClick={handleClickChannel}>{videoInfor?.metadata.userName}</p>
                      <p className='text-[#606060]'>Theo dõi: {numSub === 'undefined' || numSub === undefined?'0': numSub}</p>
                    </div>
                    {
                      usId!==myId?
                      <button className={`flex items-center ml-[15px]  px-[15px] py-[8px] rounded-[15px] ${isSub?'bg-[#dadada] hover:bg-[#bfbfbf] text-black':'bg-[#d00b29] hover:bg-[#933240] text-white'}`}
                            onClick={handleSub}>
                            {isSub ? 'Hủy theo dõi' : 
                            <div className='flex'>Theo dõi <MdOutlineAddCircleOutline className='ml-[10px] size-[22px]'/></div>}
                      </button>
                      :
                      ''
                    }
                  </div>
                </div>
                <div className='flex '>
                    <button className='items-center h-[50px]  flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'
                      onClick={handleLike}>
                        {numLike}
                        {!isLike?
                          <AiOutlineLike className='size-[30px] ml-[5px]'/>:
                          <AiFillLike className='size-[30px] ml-[5px]'/>
                 
                        }
                    </button>
                    <button className='items-center h-[50px] ml-[20px] flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'>
                        Chia sẻ
                        <CiShare1 className='size-[30px] ml-[5px]'/>
                    </button>        
                </div>
            </div>
            <div className=' bg-white'>
                <p className='font-medium rounded-[10px] my-[5px] px-[15px] py-[8px] bg-[#f2f2f2] '> 
                  {console.log(view)}
                  {view === undefined || view === 'undefined'? '0':view}&nbsp;lượt xem&nbsp;|&nbsp;{formatTime}

                    <br/>
                    <p className='leading-6 mt-[5px] font-normal'>
                      {videoInfor?.metadata.description}
                       </p>
                </p>
            </div>
            <div className='my-[40px]'>

              <Comment/>
            </div>
        </div>



        <div className='w-1/3 flex flex-col'>
          {(values && values.length > 0 && thumbnails && thumbnails.length > 0) ? (
          videos.slice(0).map((url, index) => (
                <VideoComponentRight
                    key={videoIds[index]}
                    img={url}
                    title={values[index]?.metadata?.videoName}
                    username={values[index]?.metadata?.userName}
                    timestamp={values[index]?.metadata?.timestamp}
                    view={values[index]?.views}
                    videoId={videoIds[index]}
                    userid={values[index]?.metadata.userID}
                    />
                ))
                ) : (
                <Loading/>
                )}
          {/* <VideoComponentRight img={thumnail}/>   
          <VideoComponentRight img={thumnail}/>   
          <VideoComponentRight img={thumnail}/>   
          <VideoComponentRight img={thumnail}/>   
          <VideoComponentRight img={thumnail}/>    */}
        </div>

      </div>

    </div>
  );
};

export default Video;