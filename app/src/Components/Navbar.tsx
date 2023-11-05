import menubar from '../assets/Menu bar.png'
import userIcon from '../assets/user-mobile.png'
import Sidebar from './Sidebar';
import { useAppDispatch, useAppSelector } from '@/States/hook';
import { open } from '@/States/menuSlice';
import { useNavigate } from 'react-router-dom';
import { accountInfoState } from '@/utils/reduxTypes';



const Navbar = () => {
  const menuOpener = useAppSelector(state => state.getMenuOpener);
  const menuDispatch = useAppDispatch();
  const accountInfo: accountInfoState = useAppSelector(state => state.getAccount);

  

  const navigate = useNavigate();


  return (
   <div>
    <div className={`navbar bg-secondary md:me-0 lg:me-[335px] xl:me-[360px] py-[20px] md:py-[25px] relative`}>
       <div className='flex flex-row items-center justify-between px-[22px] h-auto'>
        <div className='menubar cursor-pointer visible lg:invisible'>
              <img src={menubar} alt="" className='w-[21px] h-auto' onClick={() => menuDispatch(open())}/>
        </div> 
      
        <div>
             <h1 className='text-center text-logo font-inika md:text-[30px] lg:text-[35px] sm:text-[28px] text-[25px] font-[700]'> My Diary</h1>
        </div> 

        <div className='profileicon cursor-pointer visible lg:invisible'>
           <img src={accountInfo.value.ProfileDisplay? accountInfo.value.ProfileDisplay : userIcon} alt="" className='w-[35px] rounded-full h-auto cursor-pointer' onClick={() => navigate('/Profile')}/>
        </div>
          
      </div> 
        
    </div>
   
    <div className={`absolute ${menuOpener.value ? 'block' : 'hidden'} transition-all duration-150 ease-in-out top-0 lg:block lg:right-0`}>
       <Sidebar />
    </div>
    
  </div>
  )
}

export default Navbar