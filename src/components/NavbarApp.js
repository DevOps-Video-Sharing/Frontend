import React, { useEffect, useState, useRef, memo } from 'react';
import logoApp from '../assets/images/logoApp.png'
import { FiUpload } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoTriangle, IoSettingsSharp, IoLogOutSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { MdWorkHistory } from "react-icons/md";
import axios from 'axios';

const NavbarApp = () => {
    // const [avatar, setAvatar] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const userToken = localStorage.getItem('userToken')
    const avatar = localStorage.getItem('avatar')
    const navigate = useNavigate();
    const [videoIds, setVideoIds] = useState([]);
    const [values, setValueIds] = useState();

    const vidufullName = localStorage.getItem('firstName')+ ' '+ localStorage.getItem('lastName')
    const [clickAvatar, setClickAvatar] = useState(false);
    const [clickNoti, setClickNoti] = useState(false);

    const [showSearch, setShowSearch] = useState(false)
    const handleClickProfile = (e) =>
    {

        setClickAvatar(!clickAvatar);
    }
    const handleClickNoti = (e) =>
        {
    
            setClickNoti(!clickNoti);
        }
    const handleClickShowSearch = (e) =>
    {

        setShowSearch(true);
    }
    const handleClickHideSearch = (e) =>
    {


                // setShowSearch(false)

    }
    let menuRef = useRef();
    let findRef = useRef()
    useEffect(()=>
    {
        let handle = (e)=> 
        {
            try
            {

                if (!menuRef.current.contains(e.target))
                {
                    setClickAvatar(false);
                }
                if (!findRef.current.contains(e.target))
                {
                    setShowSearch(false)
                }
            }catch{console.log("Not login yet")};
        };
        document.addEventListener("mousedown", handle);
        return ()=> {
            document.removeEventListener("mousedown", handle)

        }
    });
    useEffect(()=>{

    },[localStorage.getItem('avatar')])
    // useEffect(()=>{
    //     const getDetailUser = async () =>
    //     {
    //         try {
    //             const data = await axios.get(`${process.env.REACT_APP_API_URL}/user/listUserbyId/${userToken}`)
    //             setAvatar(data.data.avatar)
    //         } catch (error) {
                
    //         }
    //     }
    //     getDetailUser()
    // },[])

    const handleUpload = () =>
    {
        navigate('/upload')
    };


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
              console.log(id)
              const response = await fetch(`${process.env.REACT_APP_API_URL}/video/getDetails/${id}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch data for id: ${id}`);
              }
              return response.json();
            });
            const data = await Promise.all(fetchDataPromises);
            setValueIds(data);
            console.log(data)
          } catch (error) {
            console.error('Failed to fetch video ids or data:', error);
          }
        };
      
        fetchVideoIds();
      }, [showSearch]);

    const [results, setResults] = useState([])
    const [keyD, setKey] = useState()
    const handleFilter = (query) => {
        // if (query.trim() === '') {
        //   setValueIds([])
        // } {
            setKey(query)
          let filterVideo = values?.filter((f) => {
            console.log('f', f)
            return f.metadata.videoName.toLowerCase().includes(query.toLowerCase());
          });
          setResults(filterVideo.slice(0, 10));
          console.log('values',values)
        // }
      };

    const [val, setVal] = useState()
    const generateThumbnailUrls = async (vd) => {
        return `${process.env.REACT_APP_API_URL}/video/get/${vd}`
    };
    const fetchVideoIds2 = async (vaid) => {
        try {
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/video/getDetails/66659db56d770150e9456bc5`);
            console.log('res', response)
            if (!response.ok) {
                throw new Error(`Failed to fetch data for id`);
                }
                setVal(response.data);
        } catch (error) {
            console.error('Failed to fetch video ids or data:', error);
        }
    };        
                    
    const handlFind = async(list) =>{
        // console.log('end',list?.metadata?.videoId )
        // alert(list?.metadata?.videoId)
        
        
        const apiUrl = `${process.env.REACT_APP_API_URL}/video/getVideoIdFromThumbnailId/` + list.metadata.videoId;
        const response = await fetch(apiUrl);
        const result = await response.text();
        await fetch(`${process.env.REACT_APP_API_URL}/video/updateViews/${list.metadata.videoId}`, {method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
                },})
        await fetchVideoIds2(result)
        console.log('val',val)
        // navigate(`/video?videoId=${list.metadata.videoId}&v=${val?.views}&id=${val?.metadata.userID}&thumb=${result}`)
        navigate(`/video?videoId=${list.metadata.videoId}&v=$1&id=66288bd4e259000400114d11&thumb=${result}`)

    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          navigate(`/search?str=${keyD}`);
        }
    };
    return (
        <div className=' justify-between z-50 fixed select-none mb-[2px] drop-shadow-lg bg-white p-0 flex items-center w-full ml-0'>
            <img onClick={() => {navigate('/')}} src={logoApp} className='select-none cursor-pointer ml-[40px] m-[5px] w-[50px] h-[50px]' alt='logo' />
            <p className='cursor-pointer text-[30px] text-[#595959] font-bold font-teko ml-[20px] -mx-1 -my-1'
                onClick={() => {navigate('/')}}
                >Video Sharing</p>
            <div  className='w-[35%]] sm:min-w-[300px] h-[45px] grow '>
                <div  className='flex justify-center  relative'>
                    <input 
                        onFocus={handleClickShowSearch}
                        onBlur={handleClickHideSearch}
                        onKeyDown={handleKeyPress}
                        placeholder='Tìm kiếm tại đây'
                        onChange={(event)=>handleFilter(event.target.value)}
                        type='text'
                        className='  focus:border-[#595959] focus:border-[1px] bg-[#f0f4f9] rounded-[25px] pl-[20px] sm:min-w-[200px] w-[50%] h-[45px] 
                        border-[1px] border-[#ccc] outline-none'
                    />
                    <div className=' relative'>

                        <IoMdSearch onClick={()=>navigate(`/search?str=${keyD}`)} className=' absolute size-[27px] cursor-pointer top-2 left-[-40px]' />
                    </div >
                    {
                        showSearch?
                        <div ref={findRef} className="w-[50%] max-h-[300px]  overflow-y-auto top-[50px] bg-white absolute scroll-auto drop-shadow-xl "
                                >
                            {
                                results.map((list,index) => (
                                    <div className="hover:bg-[#c5c4c4] flex gap-5 px-7 py-3 items-center cursor-pointer" onClick={()=> handlFind(list)}>
                                        <IoMdSearch/>
                                        <p>{list.metadata.videoName}</p>
                                    </div>
                                ))
                            }
                        </div>:<div></div>

                    }
                </div>

            </div>
            <div className='flex-none'>
                { !userToken?<div className=' flex items-center'>
                        <button
                            className="items-center flex mr-[15px] text-[15px] hover:shadow-md hover:bg-[#dedede]  bg-white
                            text-[#0b57d0] font-bold py-[10px] px-4 my-1 rounded-[30px] focus:outline-none focus:shadow-outline "
                            type="button"
                            onClick={()=>{navigate('/register')}}>
                            Đăng ký
                        </button>     
                        <button
                            className="font-bold items-center flex  mr-[25px]  text-[15px] hover:shadow-md hover:bg-[#0b57a9]  bg-[#0b57d0]
                            text-white py-[10px] px-4 my-1 rounded-[30px] focus:outline-none focus:shadow-outline "
                            type="button"
                            onClick={()=>{navigate('/login')}}>
                            Đăng nhập
                        </button>    
                    </div>:
                    <div className='flex items-center'>
                        <button
                            className="items-center flex mr-[15px] text-[15px] hover:shadow-md hover:bg-[#0b57a9] bg-[#0b57d0]
                            text-white font-medium py-[10px] px-4 my-1 rounded-[30px] focus:outline-none focus:shadow-outline "
                            type="button"
                            onClick={handleUpload}>
                            Tải lên
                            <FiUpload className='ml-[5px]'/>
                        </button>


                        <div className=' relative'>
                            <IoIosNotificationsOutline onClick={handleClickNoti} className='hover:bg-[#edebeb] rounded-[20px] size-[27px] cursor-pointer  ml-[15px]'/>
                            <div ref={menuRef}  className={` rounded-[10px] right-[0px] max-w-[400px]  min-w-[250px] top-[50px] w-auto h-auto absolute 
                                ${!clickNoti?'hidden':' border-[1px] mt-0 bg-white '}`}>
                                <div className='flex justify-center py-6'>
                                    <p className=' '>
                                        Không có thông báo nào
                                    </p>   

                                </div>

                            </div>
                        </div>



                        <div className='relative '>
                            <img ref={menuRef} className= 'hover:shadow-md cursor-pointer w-[45px] h-[45px] mr-[30px] my-1 mx-[15px]  rounded-[50%] focus:outline-none focus:shadow-outline'
                                src={`data:image/jpeg;base64,${avatar}`}
                                onClick={handleClickProfile} alt='avatar'/>
                            <div ref={menuRef}  className={` rounded-[10px] right-[20px] max-w-[400px]  min-w-[250px] top-[65px] w-auto h-auto absolute 
                                ${!clickAvatar?'hidden':' border-[1px] mt-0 bg-white '}`}>
                                <IoTriangle className=' text-white p-0 m-0  right-[17px] top-[-32px] size-[30px] mt-[15px]'/>
                                <ul className=' cursor-pointer  mt-[-20px] text-[#545454]'>
                                    <li className='flex items-center'>
                                        <img className='ml-[15px] h-[60px] w-[60px] rounded-[50%]' src={`data:image/jpeg;base64,${avatar}`} alt='avatar'></img>
                                        <p className='mx-[15px] font-bold pr-[15px] text-[18px]'>{vidufullName}</p>
                                    </li>
                                    <div className='flex justify-center mx-[15px]'>
                                        <hr className='w-full border-[1px] my-[10px]'/>
                                    </div>
                                    <div className='hover:text-black flex cursor-pointer items-center my-[10px]'>
                                            <MdAccountCircle className=' size-[30px] mx-[15px]'/>
                                            <li className=' font-medium hover:font-bold w-[150px] '
                                                onClick={()=>{navigate(`/profile?userId=${userToken}`)}}> Hồ sơ 
                                            </li>
                                            <FaAngleRight className=' ml-auto mr-[15px]' />
                                    </div>
                                    <div className='hover:text-black flex cursor-pointer items-center my-[10px]'>
                                            <MdWorkHistory className=' size-[30px] mx-[15px]'/>
                                            <li className=' font-medium hover:font-bold w-[150px] '
                                            onClick={()=>{navigate(`/history`)}}> Lịch sử
                                            </li>
                                            <FaAngleRight className='ml-auto mr-[15px]' />
                                    </div>
                                    <div className='hover:text-black flex cursor-pointer items-center my-[10px]'>
                                            <IoSettingsSharp className=' size-[30px] mx-[15px]'/>
                                            <li className=' font-medium hover:font-bold w-[150px] '
                                            onClick={()=>{navigate(`/change`)}}> Tài khoản
                                            </li>
                                            <FaAngleRight className='ml-auto mr-[15px]' />
                                    </div>
                                    <div className='hover:text-black flex cursor-pointer items-center my-[10px] mb-[20px]'>
                                            <IoLogOutSharp className=' size-[30px] mx-[15px]'/>
                                            <li className=' font-medium hover:font-bold w-[150px]  '
                                        
                                                    onClick={() => {
                                                        localStorage.removeItem('userToken');
                                                        localStorage.removeItem('firstName');
                                                        localStorage.removeItem('lastName');
                                                        localStorage.removeItem('avatar');
                                                        localStorage.removeItem('userName');

                                                        navigate('/login');
                                                    }}
                                    
                                        
                                        
                                            > Đăng xuất
                                            </li>
                                            <FaAngleRight className='ml-auto mr-[15px]' />
                                    </div>
                                </ul>
                            </div>
                        </div>

                    </div>
                }
            </div>

        </div>
    );
};

export default memo(NavbarApp);
