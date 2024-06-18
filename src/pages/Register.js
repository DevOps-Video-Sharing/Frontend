import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const notify = (msg,choose) => {
    if (choose === 1)
      toast.success(msg)
    else if (choose === 2) 
      toast.error(msg)
    else if (choose === 3) 
      toast.info(msg)
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      notify('Mật khẩu xác nhận không khớp',2)
      // alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      // alert('Một email xác thực đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra và nhập mã xác thực để hoàn tất đăng ký!');
       const emailVerificationResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/send-verification-email`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
          }),
        });

        if (!emailVerificationResponse.ok) {
            throw new Error('Failed to send verification email');
      }
      notify('Một email đã gửi tới bạn',3)



      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          active: "true",
          firstName: firstName,
          lastName: lastName,
          email: email
        }),
      });

      if (response.ok) {
        // setTimeout(() => {
            window.location.href = '/login';
        // }, 10000); // 10 giây
      } else {
        const data = await response.json();
        notify('Lỗi đăng nhập tới tài khoản',2)
        // alert('Failed to register user: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      notify('Lỗi đăng nhập tới tài khoản',2)
      // alert('Failed to register user. An error occurred.');
    }
  };
  const handlePasswordChange = (e) => {
      setPassword(e.target.value);
  };
  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
};
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleFirstNameChange = (e) => {
      setFirstName(e.target.value);
  };
    const handleLastNameChange = (e) => {
      setLastName(e.target.value);
  };
  const handleEmailChange = (e) => {
      setEmail(e.target.value);
  };
  
  const [focused, setFocused] = useState(false);
  const [focusedPass, setFocusedPass] = useState(false);
  const [focusedPassConfirm, setFocusedPassConfirm] = useState(false);
  const [focusedFirstName, setFocusedFirstName] = useState(false);
  const [focusedLastName, setFocusedLastName] = useState(false);
  const [focusedEmail, setFocusedEmail] = useState(false);

  const handleFocus = () => {
      setFocused(true);
  };
  const handleFocusPass = () => {
      setFocusedPass(true);
  };
  const handleFocusPassConfirm = () => {
    setFocusedPassConfirm(true);
};
  const handleFocusFirtName = () => {
    setFocusedFirstName(true);
  };
  const handleFocusLastName = () => {
      setFocusedLastName(true);
  };
  const handleFocusEmail = () => {
    setFocusedEmail(true);
  };

  const handleBlur = () => {
    if (username === "") {
      setFocused(false);
    }
  };
  const handleBlurPass = () => {
      if (password === "") {
        setFocusedPass(false);
      }
  };
  const handleBlurPassConfirm = () => {
    if (passwordConfirm === "") {
      setFocusedPassConfirm(false);
    }
};
  const handleBlurFirstName = () => {
    if (firstName === "") {
      setFocusedFirstName(false);
    }
  };
  const handleBlurLastName = () => {
      if (lastName === "") {
        setFocusedLastName(false);
      }
  };
  const handleBlurEmail = () => {
    if (email === "") {
      setFocusedEmail(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const togglePasswordConfirmVisibility = () => {
      setShowPasswordConfirm(!showPasswordConfirm);
  };
  return (
    <div className=" bg-[#f0f4f9]  flex justify-center items-center h-screen w-screen"> 
                <ToastContainer position='bottom-right'/>
      <div className='rounded-[30px] justify-center bg-white flex flex-wrap overflow-hidden w-auto h-auto'>
        <div className=' w-[450px] mt-[30px] ml-[40px] '>
                    <img src = {logo} alt='Logo' className='w-[90px] h-[100px] '/>
                    <p className='text-[35px] font-normal'> Tạo tài khoản</p>
                    <p>Để trải nghiệm ứng dụng tốt nhất</p>
        </div>
        <div className='w-[550px] h-[545px] '>
          <form className="h-full w-full p-[30px] align-middle flex flex-col  shadow-none border-none  shadow-md rounded " onSubmit={handleSubmit}>
            <div className='flex mt-[20px] '>
              <div className=''>
                <label className = 'relative  '>
                    <input required 
                            type='text'
                            id='firstName'
                            value={firstName}
                            onChange={handleFirstNameChange}
                            onFocus={handleFocusFirtName}
                            onBlur={handleBlurFirstName}
                            className='text-[#1f1f1f] w-[220px] mr-[30px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                            hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                    <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                    ${!focusedFirstName?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                    Nhập họ của bạn
                    </span>
                </label>
              </div>
              <div className=''>
                <label className = 'relative'>
                    <input required 
                            type='text'
                            id='lastName'
                            value={lastName}
                            onChange={handleLastNameChange}
                            onFocus={handleFocusLastName}
                            onBlur={handleBlurLastName}
                            className='text-[#1f1f1f] w-[220px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                            hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                    <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                    ${!focusedLastName?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                    Nhập tên của bạn
                    </span>
                </label>
              </div>

            </div>
            <div className='mt-[20px]'>
              <label className = 'relative'>
                  <input required
                          type='text'
                          id='email'
                          value={email}
                          onChange={handleEmailChange}
                          onFocus={handleFocusEmail}
                          onBlur={handleBlurEmail}
                          className='text-[#1f1f1f] w-[470px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                          hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                  <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                  ${!focusedEmail?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                  Nhập email của bạn
                  </span>
              </label>
            </div>
            <div className='mt-[20px]'>
              <label className = 'relative'>
                  <input required 
                          type='text'
                          id='username'
                          value={username}
                          onChange={handleUsernameChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          className='text-[#1f1f1f] w-[470px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                          hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                  <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                  ${!focused?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                  Nhập username của bạn
                  </span>
              </label>
            </div>
            <div className='mt-[20px] mb-[10px]'>
                            <label className = 'relative'>
                                <input required 
                                        type={!showPassword?'password':'text'}
                                        id='password'
                                        value={password}
                                        onFocus={handleFocusPass}
                                        onBlur={handleBlurPass}
                                        onChange={handlePasswordChange}
                                        className='w-[470px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                                        hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                                <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                                ${!focusedPass?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                                Nhập mật khẩu của bạn
                                </span>
                                <FaEye onClick={togglePasswordVisibility} className={`top-0 left-[430px] cursor-pointer
                                        size-[25px] fill-gray-500 absolute peer-focus:fill-[#3b82f9]
                                        ${showPassword?'hidden':''}`}></FaEye>
                                <FaEyeSlash onClick={togglePasswordVisibility} className={`top-0 left-[430px] cursor-pointer
                                        size-[25px] fill-gray-500 absolute peer-focus:fill-[#3b82f9]
                                        ${!showPassword?'hidden':''}`}></FaEyeSlash>
                            </label>
            </div>
            <div className='mt-[10px] mb-[10px]'>
                  <label className = 'relative'>
                      <input required 
                              type={!showPasswordConfirm?'password':'text'}
                              id='passwordConfirm'
                              value={passwordConfirm}
                              onFocus={handleFocusPassConfirm}
                              onBlur={handleBlurPassConfirm}
                              onChange={handlePasswordConfirmChange}
                              className='w-[470px] h-[54px] px-4 text-lg outline-none border-2 border-gray-400 rounded
                              hover:border-gray-600 duration-200 peer focus:border-[#3b82f9] bg-inherit'></input>
                      <span className={` absolute left-0 top-[-6px] px-1  tracking-wide pointer-events-none duration-200 bg-white peer-focus:text-[#3b82f9] ml-2 text-[#9c9998]
                                      ${!focusedPassConfirm?'focus:block text-lg  peer-focus:text-sm peer-focus:-translate-y-5 ':' -translate-y-5  text-sm ' } `}>                                                
                                      Xác nhận lại mật khẩu của bạn
                      </span>
                      <FaEye onClick={togglePasswordConfirmVisibility} className={`top-0 left-[430px] cursor-pointer
                              size-[25px] fill-gray-500 absolute peer-focus:fill-[#3b82f9]
                              ${showPasswordConfirm?'hidden':''}`}></FaEye>
                      <FaEyeSlash onClick={togglePasswordConfirmVisibility} className={`top-0 left-[430px] cursor-pointer
                              size-[25px] fill-gray-500 absolute peer-focus:fill-[#3b82f9]
                              ${!showPasswordConfirm?'hidden':''}`}></FaEyeSlash>
                  </label>
            </div>


            <button
                className="mt-[15px] w-[470px] h-[45px] text-[18px] hover:shadow-md hover:bg-[#0b57a9] rounded-[20px] bg-[#0b57d0] text-white font-medium rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Đăng ký
            </button>
            <div className='flex mt-[10px]'>
              <p>
                Tôi đã có tài khoản
              </p>
              <a href='/login' className=' ml-[10px] text-[#0b57d0] font-bold'>
                Đăng nhập
              </a>

            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;