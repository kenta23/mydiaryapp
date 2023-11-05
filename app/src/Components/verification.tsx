import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { useAppDispatch, useAppSelector } from '@/States/hook';
import { clearStatus, updateStatus } from '@/States/statusSlice';
import { auth } from '@/Firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Verification = () => {
     const [email, setEmail] = useState<string | null>('');
     const status = useAppSelector(state => state.getStatus);
     const [visible, setVisible] = useState<boolean>(false);
     const dispatch = useAppDispatch();
     const navigate = useNavigate();


     function submit (e: React.FormEvent<HTMLFormElement>) {
          e.preventDefault();

          if(email === '' || null) {
               dispatch(updateStatus('Please enter an email address'));
               setVisible(true);

               setTimeout(() => {
                  dispatch(clearStatus());
                  setVisible(false);
               }, 2000)
          }

         else {
             sendPasswordResetEmail(auth, email!).then(() => {
                 alert('Check your email address to reset your password');

                 setTimeout(() => {
                     navigate('/login');
                 }, 4000)

                 setEmail(''); 
                 
             }).catch(err => {
                switch(err.code) {
                    case 'auth/user-not-found':
                         dispatch(updateStatus('The email address you entered does not exist.'));
                         setVisible(true);
          
                         setTimeout(() => {
                            dispatch(clearStatus());
                            setVisible(false);
                         }, 2000);
                         console.log('error occured', err.message);
                         break;
                    default: 
                       console.log('No error found');
                }
             })
         }
     }

  return (
    <div className='w-full relative bg-bg h-screen min-h-fit flex place-items-center font-kaisei'>
         <form onSubmit={submit} className='bg-white py-5 px-3 flex gap-3 min-w-[190px] max-w-[300px] flex-col mx-auto rounded-lg shadow-lg shadow-gray'> 
              <h1 className='text-[1.5rem] font-semibold text-dark'>Reset your password</h1>
              <TextField 
                   required
                   label="Email"
                   size='small'
                   variant='outlined'
                   color='warning'
                   className='p-[10px]'
                   name='email'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
              />
              <button type='submit' className='bg-logo text-white rounded-md py-2 w-[120px] mx-auto shadow-lg hover:bg-orange-400 transition-colors ease-in-out duration-200 active:bg-orange-600'>Submit</button>
         </form>

      <div className='w-full absolute bottom-[27%] h-fit'>
          {visible && <h1 className='duration-150 font-inter mx-auto text-[12px] md:text-[14px] bg-[#353027] w-fit text-white py-2 rounded-[20px] px-3 text-center'>{status.value}</h1>}
      </div>
         
    </div>
  )
}

export default Verification