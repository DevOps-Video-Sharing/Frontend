import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

// Hàm tạo mã sự kiện ngẫu nhiên gồm 5 ký tự
const generateEventCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const Livestream = () => {
    // Lấy mã sự kiện từ localStorage hoặc tạo mã mới nếu chưa có
    const [eventCode, setEventCode] = useState(localStorage.getItem("eventCode") || generateEventCode());
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isStreamLive, setIsStreamLive] = useState(false);

    useEffect(() => {
        // Lưu mã sự kiện vào localStorage khi eventCode thay đổi
        localStorage.setItem("eventCode", eventCode);
    }, [eventCode]);

    // Hàm kiểm tra trạng thái của livestream
    const checkStreamStatus = async () => {
        try {
            const response = await fetch(`http://192.168.120.213:13000/hls/${eventCode}.m3u8`, { method: 'HEAD' });
            setIsStreamLive(response.ok); // Kiểm tra nếu stream có sẵn
        } catch (error) {
            setIsStreamLive(false);
        }
    };

    // Hàm xử lý khi người dùng gửi tin nhắn
    const handleSendMessage = () => {
        if (message.trim()) {
            setChatMessages([...chatMessages, { text: message, timestamp: new Date().toLocaleTimeString() }]);
            setMessage('');
        }
    };

    // URL của livestream (dựa vào eventCode làm stream key)
    const streamUrl = `http://192.168.120.213:13000/hls/${eventCode}.m3u8`;
    console.log(streamUrl)

    return (
        <div className="flex bg-[#f0f4f9] min-h-screen p-5">
            <div className="w-2/3 p-4 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Cài đặt sự kiện phát trực tiếp</h1>
                
                {/* Mã sự kiện phát trực tiếp */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Mã sự kiện phát trực tiếp:</label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={eventCode}
                            readOnly
                            className="border border-gray-300 rounded-lg p-2 text-center font-mono text-lg w-[120px] bg-gray-100 mr-4"
                        />
                    <button
                        onClick={() => {
                            setEventCode(generateEventCode());
                            window.location.reload();  
                        }}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                        Tạo mã mới
                    </button>

                    </div>
                </div>
                
                {/* Khung phát trực tiếp */}
                <div className="aspect-w-16 aspect-h-9 bg-black mb-4 rounded-lg">
                    {/* Hiển thị video phát trực tiếp */}
                    {isStreamLive ? (
                        <ReactPlayer
                            url={streamUrl}
                            playing
                            controls
                            width="100%"
                            height="100%"
                            config={{ file: { forceHLS: true } }}
                        />
                    ) : (
                        <p className="text-gray-500 text-center py-10">Chưa có livestream nào đang phát.</p>
                    )}
                </div>
                
                <button
                    onClick={checkStreamStatus}
                    className="px-4 py-2 mt-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                >
                    Kiểm tra trạng thái livestream
                </button>
                
                {/* Thông tin thêm */}
                <p className="text-gray-500 text-sm mt-2">Đang phát trực tiếp: Đây là khung video phát trực tiếp của bạn.</p>
            </div>

            {/* Thanh trò chuyện trực tiếp */}
            <div className="w-1/3 ml-4 p-4 bg-white rounded-lg shadow-lg flex flex-col">
                <h2 className="text-xl font-bold mb-4">Trò chuyện trực tiếp</h2>
                
                {/* Hiển thị tin nhắn trò chuyện */}
                <div className="flex-grow overflow-y-auto mb-4 border rounded-lg p-2 bg-gray-50">
                    {chatMessages.length === 0 ? (
                        <p className="text-gray-500 text-center">Chưa có tin nhắn nào.</p>
                    ) : (
                        chatMessages.map((msg, index) => (
                            <div key={index} className="mb-2">
                                <p className="text-sm"><span className="font-semibold">Người dùng:</span> {msg.text}</p>
                                <p className="text-xs text-gray-400">{msg.timestamp}</p>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Nhập và gửi tin nhắn */}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="border rounded-lg p-2 flex-grow mr-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Livestream;
