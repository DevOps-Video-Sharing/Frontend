import React, {useState, useEffect} from "react"
import { IoMdSearch } from "react-icons/io";
import VideoSearch from "../components/VideoCom/VideoSearch";
import st from '../assets/images/avar.jpg'

const Account = () => 
{

    const [results, setResults] = useState([])
    const lists = [{stt: '1',msg:  'ok',},
        {stt: '2',msg:  'ok1 dsdasd',},
        {stt: '3',msg:  'ok2f sffds',},
        {stt: '4',msg:  'ok3 fdsfd s',},
        {stt: '5',msg:  'ok4fsdfds',},
        {stt: '6',msg:  'ok5 fdsfds'},
        {stt: '7',msg:  'ok6fdsfds ',},
    ]
    const handleFilter = query =>{
        let filterVideo = lists.filter(f =>{
            return f.msg.toLowerCase().includes(query.toLowerCase())
        });
        setResults(filterVideo)


    }
    return(
        <div className='w-full'>
            <VideoSearch
                            wi={405}
                            img={st}
                            title={'okdsdddddddddddddddddddddddđsad sadddddddddddđ'}
                            username={'okusser'}
                            timestamp={'null'}
                            view={100}
                            videoId={'dsad'}
                            userid={'đasa'}/>
        </div>
    )
}
export default Account