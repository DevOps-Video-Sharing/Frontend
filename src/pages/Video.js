import React, { useEffect, useState, useRef } from 'react';
import NavbarApp from '../components/NavbarApp'
import { AiFillLike, AiOutlineLike, AiOutlineDislike  } from "react-icons/ai";
import { CiShare1 } from "react-icons/ci";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useSearchParams, useParams , useNavigate } from 'react-router-dom';
import VideoComponentRight from '../components/VideoCom/VideoComponentRight';
import Loading from '../components/Loading';
import Comment from '../components/Comment/Comment'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import CopyButton from '../components/ButtonCustom/CopyButton';
import { MdModeEditOutline } from "react-icons/md";
import { RiUpload2Line } from "react-icons/ri";
import { MdOutlineReport } from "react-icons/md";
import { RiForbidFill } from "react-icons/ri";


const Video = (props) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('videoId');
  const view = searchParams.get('v');
  const usId = searchParams.get('id')
  const thumbId = searchParams.get('thumb')
  const myId = localStorage.getItem('userToken')
  const avatar = localStorage.getItem('avatar')
  const [videoInfor, setVideoInfor] = useState()

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
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/video/getAllIds`);
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
  const [inforChannel, setInforChannel] = useState()
  const notify = (msg,choose) => {
    if (choose === 1)
      toast.success(msg)
    else if (choose === 2) 
      toast.error(msg)
  };

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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/video/getDetails/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          const mongoTimestamp = new Date(data.metadata.timestamp); // Timestamp của MongoDB
          setFormatTime(formatMongoTimestamp(mongoTimestamp));
          setVideoInfor(data)
          setVideoName(data.metadata.videoName)
          setDescipt(data.metadata.description)
        } else {
          console.error('Failed ');
        }
      } catch (error) {
        console.error('Failed: ', error);
      }
    };

    fetchInforVideo();
  },[])
  useEffect(()=>{
    const getChannel = async() =>{
      try {
        const data = await axios.get(`${process.env.REACT_APP_API_URL}/user/listUserbyId/${usId}`)
        setInforChannel(data.data)
      } catch (error) {
        notify('Có lỗi khi lấy thông tin từ video',2)
      }
    }
    getChannel()
  },[])
  const generateVideoUrls = () => {
    return videoIds.map((id) => `${process.env.REACT_APP_API_URL}/video/get/${id}`);
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
        const data = await axios.get(`${process.env.REACT_APP_API_URL}/video/getLikeCount?videoId=${thumbId}`);
        setNumLike(data.data)
        
        const dataIsLike = await axios.get(`${process.env.REACT_APP_API_URL}/video/isLiked?likerToId=${myId}&likedToId=${thumbId}`);
        setIsLike(dataIsLike.data)

      } catch (error) {
        
      }
    }
    const getSubscribe = async () =>
    {
      try {
          // const data = await axios.post(`${process.env.REACT_APP_API_URL}/video/subscribe?subscriberId=${usId}&subscribedToId=${myId}`)
          const numOfSubs= await axios.get(`${process.env.REACT_APP_API_URL}/video/getSubscriberCount?userId=${usId}`)
          setNumSub(numOfSubs.data)
          const dataIsSub = await axios.get(`${process.env.REACT_APP_API_URL}/video/isSubscribed?subscriberId=${myId}&subscribedToId=${usId}`)
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
        await axios.post(`${process.env.REACT_APP_API_URL}/video/like?likerToId=${myId}&likedToId=${thumbId}`, body)
      }
      else{
        await axios.post(`${process.env.REACT_APP_API_URL}/video/unlike?likerToId=${myId}&likedToId=${thumbId}`, body)
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
        await axios.post(`${process.env.REACT_APP_API_URL}/video/subscribe?subscriberId=${myId}&subscribedToId=${usId}`)
      }
      else{
        await axios.post(`${process.env.REACT_APP_API_URL}/video/unsubscribe?subscriberId=${myId}&subscribedToId=${usId}`)
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/video/listIdThumbnail`);
        if (!response.ok) {
          throw new Error('Failed to fetch video ids');
        }
        const ids = await response.json();
        setVideoIds(ids);
        const fetchDataPromises = ids.map(async id => {
          // console.log(id)
          const response = await fetch(`${process.env.REACT_APP_API_URL}/video/getDetails/${id}`);
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
      return  `${process.env.REACT_APP_API_URL}/video/get/${id}`
      });
  };
  const handleClickChannel = () =>
  {
    navigate(`/profile?userId=${usId}`)
  }

  const thumbnails =  generateThumbnailUrls();

  const [showEditDes, setEditDes] = useState(false)
  const [descipt, setDescipt] = useState(videoInfor?.metadata.description || '');
  const handleDesciptChange = (e) => {
    setDescipt(e.target.value);
  };
  const handleClickEdit = () =>
  {
    setEditDes(!showEditDes)
    setDescipt(videoInfor?.metadata.description)
  }
  const handleClickSaveDes= async()=>{
    try {
      const data = await axios.put(`${process.env.REACT_APP_API_URL}/video/editDescription/${videoId}?description=${descipt}`)
      notify('Cập nhật mô tả thành công!',1)
      setEditDes(false)
    } catch (error) {
      notify('Cập nhật mô tả thất bại!',2)
    }
  }

  const [showEditTitle, setEditTitle] = useState(false)
  const [videoName, setVideoName] = useState(videoInfor?.metadata.videoName || '');
    const handleClickTitle = () =>
    {
      setEditTitle(!showEditTitle)
      setVideoName(videoInfor?.metadata.videoName)
    }
    const handleClickSaveTiltle= async()=>{
      try {
        const data = await axios.put(`${process.env.REACT_APP_API_URL}/video/editVideoName/${thumbId}?videoName=${videoName}`)
        const data2 = await axios.put(`${process.env.REACT_APP_API_URL}/video/editVideoName/${videoId}?videoName=${videoName}`)

        notify('Cập nhật tiêu đề thành công!',1)
        setEditTitle(false)
      } catch (error) {
        notify('Cập nhật tiêu đề thất bại!',2)
      }
    }

  const handleVideoNameChange = (e) => {
    setVideoName(e.target.value);
  };



  useEffect(()=>{
  },[showEditTitle, showEditDes, videoName, descipt])


  const [isMsg, setIsMsg ] = useState(false)
  const [msg, setMsg ] = useState()


  const handleReportChange = (e) => {
    setMsg(e.target.value);
  };


  const handleReport = () =>{
    setIsMsg(!isMsg)
  }

  const [isReport, setIsReport] = useState(false)

  const [isBan, setIsBan] = useState(false)
  
  const handleClickReport = async() =>{
    try {
        // const d1 = await axios.get('') // Lấy thích hay chưa
        // setIsReport(d1.data)

        // if (d1.data)
        // {
        //   return
        // }
        // else {
        //   try {
        //     const d2 = await axios.get() // get tới để cộng 1
        //   } catch (error) {

        //   }
        // }


        const d1 = await axios.post(`${process.env.REACT_APP_API_URL}/video/uploadReport?videoId=${videoId}&msg=${msg}&userId=${usId}`)
        setIsReport(!isReport)
        notify('Báo cáo thành công',1)

    } catch (error) {
        notify('Báo cáo thất bại', 2)
    } 
  }
  const [lists, setLists] = useState([])
  useEffect(()=>{
      const runBan = async() =>{
        try {
          const data = await axios.get(`${process.env.REACT_APP_API_URL}/video/videoIdLargerThanFive`)
          setLists(data.data)
          if (data.data.includes(videoId))
          {
            setIsBan(true)
          }
        } catch (error) {
          
        }
      }
      runBan()


  },[isReport])

  return (
    <div>
      <NavbarApp/>
      <ToastContainer position='bottom-right'/>

      <div className='h-[60px] '></div>



      <div className='px-[60px] py-[20px] flex'>
        <div className='w-8/12'>

            { !isBan?
              (
                <div>
                  <div className=' h-auto bg-black'>
                      <video src ={`${process.env.REACT_APP_API_URL}/video/get/${videoId}`} controls  
                          autoPlay
                          muted
                          loop
                          style={{ height: '450px' }}
                          className=' pb-[15px] w-full h-full'
                          type="video/mp4"/>
                  </div>
                  <p className='font-medium font-roboto my-[10px] flex gap-3  bg-white  text-[24px]'>
                        {
                              showEditTitle?
                                <div className='w-full'>
                                  <textarea value={videoName}
                                    onChange={handleVideoNameChange}
                                    className='focus:border-[#ff6060] border-[2px] w-full break-normal rounded-[10px] h-auto break-all my-1 px-4 py-2'
                                    placeholder='Nhập thay đổi ở đây'></textarea>
                                  <div className='flex gap-2 justify-center items-center cursor-pointer hover:bg-[#979797] px-2 py-1 mb-2 rounded-[10px] w-[100px] bg-[#d1d1d1]'
                                    onClick={handleClickSaveTiltle}>
                                    <RiUpload2Line className=''/>
                                    <p className='text-[17px]'>Lưu</p>  
                                  </div>
                                </div>
                                :
                                <div>
                                  {videoName}  

                                </div>

                          }
                          { 
                              usId===myId?
                                <MdModeEditOutline className='size-[30px] mr-2 cursor-pointer px-1 py-1 rounded-[10px] hover:bg-[#dadada]'
                                    onClick={handleClickTitle}/>:
                                <div></div>

                            }
                  </p>

                  <hr></hr>
                  <div className='font-roboto flex justify-between bg-white pb-[15px] px-[5px] pt-[10px]'>
                      <div>
                        <div className='flex items-center gap-4'>
                          <img alt='avar' src={`data:image/jpeg;base64,${inforChannel?.avatar}`} className='rounded-[50%] size-[50px] cursor-pointer' onClick={handleClickChannel}/>
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



                          {
                            myId!==usId?
                              <div className='flex mr-5 justify-center'>
                                  <button className='items-center h-[50px]  flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'
                                    onClick={handleReport}>
                                      <MdOutlineReport className='size-[30px] ml-[5px]'/>

                                    </button>
                                    { 
                                      isMsg?
                                        <div className=''>
                                            <textarea value={msg}
                                            onChange={handleReportChange}
                                              className=' border-[2px] ml-[10px] w-full break-normal rounded-[10px] h-auto break-all my-2 px-4 py-2'
                                              placeholder='Nhập thay đổi ở đây'>

                                          </textarea>
                                          <div className='flex gap-2 justify-center items-center cursor-pointer hover:bg-[#979797] px-2 py-1 rounded-[10px] w-[120px] bg-[#d1d1d1]'
                                              onClick={handleClickReport}>
                                            <RiUpload2Line className=''/>
                                            <p className='text-[17px]'>Báo cáo</p>  
                                          </div>
                                      </div>
                                      :<div></div>
                                    }
                              </div>:<div></div>
                          }






                          <button className='items-center h-[50px]  flex py-[8px] px-[20px] rounded-[20px] hover:bg-[#e5e5e5] bg-[#f3f3f3]'
                            onClick={handleLike}>
                              {numLike}
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
                  <div className=' bg-white'>
                      <p className='font-medium rounded-[10px] my-[5px] px-[15px] py-[8px] bg-[#f2f2f2] '> 
                        {console.log(view)}
                        {view === undefined || view === 'undefined'? '0':view}&nbsp;lượt xem&nbsp;|&nbsp;{formatTime}

                          <br/>
                          <div className='flex justify-between'>
                            <p className='leading-6 mt-[5px] font-normal'>
                              {!showEditDes? 
                                descipt:''}
                            </p>
                            { 
                              usId===myId?
                                <MdModeEditOutline className='size-[30px] mr-2 cursor-pointer px-1 py-1 rounded-[10px] hover:bg-[#dadada]'
                                    onClick={handleClickEdit}/>:
                                <div></div>

                            }
                          </div>
                          {
                              showEditDes?
                                <div>
                                  <textarea  value={descipt}
                                    onChange={handleDesciptChange}
                                    className='w-full break-normal rounded-[10px] h-auto break-all my-2 px-4 py-2'
                                    placeholder='Nhập thay đổi ở đây'></textarea>
                                  <div className='flex gap-2 justify-center items-center cursor-pointer hover:bg-[#979797] px-2 py-1 rounded-[10px] w-[100px] bg-[#d1d1d1]'
                                      onClick={handleClickSaveDes}>
                                    <RiUpload2Line className=''/>
                                    <p className='text-[17px]'>Lưu</p>  
                                  </div>
                                </div>
                                :
                                <div></div>

                          }
                      </p>
                  </div>
                  <div className='my-[40px]'>

                    <Comment videoId={videoId}/>
                  </div>


                </div>

              ):<div> 
                      <div className='flex gap-4 '>
                        <RiForbidFill className='size-[50px] gap-4'/>
                        <p className='text-[30px] font-bold text-[#ff5050]'>
                          Video đang chờ kiểm duyệt, có quá nhiều lượt REPORT</p>
                      
                      </div> 
                  </div>

            }



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

        </div>

      </div>

    </div>
  );
};

export default Video;