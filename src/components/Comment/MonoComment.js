import React, { useState } from "react";
import { BsReplyAll } from "react-icons/bs";
import { AiFillLike, AiOutlineLike, AiOutlineSend } from "react-icons/ai"; // Ensure all necessary icons are imported
import axios from 'axios';

const MonoComment = ({ comment, fetchComments }) => {
    const [replyText, setReplyText] = useState("");
    const [showReplyInput, setShowReplyInput] = useState(false);
    const userId = localStorage.getItem('userToken');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const userName = firstName + " " + lastName;

    const handleLike = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/comment/increaseLikes/${comment.id}?increment=1`);
            fetchComments(); // Refresh the comments list
        } catch (error) {
            console.error("Error increasing likes:", error);
        }
    };

    const handleDislike = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/comment/increaseDislikes/${comment.id}?increment=1`);
            fetchComments(); // Refresh the comments list
        } catch (error) {
            console.error("Error increasing dislikes:", error);
        }
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = async () => {
        if (replyText.trim()) {
            try {
                const newReply = { text: replyText, likes: 0, dislikes: 0, videoId: comment.videoId, userId: userId, userName: userName };
                await axios.post(`${process.env.REACT_APP_API_URL}/comment/relyCommentByCommentId/${comment.id}`, newReply);
                setReplyText("");
                setShowReplyInput(false);
                fetchComments(); // Refresh the comments list
            } catch (error) {
                console.error("Error replying to comment:", error);
            }
        }
    };

    return (
        <div className="w-full">
            <div className="flex">
                <img src='path/to/avatar.jpg' alt='Avatar' className="w-[50px] h-[50px] rounded-[50%]" />
                <div className="mx-2 mr-5">
                    <p className="font-bold">{comment.userName}</p>
                    <p>{comment.text}</p>
                    
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center cursor-pointer" onClick={handleLike}>
                            <AiOutlineLike className="mr-1" />
                            <span>{comment.likes}</span>
                        </div>
                        <div className="flex items-center cursor-pointer" onClick={handleDislike}>
                            <AiFillLike className="mr-1" />
                            <span>{comment.dislikes}</span>
                        </div>
                        <div className="flex gap-3 cursor-pointer w-[120px] items-center rounded-[10px] px-3 py-2 hover:bg-[#dad9d9]" onClick={() => setShowReplyInput(!showReplyInput)}>
                            <BsReplyAll />
                            <button className="rounded-[10px] font-bold text-[13px]">Phản hồi</button>
                        </div>
                    </div>
                    
                    {showReplyInput && (
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="textbox"
                                value={replyText}
                                onChange={handleReplyChange}
                                className="px-4 rounded-[10px] py-3 border-[1px] w-[80%]"
                                placeholder="Viết phản hồi ..."
                            />
                            <AiOutlineSend 
                                onClick={handleReplySubmit} 
                                className="cursor-pointer size-[20px] rounded-[10px] px-2 py-2 hover:bg-[#ededed]" 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MonoComment;
