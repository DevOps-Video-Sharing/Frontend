import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/NavbarApp';
import bg from '../assets/images/bg.avif'
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";  
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";
import Mainvideo from '../components/MainVideo';
import VideoComponentProfile from '../components/VideoCom/VideoComponentProfile';
import { IoMdClose } from "react-icons/io";
import Comment from '../components/Comment/Comment';
import Loading from '../components/Loading';
import { useSearchParams, useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import ViewAvatar from '../components/Profile/ViewAvatar';

const Profile = () => {
    const myId = localStorage.getItem('userToken');
    const avar = localStorage.getItem('avatar')
    const [searchParams] = useSearchParams();
    const userToken = searchParams.get('userId')
    const [isFocusFilter, setFocused] = useState(false);
    const [isOpenComment, setIsOpenComment] = useState(false)
    const [videoIds, setVideoIds] = useState([]);
    const [values, setValueIds] = useState();
    const [isSub, setIsSub] = useState(false)
    const [numSub, setNumSub] = useState(0)
    const [userDetail, setUserDetail] = useState()
    const [listLike, setListLike] = useState(false)
    const [isShowAvatar, setIsShowAvatar] = useState(false)
    const handleChooseUpload = () =>
    {
        setListLike(false)
        setFocused(false);
    }
    const handleChooseLike = () =>
    {
        setListLike(true)
        setFocused(true);
    }
    const handleOpenComment = () =>
    {
        setIsOpenComment(true)
    }
    const handleCloseComment = () =>
    {
        setIsOpenComment(false)
    }

    
    useEffect(() => {
        const fetchVideoIds = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/video/get${listLike?'IdFromLikerToId':'DetailsByUserId'}/${userToken}`);
            if (!response.ok) {
              throw new Error('Failed to fetch video ids');
            }
            const ids = await response.json();
            setVideoIds(ids);
            const fetchDataPromises = ids.map(async id => {
              console.log(id)
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
      }, [userToken, listLike]);


    useEffect(()=>{
        const getDetailUser = async () =>
        {
            try {
                const data = await axios.get(`${process.env.REACT_APP_API_URL}/user/listUserbyId/${userToken}`)
                setUserDetail(data.data)
            } catch (error) {
                
            }
        }
        const getSubscribe = async () =>
        {
            try {
                // const data = await axios.post(`${process.env.REACT_APP_API_URL}/video/subscribe?subscriberId=${usId}&subscribedToId=${myId}`)
                const numOfSubs= await axios.get(`${process.env.REACT_APP_API_URL}/video/getSubscriberCount?userId=${userToken}`)
                setNumSub(numOfSubs.data)
                const dataIsSub = await axios.get(`${process.env.REACT_APP_API_URL}/video/isSubscribed?subscriberId=${myId}&subscribedToId=${userToken}`)
                setIsSub(dataIsSub.data)
    
            } catch (error) {
            
            }
        }
        getSubscribe()
        getDetailUser()
    },[userToken, listLike])

    
    const actSubVideo = async(act) =>{
        try {
          if (!act)
          {
            await axios.post(`${process.env.REACT_APP_API_URL}/video/subscribe?subscriberId=${myId}&subscribedToId=${userToken}`)
          }
          else{
            await axios.post(`${process.env.REACT_APP_API_URL}/video/unsubscribe?subscriberId=${myId}&subscribedToId=${userToken}`)
          }
        } catch (error) {
          
        }
      }
    const handleSub= (event) =>{
        event.preventDefault();
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


    const generateThumbnailUrls = () => {
        return videoIds.map((id) => {
        return  `${process.env.REACT_APP_API_URL}/video/get/${id}`
        });
    };
    const thumbnails =  generateThumbnailUrls();

    const handleShowAvatar = () =>
    {
        setIsShowAvatar(!isShowAvatar)
    }


    const handleSubmit = async (event) => {};

    return (
        <div className="bg-[#f0f4f9]  relative ">
            <Navbar />
            {isShowAvatar?
                <div className='flex justify-center w-screen h-auto'>
                    <div className='w-[500px] z-30'>

                        <ViewAvatar im={userDetail?.avatar} handle={handleShowAvatar}/>
                    </div>
                </div>:<div></div>

            }

            <div className='h-[60px]'></div>
            <img src={bg} alt='Bg-persional' className=' w-full h-[260px] object-cover' />
            <form className=" bg-white shadow-md rounded px-8 pt-6 pb-8 mb-1 " onSubmit={handleSubmit}>
                {/* {avatar && 
                //<img src={`data:image/jpeg;base64, ${avatar}`} alt="Avatar" className="w-20 h-20 rounded-full mb-4" />} */}
                <img src={`data:image/jpeg;base64,${userDetail?.avatar}`} alt="Avatar" className="z-10 shadow-xl border-[5px]  border-white top-[150px] left-1/2 
                                transform -translate-x-1/2 absolute w-[250px] h-[250px] rounded-full mb-4 cursor-zoom-in bg-white" 
                                onClick={handleShowAvatar}/>

                <div className=' justify-center flex font-light text-[18px] '>
                        <div>
                            <p className=" mt-[60px] text-[30px] font-bold w-auto mb-2 size-[25px]">{userDetail?.firstName}  {userDetail?.lastName}</p>
                            <p className="mb-2 mt-[20px]  ">  Username: {userDetail?.username}  </p>
                            <p className="mb-2 mt-[0px]  ">Email: {userDetail?.email}</p>

                            <div className='flex text-[20px] gap-3 items-center font-Oswald font-medium mt-[10px] justify-between'>
                                <p className=" ">Lượt theo dõi:  {numSub === null || numSub === undefined?'0': numSub}</p>
                                {myId!==userToken?
                                    <button className={`flex items-center text-white px-[15px] py-[8px] rounded-[5px]
                                        ${isSub?' bg-[#a3a3a3] hover:bg-[#696969]':' bg-[#d00b29] hover:bg-[#933240]'}`}
                                        onClick={handleSub}>{isSub?'Hủy theo dõi':'Theo dõi'}
                                        <MdOutlineAddCircleOutline className='ml-[10px] size-[22px]'/>
                                    </button>:''
                                }
                            </div>
                        </div>
                </div>
            </form>
            <div className='flex justify-center font-normal font-Oswald text-[#717171]'>
                <button className={`flex items-center px-[15px] py-[10px] hover:text-black rounded-t-[10px] 
                        ${isFocusFilter?' text-[#717171] font-normal':'bg-white text-black font-bold'}`}
                        onClick={handleChooseUpload}>
                        Video đã đăng
                        <IoIosCloudUpload className='ml-[5px]'/>
                        </button>
                {myId===userToken?
                    <button className={`flex items-center px-[15px] py-[10px] hover:text-black rounded-t-[10px] 
                            ${!isFocusFilter?' text-[#717171] font-normal':'bg-white text-black font-bold'}`}
                            onClick={handleChooseLike}>
                            Video đã thích
                            <AiFillLike className='ml-[5px]'/>
                    </button>:<div></div>
                }
            </div>
            <div className='flex mx-[160px] justify-center'>
                {
                    (values && values.length > 0 && thumbnails && thumbnails.length > 0)?
                    <div className='w-[1000px]'>
                        <Mainvideo onClick={handleOpenComment} isActive={isOpenComment}
                                                title={values[0]?.metadata?.videoName}
                                                username={values[0]?.metadata?.userName}
                                                timestamp={values[0]?.metadata?.timestamp}
                                                view={values[0]?.views}
                                                descript={values[0]?.metadata.description}
                                                userid={values[0]?.metadata.userID}
                                                videoId={videoIds[0]}
                        />

                    </div>
                    :<div></div>
                }
                {
                    isOpenComment?
                    <div className='w-[500px] h-auto shadow-xl bg-white'>
                        <IoMdClose className='px-2 py-2 w-[45px] h-[45px] fill-[#555555] float-end cursor-pointer rounded-[20px] mx-1 my-1 hover:bg-[#e7e7e7]' onClick={handleCloseComment}/>
                        <p className="text-[24px] font-bold ml-5 mt-2 select-none">Bình luận</p>
                        <div className='w-full px-4 mt-[20px]'>
                            
                            <Comment videoId={videoIds[0]}/>
                        </div>
                    </div>:<div></div>
                }
            </div>


            <div className=' flex ml-[85px] items-center my-3 pl-[20px]  font-bold pt-[20px] w-3/5 text-black font-sans'>
                <p className='mr-[10px]  text-[20px]'>VIDEO KHÁC</p>    
                <IoMdMenu className='cursor-pointer size-[25px]' />
            </div>
            <div className='flex flex-wrap mx-[90px] font-normal font-Oswald text-[#717171]'>
                {console.log(videoIds[0])}
                    {(values && values.length > 0 && thumbnails && thumbnails.length > 0) ? (
                thumbnails.slice(0).map((url, index) => (
                        <VideoComponentProfile
                            wi={365}
                            key={videoIds[index]}
                            img={url}
                            title={values[index]?.metadata?.videoName}
                            username={values[index]?.metadata?.userName}
                            timestamp={values[index]?.metadata?.timestamp}
                            view={values[index]?.views}
                            userid={values[index]?.metadata.userID}
                            videoId={videoIds[index]}
                            />
                        ))
                        ) : (
                            <div className='flex justify-center '>
                                {/* <Loading/> */}
                                <p className='ml-5 text-[#ff4b4b] text-[25px]'>Chưa có dữ liệu nào thu được</p>
                            </div>
                        )}


            </div>
        </div>

    );
};

export default Profile;