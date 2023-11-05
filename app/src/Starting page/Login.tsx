import React, { useState, useEffect } from 'react'
import bg from '../assets/undraw_login.png'
import book from '../assets/Book.png'
import TextField from '@mui/material/TextField'
import { NavLink } from 'react-router-dom'
import { auth, db } from '@/Firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch,  } from '@/States/hook'
import { saveAccount,  } from '@/States/SaveAccountLogin'
import { DocumentData, collection, getDocs } from 'firebase/firestore'


type userCredsType = {
    email: string,
    password: string
}
type docType = {
  FirstName: unknown,
  LastName: unknown,
  Email: unknown,
  Password: unknown,
  ProfileDisplay: unknown 
}
type authError = {
  code: string,
  message: string
}
const Login = () => {
    const [userCreds, setUserCreds] = useState<userCredsType>({
        email: '',
        password: '',
    })
    const navigate = useNavigate();
    const [visible, setVisible] = useState<boolean>(false);
    const [status, setStatus] = useState('');
    const [getAccountData, setGetData] = useState<DocumentData>([]);
    

    const dispatch = useAppDispatch();

    //check if user is already logged in then the page will redirect to the main page 
    const collectionData = collection(db, 'Users');
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/')
            }
        })
        auth.currentUser?.uid && navigate('/');

    }, [navigate, userCreds.email]); 

    
   //getting all the user's data and store to state when they logged in 
    const getData = async () => {
        const data = await getDocs(collectionData);
        
        const userdata = data.docs
        .map((doc) => doc.data()).filter(data => data.UserId === auth.currentUser?.uid);
  
        if (userdata) {
          setGetData(userdata);
  
          getAccountData.map((doc: docType) => (
            dispatch(saveAccount({
              firstname: doc.FirstName,
              lastname: doc.LastName,
              email: doc.Email,
              password: doc.Password,
              profiledisplay: doc.ProfileDisplay 
          }))
          ))
         
         }

      }

   
    const SignIn = async(e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        const { email, password } = userCreds //destructuring states
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign in successfully');

       
        setVisible(true);
        setStatus('Login Successful');
        await getData();


        setTimeout(() => {
            setVisible(false);
            navigate('/');
        }, 1000);

      } catch (error: unknown) {
        const autherror = error as authError //type assertion
        setVisible(true);
         // Handle login errors
      switch (autherror.code) {
         case "auth/user-not-found":
           console.log("User not found");
           setStatus('User not found');
           break;
         case "auth/invalid-email":
          setStatus('Invalid email');
           break;
         case "auth/wrong-password":
           console.log("Wrong password");
           setStatus('Wrong password');
           break;
         case "auth/email-already-in-use":
            console.log('Email already in use');
            setStatus('Email already in use');
            break;
         default:
            console.error("Login error:", error);
            setStatus('Something went wrong');
           break;
      }
        
        setTimeout(() => {
            setVisible(false);
        }, 2000);

      }        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target
         setUserCreds(prev => ({
            ...prev,
            [name]: value
         }))
    }

    

  return (
    <div className='bg-bg w-full h-screen lg:h-screen  max-w-full min-w-fit'>
        <div className='flex flex-col lg:flex-row justify-between h-full w-full'>
            <div className='left lg:w-[40%] ' style={{background: 'linear-gradient(50deg, #C17351 8.04%, rgba(228, 179, 144, 0.53) 52.94%, rgba(245, 196, 181, 0.00) 103.83%)'}}>
               <div className='h-full w-full justify-center items-center flex'>
                  <img src={bg} alt="" className='w-[300px] sm:w-[450px] lg:w-[535px] object-cover h-auto '/>
               </div>
            </div>

            <div className='right mt-[50px] lg:mt-0 lg:w-[60%] h-full'>
                <div className='flex flex-col h-full justify-center items-center'>
                    <div className='flex flex-col justify-center items-center relative'>
                        <h1 className='font-kaisei text-[25px] sm:text-[28px] md:text-[30px] lg:text-[35px] z-10'>Welcome to <span className='text-logo font-inika font-semibold'>MyDiariz</span></h1>
                        <span className='text-gray font-kaisei md:text-[20px]'>Start taking notes every single day 😊</span>

                        <img src={book} alt="" className='w-[240px] absolute bottom-[5px] select-none left-[-80px] md:left-[-110px]'/>
                    </div>


                    <form className='flex flex-col items-center justify-center gap-[32px] my-[28px]' onSubmit={SignIn}>
                        <TextField
                           required
                           label="Email"
                           size='small'
                           variant='outlined'
                           color='warning'
                           className='p-[10px]'
                           name='email'
                           value={userCreds.email}
                           onChange={handleChange}
                        />

                      <TextField
                           required
                           label="Password"
                           size='small'
                           variant='outlined'
                           color='warning'
                           className='p-[10px]'
                           name= 'password'
                           value={userCreds.password}
                           onChange={handleChange}
                           type='password'
                        />

                        <button className='font-kaisei  leading-tight font-medium bg-orange-400 text-white md:w-[201px] text-center md:px-[69px] px-[55px] py-[10px] md:py-[18px] rounded-[20px]' type='submit'>Log in</button>
                        <span className='font-kaisei font-medium text-gray cursor-pointer underline text-[17px]' onClick={() => navigate('/reset')}>Forgot Password?</span>
                    </form>

                    <h1 className='md:text-[22px] mb-[50px] font-kaisei'>Don't have an account? <NavLink to={'/register'} className='text-[#E57E1E] font-semibold cursor-pointer'>Sign up</NavLink></h1>
                    {visible && <h1 className='duration-150 font-inter text-[12px] md:text-[14px] bg-[#353027] w-fit text-white py-2 rounded-[20px] px-3 bottom-5 text-center'>{status}</h1>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login