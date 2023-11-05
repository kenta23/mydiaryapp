import { Pencil, RotateCcw, Send, Smile, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import  noProfile  from '../assets/user-orange.png'
import { auth, database } from '@/Firebase/firebase'
import { onValue, ref, remove, update } from 'firebase/database'
import { useAppDispatch, useAppSelector } from '@/States/hook'
import  { EmojiStyle } from 'emoji-picker-react';
import Picker from 'emoji-picker-react';
import { clearStatus, updateStatus } from '@/States/statusSlice'
import CreatePost from './CreatePost'



type itemMapType ={
    UserId: string, 
    title: string,
    diary: string, 
    date: string, 
    uid: string, 
}

type textInputType = {
    title: string,
    content: string 
} 

interface DiaryItem {
    UserId: string, 
    title: string,
    diary: string, 
    date: string, 
    uid: string, 
}

const ViewDiary = () => {
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState<DiaryItem[]>([]);
    const [textInput, setTextInput] = useState<textInputType>({
        title: '',
        content: '',
    })
    const [visible, setVisible] = useState<boolean>(false);
    const [clickedEmoji, setClickedEmoji] = useState<boolean>(false);
    const [tempUid, setTempUid] = useState('');

    //get the data from the sidebar clicked item
    const viewDiary = useAppSelector((state) => state.getDiary.value);

    //reducers 
    const status = useAppSelector((state) => state.getStatus);
    const dispatch = useAppDispatch();
    const defaultContext = useAppSelector((state) => state.getInput);
    const [newPostState, setNewPostState] = useState<boolean>(false);
    const profilepicture = useAppSelector(state => state.getAccount);

    //const defaultContextDispatch = useAppDispatch(); 
  
   
 
    useEffect(() => {
      const RenderData =  () => {
        const diaryRef = ref(database, `Diary/`);

        onValue(diaryRef, (snapshot) => {
           const rawData = snapshot.val();
           setData([]);

           if(rawData !== null) {
           // Object.values(rawData).map(items => {
            //    setData(prev => [...prev, items]);
           //  })
             const items = Object.values(rawData) as DiaryItem[]; // Cast to the DiaryItem[] type
             setData(items);
           }
        })
      }
       RenderData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        setTextInput({
          title: defaultContext.value.title,
          content: defaultContext.value.diary
        })
    }, [defaultContext])

    const limitTitleChar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = (e.target.value).toString().trim();
        const limitTitle = 18;
        if(val.length <= limitTitle) {
          setTextInput(prev => ({
            ...prev,
            title: val,
          }));
        }
      }
    
    const handleEdit  = (item: string) => {
       setTempUid(item)
       setEdit(prev => !prev)
    }

    const updateDiary = async() => {
       const diaryRef = ref(database, `Diary/${tempUid}`);

       dispatch(updateStatus('Successfully updated'));
       setVisible(true);
       setTimeout(() => {
          setVisible(false);
          dispatch(clearStatus()); //clear the status after 1 second 
       }, 1000);
     
    try {

      console.log('Successfully updated');
        await update(diaryRef, {
          UserId: auth.currentUser?.uid,
          title: textInput.title,
          diary: textInput.content,
          uid: tempUid
    });   //update the selected diary


      setTextInput({
        title: '',
        content: '',
      })
      setEdit(false);
  }
       catch (err) { 
          console.log(err);
       }

       setNewPostState(false);
    }

    const handleEmojiClick = (emoji: string) => {
        //add the emoji to the input state
        setTextInput(prev => ({
         ...prev,
         content: prev?.content +emoji,
       }));
        setClickedEmoji(false);
     }
   
  

   //DELETE DATA 
   const removeDiary = async(userId: string | null) => {
    const itemRef = ref(database, `Diary/${userId}`) // Replace with your data path
    try
    {
      await remove(itemRef);
      setNewPostState(true)
    }
    catch (err) {
      console.log(err);
    } 
  }

return (
<>
{newPostState? <CreatePost/> : <div className='mx-[40px] lg:mx-[10] relative font-kaisei border border-[#745E3D]  flex-col items-center justify-center md:mr-[190px] lg:mr-[335px] xl:mr-[360px] w-[250px] sm:w-[400px] md:w-[550px] lg:w-[500px] xl:w-[850px]  h-max'>
  {visible && <h1 className='duration-150 font-inter absolute text-[12px] md:text-[14px] bg-[#353027] w-fit text-white py-2 rounded-[20px] px-3 top-[-70px] left-1/2 text-center'>{status.value}</h1>}
   {data.map((item: itemMapType, id) => (
   viewDiary === item.uid && <div key={id}>
     <div className=' flex items-center justify-center w-full h-[65px] border-b border-[#745E3D]'>
       {edit ? 
       <div className='relative'>
        {/**START DOING A MAP DATA HERE */}
      
        <input 
           type='text' 
           className='uppercase bg-transparent  text-[#292114] text-[17px] md:text-[20px] lg:text-[25px]  indent-2 placeholder-[#8b7d67] border-none outline-none w-auto' 
           placeholder={item.title}
           name='title'
           defaultValue={textInput.title}
           onChange={limitTitleChar}
           contentEditable //make conditional here -- contentEditable or disabled
        /> 
        <Pencil  color='#8b7d67' className='text-center absolute right-6 top-0 lg:top-2 w-[17px] md:w-[20px] lg:w-[25px]  '/> {/**display or not */}
     </div> : <h1 defaultValue='Untitled' className='uppercase bg-transparent  text-[#292114] text-[17px] md:text-[20px] lg:text-[25px]  indent-2 placeholder-[#8b7d67]'>{item.title}</h1>}
     </div> 
     <div className='float-right mx-[23px] my-[25px]'>
       <span className='text-[#96866E] text-[18px] font-normal'>{item.date}</span>
    </div>

   <div className='mt-[73px] mb-[105px]'>
     <div className='content pt-[30px] relative h-full'>
      <div className='flex justify-around xl:justify-between items-start mx-2 xl:mx-6'>
       <div className='flex flex-row items-start gap-[12px]'>
         <img src={profilepicture.value.ProfileDisplay? profilepicture.value.ProfileDisplay : noProfile}  alt="" className='w-[30px] rounded-full lg:w-[40px] h-auto'/>
        {edit ?
        <>
           <textarea 
             name="post" 
             placeholder=''   
             defaultValue={textInput.content}
             onChange={(e) => setTextInput(prev => ({...prev, content: e.target.value}))}      
             className=' flex-1 bg-[#f0e7d9] placeholder-[#776E57] lg:text-[20px] w-auto sm:w-[200px] indent-3 md:w-[260px] lg:w-[400px] xl:w-[700px] h-[360px] resize-none outline-none p-2'>  
           </textarea>
         <RotateCcw className=''size={18} color='#A88248'cursor={'pointer'}/>
        </> : 
        <h1>{item.diary}</h1>    
      }
     </div>
    </div> 

    </div>


 <div className='flex flex-col float-right  items-center gap-1'>
    {edit && <div className='emojiOrsend flex flex-row gap-[20px]'>
      <div className=''>
        <Smile size={30} color='#DE6C2C' className='cursor-pointer' onClick={() => setClickedEmoji(prev => !prev)}/> 
        {clickedEmoji ? <Picker width={260} emojiStyle={EmojiStyle.APPLE}  onEmojiClick={(e) => handleEmojiClick(e.emoji)}/> : null} 
      </div>
       <Send size={30} color='#2F8421' className='cursor-pointer' onClick={() => updateDiary()}/>
    </div>}


  <div className='flex gap-[28px] items-center justify-center mt-[25px] float-right mx-[25px]'>
     {edit ? <X color='#DC612C' size={30} cursor={'pointer'}/> : <button className='text-[#DC612C] hover:text-[#e27241] duration-150 transition-all ease-in-out  cursor-pointer text-[25px] font-medium' onClick={() => handleEdit(item.uid)}>Edit</button>}
     <button className='text-[#BD2323] hover:text-[#d34646] duration-150 transition-all ease-in-out cursor-pointer text-[25px] font-medium' onClick={() => removeDiary(item.uid)}>Delete</button>
  </div>
</div>   
  </div> 
         <h1 className='text-orange-500 font-semibold text-[20px] cursor-pointer mx-[15px] mb-[10px]' onClick={() => setNewPostState(true)}>Create New</h1>
  </div>
))}  
</div> }
</>
  )
}

export default ViewDiary