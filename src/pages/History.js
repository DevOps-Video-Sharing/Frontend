import React, {useState, useEffect} from "react";
import Loading from "../components/Loading";
import VideoSearch from "../components/VideoCom/VideoSearch";
import NavbarApp from "../components/NavbarApp";
import { IoMdMenu } from "react-icons/io";


const History = () => {
    const [videoIds, setVideoIds] = useState([]);
    const [values, setValueIds] = useState();
  
    const [videoUrls, setVideoUrls] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [videoHeight, setVideoHeight] = useState('auto');
  
    const [urlVideo, setUrlVideo] = useState()
    useEffect(() => {
      const fetchVideoIds = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/video/getHistoryByUserId/${localStorage.getItem('userToken')}`);
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
    }, []);
    

  
  
    const generateThumbnailUrls = () => {
      return videoIds.map((id) => {
        return  `${process.env.REACT_APP_API_URL}/video/get/${id}`
        });
    };
    
    function getSortedIndexes(values) {
      // Kiểm tra xem values có hợp lệ không
      if (!values || values.length === 0) {
        return [];
      }
      const indexes = Array.from({ length: values.length }, (_, i) => i);
      indexes.sort((a, b) => values[b].views - values[a].views);
      const indexesSmall = Array.from({ length: values.length }, (_, i) => i);
      indexesSmall.sort((a, b) => {
      // Lấy giá trị views và timestamp của mỗi phần tử
      const viewsA = values[a].views !== undefined ? values[a].views : 0;
      const viewsB = values[b].views !== undefined ? values[b].views : 0;
      const timestampA = values[a].metadata.timestamp;
      const timestampB = values[b].metadata.timestamp;
    
      return new Date(timestampB) - new Date(timestampA);
  
    });
    //   const newIndexes = indexes.slice(0,4).concat(indexesSmall.slice(0, indexesSmall.length))
      return indexesSmall;
  
    }
  
    const thumbnails =  generateThumbnailUrls();
  
    const [indexs, setIndexs] = useState([])
    useEffect(()=>{
      setIndexs( getSortedIndexes(values))
    },[values])
    const start = 4
    return(
        <div>
            <NavbarApp/>

            <div className='h-[60px]'></div>

            <div className='flex gap-5 justify-center items-center my-3 pt-[10px] w-3/5 text-black font-bold'>
                <IoMdMenu className='cursor-pointer size-[35px]' />
                <p className=' text-[#474747] text-[30px]'>Các video đã xem</p>
            </div>
            <div className='w-full '>
                <div>

                </div>
                {(values && values.length > 0 && thumbnails && thumbnails.length > 0) ? (
                    thumbnails.slice(0).map((url, index) => (
                        <VideoSearch
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
                        )  : (
                        <Loading/>
                        )}

            </div>
        </div>

    )
}
export default History