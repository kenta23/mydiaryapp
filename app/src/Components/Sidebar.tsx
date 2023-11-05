/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState } from 'react'
import { AlignRight, MinusCircle, PenSquare, X } from 'lucide-react'
import user from '../assets/user.png'
import { auth, database } from '@/Firebase/firebase'
import { ref, onValue, remove } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/States/hook'
import { clicked } from '@/States/Slice'
import { putDiaryuid } from '@/States/diarySlice'
import {  open } from '@/States/menuSlice'
import { saveTitleAndContext } from '@/States/savingInput'
import { accountInfoState } from '@/utils/reduxTypes'
import { updateStatus } from '@/States/statusSlice'


type dataTypes = {  
    UserId: string | null,
    title: string | null,
    diary: string | null,
    date: string | null,
    uid: string | null,
}

const Sidebar = () => {
   const [clickMenu, setClickMenu] = useState<number | null>(null);
   const [contentClicked, setContentClicked] = useState<number | null>(null);
   const [data, setData] = useState<dataTypes[]>([]);

   const [deleted, setDeleted] = useState(false);
   const accountInfo: accountInfoState = useAppSelector(state => state.getAccount);
  
  
  
   const authId = auth.currentUser?.uid;
   const navigate = useNavigate();
   //reducers
   const dispatch = useAppDispatch();


   useEffect(() => {
    const readDiary = () => {
      const diaryRef = ref(database, `Diary/`);

     onValue(diaryRef, (snapshot) => {
        const dataVal = snapshot.val()
        setData([]);
        if(dataVal !== null) { 
          const dataArray = Object.values(dataVal).map((datas) => datas) as dataTypes[];     
          setData(dataArray);
        
        }
      })
     }
     readDiary();
    }, [])

    function handleClickMenu(e: React.MouseEvent, id: number) {
       e.stopPropagation();
       // Toggle the clicked item's menu visibility
       setClickMenu((prevId) => (prevId === id ? null : id));
    }

    function ContentView (id: number, uid: string | null, titleP: string | null, diaryP: string | null) {
      setContentClicked((prev) => (prev === id ? null : id));  // if clicked the same object then the value is still null 
     // console.log("Content is "+contentClicked) 

      if(contentClicked) {
        dispatch(clicked());
        dispatch(putDiaryuid(uid)); //for getting the specific uid for viewing diary 
    
        dispatch(saveTitleAndContext({title: titleP, diary: diaryP}));  
      }     
    }
    

    //REMOVE ITEMS 
 const removeDiary = async(userId: string | null) => {
    const itemRef = ref(database, `Diary/${userId}`) // Replace with your data path
    try
    {
      await remove(itemRef);
      setDeleted(true);  
   
      dispatch(updateStatus("Deleted Successfully"));
    }
    catch (err) {
      console.log(err);
    } 
  }

  
  return (
  <>
  {/**FOR MOBILE DEVICES */}
    <div className='bg-primary sidebar z-10 px-[30px]  min-w-[220px] lg:w-[335px] xl:w-[360px] h-screen block relative top-0'>
      <div className='flex  flex-col gap-4 justify-between items-end '>  
       
    
           <div className='mt-[33px] flex items-center justify-around gap-[90px] lg:float-right mr-[23px] h-auto'>
              <X color='white' size={34} className='cursor-pointer lg:hidden block' onClick={() => dispatch(open())}/>
              <img src={accountInfo.value.ProfileDisplay ? accountInfo.value.ProfileDisplay :  user} alt="" className='w-[48px] hidden lg:block cursor-pointer rounded-full shadow-lg' onClick={() => navigate('/Profile')}/>
          </div>
      
 
      
        <div className='w-full '>
              <div className='mt-[50px] gap-6 flex flex-col justify-center items-center'>
                  <h1 className='text-center text-white font-inika text-[27px] sm:text-[25px] lg:text-[30px]'>{accountInfo.value.FirstName}'s Diary</h1>

                  {/**READ ALL THE DIARIES HERE*/}
              <div className='min-w-auto sm:max-h-[700px] md:max-h-[850px] lg:max-h-[950px] xl:max-h-[500px] overflow-y-auto container flex flex-col gap-[25px] items-start'> 
                {data.filter((item: dataTypes) => authId === item.UserId)
               .sort().map((item: dataTypes, id: number) => (
                  //if different user then it will not render
                  authId === item.UserId && 
                  <div key={id} 
                  className={`font-kaisei h-[90px] min-w-[180px] sm:px-[14px] lg:px-[19px] py-[12px] bg-[#F4E1C3] hover:scale-105 transition-transform 
                  ease-in-out duration-150 cursor-pointer shadow-[#07B42] rounded-[25px] 
                  shadow-lg justify-evenly flex gap-[40px] text-center items-center 
                  max-w-[290px] px-2 
                  ${clickMenu ? 'sm:gap-[50px] lg:gap-[40px]' : 'sm:gap-[50px]'} flex`}>
                    
                     <div className="flex-col justify-center items-start gap-[5px] flex">
                         <div className="text-start text-yellow-900 text-[14px] sm:text-[16px] lg:text-lg font-normal" >{item.title}</div>
                         <div className="text-start text-stone-500 text-[12px] sm:text-[12px] lg:text-[md] font-normal">{item.date}</div>
                      </div>

                     {/**EDIT AND DELETE BUTTONS */}
                      <AlignRight onClick={(e) => handleClickMenu(e,id)} color='#DC612C' className={`${!deleted && clickMenu? 'hidden' : 'block'} cursor-pointer`} size={30}/>
                     {clickMenu === id && 
                       <div className='flex gap-2 items-center' onClick={(e) => e.stopPropagation()}>
                         <MinusCircle color='#DA2727'size={24} className='cursor-pointer' onClick={() => removeDiary(item.uid)}/>
                         <PenSquare color='#1390AB' size={24} className='cursor-pointer' onClick={() => ContentView(id,item.uid, item.title, item.diary)} />
                         <X color='#DC612C'size={24} className='cursor-pointer' onClick={() => setClickMenu((prevId) => (prevId === id ? null : id))}/>
                      </div>}               
                   </div>      
                ))}            
              </div>
          </div>
        </div>
    </div>  
  </div> 
 </>
 )
}

export default Sidebar