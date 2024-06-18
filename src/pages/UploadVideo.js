import React, { useEffect, useState, useRef } from 'react';
import NavbarApp from '../components/NavbarApp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadVideo = () => {
    const [file, setFile] = useState(null);
    const [videoName, setVideoName] = useState('');
    const [description, setDescription] = useState('');
    const userToken = localStorage.getItem('userToken');
    const [thumbnail, setThumbnail] = useState(null);

    const [avar, setAvar] = useState(null);


    const toastId = useRef(null);

    const startload = (msg) => {
        toastId.current = toast.info(msg, { autoClose: false });
      };
      
    const endload = (msg, ty) => {
        toast.update(toastId.current, {
          render: msg,
          autoClose: true,
          type: ty === 2 ? 'error' : 'success',        });
      };

    useEffect(()=>{

    },[avar])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };
    const handleThumbnailChange = (event) => {
        const selectedThumbnail = event.target.files[0];
        setThumbnail(selectedThumbnail);
        setAvar(URL.createObjectURL(selectedThumbnail));
    }

    const handleTitleChange = (event) => {
        setVideoName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        startload('Đang đăng tải video')
            const firstName = localStorage.getItem('firstName');
            const lastName = localStorage.getItem('lastName');
            const fullName = firstName + ' ' + lastName;
        try {
            const formData = new FormData();
            formData.append('videoName', videoName);
            formData.append('description', description);
            formData.append('file', file);
            formData.append('userID', userToken);
            formData.append('thumbnail', thumbnail);
            formData.append('userName', fullName);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/video/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            // alert('Video uploaded!');
            endload('Upload thành công', 1)
        } else {
            const errorText = await response.text(); // Lấy dữ liệu phản hồi dưới dạng văn bản
            // alert('Failed to upload video: ' + errorText);
            endload('Upload thất bại', 2)

            console.log('Failed to upload video: ' + errorText)
        }
    } catch (error) {
        console.error('Failed to upload video:', error);
        // alert('Failed to upload video. An error occurred.');
        endload('Upload thất bại', 2)

    }
};

    return (
        <div className=" bg-[#f0f4f9] h-screen "> 
                    <ToastContainer position='bottom-right'/>

            <NavbarApp/>
            <div className='h-[80px]'></div>
            <div className=' flex justify-center items-center  w-screen'>
                <div className="flex flex-col  w-[500px] bg-white p-5 items-center rounded-[15px] drop-shadow-xl">
                    <h1 className="text-[30px] font-bold mb-4">Đăng tải video</h1>
                    <form onSubmit={handleSubmit} className="px-4 w-full">
                        <div className="mb-4 w-full ">
                            <label htmlFor="file" className="block">Video:</label>
                            <input type="file" id="file" accept=".mp4" onChange={handleFileChange} 
                            className="border w-full rounded-[10px] border-gray-300 p-2" />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="file" className="block">Ảnh thu nhỏ:</label>
                            <input type="file" id="thumbnail" accept=".png, .jpg" onChange={handleThumbnailChange} 
                            className="border  w-full rounded-[10px] border-gray-300 p-2" />
                        </div>
                        {
                            avar!==null?
                            <div className="mb-5 flex justify-center">
                                <img src={avar} alt='Thumb'></img>
                            </div>
                            :
                            <div></div>

                        }
                        <div className="mb-4">
                            <label htmlFor="videoName" className="block">Tiêu đề:</label>
                            <input type="text" id="videoName" value={videoName} onChange={handleTitleChange} 
                            className="border  w-full rounded-[10px] border-gray-300 p-2" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block">Mô tả:</label>
                            <textarea id="description" value={description} onChange={handleDescriptionChange} 
                            className="border w-full rounded-[10px] h-[150px] border-gray-300 p-2" />
                        </div>
                        <button type="submit" className="bg-blue-500  text-white py-2 px-4
                            grow focus:border-[#595959] focus:border-[1px] hover:bg-[#687fe6] rounded-[20px]  w-[200px] h-[45px]
                            border-[1px] border-[#ccc] outline-none font-bold
                        ">Tải lên</button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default UploadVideo;