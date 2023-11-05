import React, {useEffect, useState } from 'react'
import { PenSquare, Pencil, RotateCcw, Send, Smile } from 'lucide-react'
import  noProfile  from '../assets/user-orange.png'
import  { EmojiStyle } from 'emoji-picker-react';
import Picker from 'emoji-picker-react';
import { getDatabase, ref, set,} from 'firebase/database';
import { auth } from '@/Firebase/firebase';
import date from 'date-and-time';
import { useAppDispatch, useAppSelector } from '@/States/hook';
import { uid } from 'uid';
import { clearStatus, updateStatus } from '@/States/statusSlice';
import { newPostStatus } from '@/States/createNewSlice';

type inpuTypes = {
  post: string,
  title: string,
}


const CreatePost = () => {
  const [clickEmoji, setClickEmoji] = useState<boolean>(false);
  const [input, setInput] = useState<inpuTypes>({
    post: '',
    title: '',
  });

 
 
  const limitTitle = 18; //length of title characters
  const uuid = uid();

  //const [status, setStatus] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  //reducers 
  const status = useAppSelector(state =>  state.getStatus);
  const dispatch = useAppDispatch();
  const createPostStatus = useAppSelector(state => state.getPostStatus);
  const profilepicture = useAppSelector(state => state.getAccount);

  let contentPost;

  useEffect(() => {
     if(status) {
        setVisible(true);

        setTimeout(() => {
          dispatch(clearStatus());
          setVisible(false);
        }, 1000);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, status.value]);
  
   const handleEmojiClick = (emoji: string) => {
     //add the emoji to the input state
     setInput(prev => ({
      ...prev,
      post: prev?.post + emoji,
    }));
     setClickEmoji(false);
  }

  const limitTitleChar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if(val.length <= limitTitle) {
      setInput(prev => ({
        ...prev,
        title: val,
      }));
    }
  }



  const submitInput = async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      //save the input to the database 
      const database = getDatabase();
      const now = new Date();
      const timestamp = date.format(now, 'YYYY, MMM DD ddd');

      setVisible(true);

      setTimeout(() => {
        setVisible(false);
        dispatch(clearStatus());
      }, 1000)

      if(input.title === '') {
        dispatch(updateStatus('Empty Title'));
        return; 
      }

      else if (input.post === '') {
        dispatch(updateStatus("Empty Diary"));
        return; 
      }
     
      else {
        try {    
          const newDiaryRef = ref(database, `Diary/${uuid}`);
          await set(newDiaryRef, {
           UserId: auth.currentUser?.uid,
           date: timestamp,
           title: input.title,
           diary: input.post,
           uid: uuid
        });
          dispatch(updateStatus("Successfully Posted"));
          dispatch(newPostStatus(true));
        
          setInput({
            post: '',
            title: '',
          });
         }
         catch (error) {
           console.log(error);
           setVisible(true);
   
           setTimeout(() => {
              setVisible(false);
           }, 1000);
           dispatch(updateStatus("Something went wrong"));
         }
      }
  }

if(!createPostStatus.value) { 
 contentPost = ( 
 <form onSubmit={submitInput} className='mx-0 font-kaisei border border-[#745E3D] md:mr-0 lg:mr-[335px] xl:mr-[360px] w-max sm:w-[450px] md:w-[550px] lg:w-[700px] xl:w-[850px] h-[495px] '>
  <div className='title flex gap-2 py-2 font-bold border-b border-[#745E3D] w-full h-[55px] items-center justify-center'>  
     <div className='relative flex items-center'>
        <input 
           value={input.title} 
           onChange={limitTitleChar}
           type='text' 
           className='uppercase bg-transparent  text-[#292114] text-[17px] md:text-[20px] lg:text-[25px]  indent-2 placeholder-[#8b7d67] border-none outline-none w-auto' 
           placeholder='No Title'
        />
        <Pencil  color='#8b7d67' className='text-center absolute right-2 top-0 lg:top-2 w-[17px] md:w-[20px] lg:w-[25px]  '/>
     </div> 
  </div>
  

  <div className='content pt-[30px] relative h-full'>
    <div className='flex justify-around xl:justify-between items-start mx-2 xl:mx-6'>
      <div className='flex flex-row items-start gap-[12px]'>
         <img src={profilepicture.value.ProfileDisplay ? profilepicture.value.ProfileDisplay : noProfile} alt="" className='w-[30px] rounded-full lg:w-[40px] h-auto'/>
         <textarea name="post" 
            value={input.post} 
            onChange={(e) => setInput(prev => ({...prev, post: e.target.value}))} 
            placeholder='Your thoughts....'  
            className=' flex-1 bg-[#f0e7d9] placeholder-[#776E57] lg:text-[20px] w-[190px] sm:w-[270px] indent-3 md:w-[380px] lg:w-[500px] xl:w-[700px] h-[360px] resize-none outline-none p-2'>          
        </textarea>
     </div>

      <RotateCcw className=''size={18} color='#A88248' onClick={() => setInput({title: '', post: ''})} cursor={'pointer'}/>
    </div> 

    <div className='emojiOrsend flex flex-row gap-[20px] absolute bottom-[75px] right-6'>
      <div className=''>
        <Smile size={30} color='#DE6C2C' className='cursor-pointer' onClick={() => setClickEmoji(prev => !prev)}/> 
        {clickEmoji ? <Picker width={260} emojiStyle={EmojiStyle.APPLE}  onEmojiClick={(e) => handleEmojiClick(e.emoji)}/> : null} 
      </div>
       <Send size={30} color='#2F8421' className='cursor-pointer' onClick={submitInput}/>
    </div>
   </div>
 </form> ) } 

 else {
  contentPost = (
   <div className='mx-0 font-kaisei border border-[#745E3D] flex flex-col items-center justify-center md:mr-0 lg:mr-[335px] xl:mr-[360px] w-[250px] sm:w-[450px] md:w-[550px] lg:w-[700px] xl:w-[850px] h-[495px]'>
     <div className='flex flex-row gap-2 items-center cursor-pointer' onClick={() => dispatch(newPostStatus(false))}>
       <PenSquare color='#745E3D' className='lg:w-[29px] h-auto'/><span className='text-[#745E3D] font-medium text-[22px] md:text-[30px] lg:text-[35px]'>Create New</span>
     </div>
  </div> )
 } 
 
  return (
   <div className=''>
     <div className='absolute top-[120px] left-[35%] h-screen'>
       {visible && <h1 className='duration-150 font-inter text-[12px] md:text-[14px] bg-[#353027] w-fit text-white py-2 rounded-[20px] px-3 bottom-5 text-center'>{status.value}</h1>}
     </div> 
        {contentPost}
   </div> 
  ) 
}

export default CreatePost