import React, { useEffect, useState, useRef } from 'react';
import logoApp from '../assets/images/logoApp.png'
import { FiUpload } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoTriangle, IoSettingsSharp, IoLogOutSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavbarApp.css'; // Import the CSS file

const NavbarApp = () => {
    const [searchValue, setSearchValue] = useState('');
    const userToken = localStorage.getItem('userToken')
    const avatar = localStorage.getItem('avatar')
    const navigate = useNavigate();

    const handleFindChange = (event) => {
        setSearchValue(event.target.value);
    };

    const vidufullName = localStorage.getItem('firstName')+ ' '+ localStorage.getItem('lastName')
    const [clickAvatar, setClickAvatar] = useState(false);
    const handleClickProfile = (e) =>
    {
        setClickAvatar(!clickAvatar);
    }
    let menuRef = useRef();
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
            }catch{console.log("Not login yet")};
        };
        document.addEventListener("mousedown", handle);
        return ()=> {
            document.removeEventListener("mousedown", handle)
        }
    });

    const handleUpload = () =>
    {
        navigate('/upload')
    };

    return (
        <div className='navbar'>
            <img src={logoApp} className='logo' alt='logo'/>
            <p className='title' onClick={() => {navigate('/')}}>Video Sharing</p>
            <input 
                id='searchValue'
                value={searchValue}  
                placeholder='Tìm kiếm tại đây'
                onChange={handleFindChange}
                type='text'
                className='search-input'
            />
            <div className='auth-buttons'>
                { !userToken?
                    <div className='auth-buttons'>
                        <button className="register-button" type="button" onClick={()=>{navigate('/register')}}>
                            Đăng ký
                        </button>     
                        <button className="login-button" type="button" onClick={()=>{navigate('/login')}}>
                            Đăng nhập
                        </button>    
                    </div>:
                    <div className='user-actions'>
                        <button className="upload-button" type="button" onClick={handleUpload}>
                            Tải lên
                            <FiUpload className='upload-icon'/>
                        </button>
                        <IoIosNotificationsOutline className='notification-icon'/>
                        <div className='avatar-container'>
                            <img className='avatar' src={`data:image/jpeg;base64,${avatar}`} onClick={handleClickProfile} alt='avatar'/>
                            <div ref={menuRef} className={`profile-menu ${!clickAvatar ? 'hidden' : ''}`}>
                                <IoTriangle className='triangle-icon'/>
                                <ul className='profile-options'>
                                    <li className='profile-item'>
                                        <img className='profile-avatar' src={`data:image/jpeg;base64,${avatar}`} alt='avatar'></img>
                                        <p className='profile-name'>{vidufullName}</p>
                                    </li>
                                    <div className='divider'></div>
                                    <div className='profile-option' onClick={()=>{navigate(`/profile?userId=${userToken}`)}}>
                                        <MdAccountCircle className='profile-icon'/>
                                        <li className='profile-text'>Hồ sơ</li>
                                        <FaAngleRight className='profile-arrow'/>
                                    </div>
                                    <div className='profile-option' onClick={()=>{navigate(`/change?userId=${userToken}`)}}>
                                        <IoSettingsSharp className='profile-icon'/>
                                        <li className='profile-text'>Tài khoản</li>
                                        <FaAngleRight className='profile-arrow'/>
                                    </div>
                                    <div className='profile-option' onClick={() => {
                                        localStorage.removeItem('userToken');
                                        localStorage.removeItem('firstName');
                                        localStorage.removeItem('lastName');
                                        localStorage.removeItem('avatar');
                                        localStorage.removeItem('userName');
                                        navigate('/login');
                                    }}>
                                        <IoLogOutSharp className='profile-icon'/>
                                        <li className='profile-text'>Đăng xuất</li>
                                        <FaAngleRight className='profile-arrow'/>
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

export default NavbarApp;