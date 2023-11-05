import {useAppSelector } from '@/States/hook';
import CreatePost from './CreatePost';
import ViewDiary from './ViewDiary';
import { useState } from 'react';


const Diary = () => {
    const clicked = useAppSelector(state => state.diary.value);
    const [visible] = useState<boolean>(false);
    const getStatus = useAppSelector((state) => state.getStatus);


    let content;

    if(clicked) {
        content = (
            <div>
                <ViewDiary />
            </div>
        )
    }
    else {
           content = (
            <div>
              <CreatePost />
            </div>
        )
    }

  return (
    <div className=''>
          {content}
          {visible && <h1 className='duration-150 relative font-inter text-[12px] md:text-[14px] bg-[#353027] w-fit text-white py-2 rounded-[20px] px-3 bottom-12 left-[30%] text-center'>{getStatus.value}</h1>}
    </div>
  )
}

export default Diary