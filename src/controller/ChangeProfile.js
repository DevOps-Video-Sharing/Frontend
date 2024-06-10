import React, {useEffect, useState} from "react";
import NavbarApp from "../components/NavbarApp";
import { FaRegImage } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from "axios";
import { useSearchParams, useParams , useNavigate } from 'react-router-dom';


const ChangeProfile  = () => 
{
    const [activeTab, setActiveTab] = useState('password');
    const currentFirstName = localStorage.getItem('firstName')
    const currentLastName = localStorage.getItem('lastName')
    const ava = localStorage.getItem('avatar')
    const [currentPass, setCurrentPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [newConfirmPass, setNewConfirmPass] = useState('')
    const [newFirstName, setFirstName] = useState('')
    const [newLastName, setLastName] = useState('')

    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const handleChangeCurPass = (event) => {
        setCurrentPass(event.target.value)
    }
    const handleChangeNewPass = (event) => {
        setNewPass(event.target.value)
    }
    const handleChangeConfirmPass = (event) => {
        setNewConfirmPass(event.target.value)
    }
    const handleChangeFirstname = (event) => {
        setFirstName(event.target.value)
    }
    const handleChangeLastname = (event) => {
        setLastName(event.target.value)
    }


    const [showCurPassword, setShowCurPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avar, setAvar] = useState(null);

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        setAvar(URL.createObjectURL(file));
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const handleSubmitChangeInfor = (event) =>{
        event.preventDefault();    
    }
    
    const handleSubmitChangePsw = async(event) =>{
        event.preventDefault();
        if (newPass !== newConfirmPass)
            return alert('Hai password khác nhau')
        const bodyData = {
            currentPassword: currentPass,
            newPassword: newPass
        }

        try {       
            const data =  await axios.put(`http://localhost:8080/user/changePassword/${userId}`, bodyData)
            if (!data.data)
            {
                alert('Sai mật khẩu')
            } else
            {
                alert('Thành công')
            }
        } catch (error) {
            alert(error)
        }
    }
    return(
        <div className="w-full">
            <NavbarApp/>
            <div className='h-[60px]'></div>

            <div className=" gap-10 mt-[20px]">
                <div className="flex justify-center relative items-center rounded-[50%]">
                    <label for="file-input" class="z-50 rounded-[50%] p-2 bg-white bottom-0 absolute  cursor-pointer">
                        <FaRegImage className="z-50 size-[18px] cursor-pointer"/>
                        <input type="file" id="file-input" accept=".png, .jpg" onChange={handleThumbnailChange}  class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                    </label>
                    <img
                        src={avar === null ? `data:image/jpeg;base64,${ava}` : avar}
                        alt="Avatar"
                        className="z-10 shadow-xl border-[5px] border-[#cccccc] h-[200px] w-[200px] rounded-[50%] mb-4"
                        />
                    
                </div>
                {
                    avar !== null?
                    <div className="flex justify-center my-4 mb-10">
                        <button
                            className="items-center flex gap-2 text-[15px] hover:shadow-md hover:bg-[#376191] bg-[#0b57a9]
                            text-white font-medium py-[10px] px-4  rounded-[15px] focus:outline-none focus:shadow-outline "
                            type="submit">
                            <IoIosSave className="size-[20px]"/>
                            Lưu
                        </button>   
                    </div>:<div></div>

                }




                <div>
                    <div className="flex justify-center cursor-pointer mt-5 select-none">
                        <ul className="flex font-medium ">
                            <li className={`px-4 py-2 ${activeTab === 'password' ? ' bg-[#0b57a9] text-white border-[#cacaca]' : 'hover:bg-[#d6d6d6]'}`}
                            onClick={() => handleTabClick('password')}
                            >
                            Đổi mật khẩu
                            </li>
                            <li
                            className={`px-4 py-2  ${activeTab === 'infor' ? 'bg-[#0b57a9] text-white border border-[#cacaca]' : 'hover:bg-[#d6d6d6]'}`}
                            onClick={() => handleTabClick('infor')}
                            >
                            Thông tin đăng nhập
                            </li>
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <div className="bg-[#cacaca] w-4/12 px-10 rounded-[10px] py-5">
                            {
                                activeTab === 'password'?
                                <form onSubmit={handleSubmitChangePsw}>
                                    <div className="flex justify-center items-center mb-4">
                                    <label className="w-full text-[#676767] select-none">
                                        Mật khẩu cũ
                                        <div className="flex relative">
                                            <input
                                            type={showCurPassword ? 'text' : 'password'}
                                            className="px-4 rounded-[10px] py-3 w-full border-[1px] border-[#3b3b3b]"
                                            placeholder="Nhập mật khẩu cũ"
                                            onChange={handleChangeCurPass}
                                            />
                                            {showCurPassword ?
                                                <FaEyeSlash onClick={() => setShowCurPassword(!showCurPassword)}
                                                    className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">

                                                </FaEyeSlash>
                                                :
                                                <FaEye onClick={() => setShowCurPassword(!showCurPassword)}
                                                    className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">
                                                </FaEye>
                                            }


                                        </div>
                                    </label>
                                    </div>
                                    <div className="flex justify-center items-center mb-4">
                                    <label className="w-full text-[#676767] select-none">
                                        Mật khẩu mới
                                        <div className="flex relative">
                                            <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="px-4 rounded-[10px] py-3 w-full border-[1px] border-[#3b3b3b]"
                                            placeholder="Nhập mật khẩu mới"
                                            onChange={handleChangeNewPass}
                                            />
                                            {showNewPassword ?
                                                <FaEyeSlash onClick={() => setShowNewPassword(!showNewPassword)}
                                                className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">

                                                </FaEyeSlash>
                                                :
                                                <FaEye onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">
                                                </FaEye>
                                            }

                                        </div>
                                    </label>
                                    </div>
                                    <div className="flex justify-center items-center mb-4">
                                    <label className="w-full text-[#676767] select-none">
                                        Nhập lại mật khẩu mới
                                        <div className="flex relative">
                                            <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="px-4 rounded-[10px] py-3 w-full border-[1px] border-[#3b3b3b]"
                                            placeholder="Xác nhận mật khẩu mới"
                                            onChange={handleChangeConfirmPass}
                                            />
                                            {showConfirmPassword ? 
                                                <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">

                                                </FaEyeSlash>
                                                :
                                                <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className=" cursor-pointer px-2 py-1 size-[35px] rounded-md text-sm absolute right-1 top-2">
                                                </FaEye>
                                        }

                                        </div>
                                    </label>
                                    </div>
                                    <div className="flex justify-center items-center">
                                    <button
                                        className="items-center flex text-[15px] hover:shadow-md hover:bg-[#376191] bg-[#0b57a9] text-white font-medium py-[10px] px-4 my-1 rounded-[15px] focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                    </div>
                                </form>
                                :
                                <form onSubmit={handleSubmitChangeInfor}>
                                    <div className=" flex justify-center items-center  mb-4">  
                                        <label className="w-full text-[#676767] select-none">
                                            Họ
                                            <input
                                            type="textbox"
                                            className="px-4 rounded-[10px] py-3  w-full border-[1px]  border-[#3b3b3b]"
                                            placeholder="Nhập họ mới ..."
                                            value={currentFirstName}
                                            onChange={handleChangeFirstname}
                                            ></input>
                            
                                        </label>

                                    </div>
                                    <div className=" flex justify-center items-center mb-4">
                                        <label className="w-full text-[#676767] select-none">
                                            Tên
                                            <input
                                            type="textbox"
                                            className="px-4 rounded-[10px] py-3  w-full border-[1px]  border-[#3b3b3b] "
                                            placeholder="Nhập tên mới"
                                            value={currentLastName}
                                            onChange={handleChangeLastname}
                                            ></input>
                            
                                        </label>
                                    </div>
                                    <div className=" flex justify-center items-center mb-4">

                                        <button
                                            className="items-center flex text-[15px] hover:shadow-md hover:bg-[#376191] bg-[#0b57a9]
                                            text-white font-medium py-[10px] px-4 my-1 rounded-[15px] focus:outline-none focus:shadow-outline "
                                            type="submit">
                                            Đổi thông tin 
                                        </button>   
                                    </div>  
                                </form>
                            }

                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}
export default ChangeProfile