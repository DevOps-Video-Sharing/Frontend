import React, { useState, useEffect } from "react";
import MonoComment from "./MonoComment";
import { AiOutlineSend } from "react-icons/ai";
import axios from 'axios';
import { useSearchParams } from "react-router-dom";

const Comment = () => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const userId = localStorage.getItem('userToken');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const userName = `${firstName} ${lastName}`;
    const [searchParams] = useSearchParams();
    const videoId = searchParams.get('videoId');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comment/getALLCommentByVideoId/${videoId}`);
            setComments(response.data || []); // Ensure comments is an array
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]); // Fallback to an empty array in case of error
        }
    };

    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim()) {
            try {
                const newComment = { text: commentText, likes: 0, dislikes: 0, videoId: videoId, userId: userId, userName: userName };
                await axios.post('http://localhost:8080/comment/upload', newComment);
                setCommentText("");
                fetchComments(); // Refresh the comments list
            } catch (error) {
                console.error("Error uploading comment:", error);
            }
        }
    };

    return (
        <div className="w-full relative">
            <div className="mx-2 absolute top-0 left-0 w-full flex items-center gap-3 mb-6">
                <input
                    type="text"
                    value={commentText}
                    onChange={handleCommentChange}
                    className="px-4 rounded-[10px] py-3 border-[1px] w-[100%]"
                    placeholder="Viết bình luận ..."
                />
                <AiOutlineSend 
                    onClick={handleCommentSubmit} 
                    className="cursor-pointer mr-3 size-[40px] rounded-[10px] px-2 py-2 hover:bg-[#ededed]" 
                />
            </div>
            <div className="h-[80px]"></div>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <MonoComment key={index} comment={comment} fetchComments={fetchComments} />
                ))
            ) : (
                <p className="text-center mt-6">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
}

export default Comment;
