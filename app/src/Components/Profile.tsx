import { ArrowLeft, LogOut } from 'lucide-react'
import React, {useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'
import { auth, db, store } from '@/Firebase/firebase'
import { DocumentReference, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useAppDispatch, useAppSelector } from '@/States/hook'
import { clearStatus, updateStatus } from '@/States/statusSlice'
import { saveAccount, updateProfileDisplay } from '@/States/SaveAccountLogin'
import { accountInfoState } from '@/utils/reduxTypes'
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import AccountDeletionModal from '@/utils/AccountDeletionModal'
import { AuthCredential, AuthError, EmailAuthProvider, deleteUser, reauthenticateWithCredential, signOut, updateEmail, updatePassword } from 'firebase/auth'
import LogoutModal from '@/utils/LogoutModal'


type documentType  = {
   Email: string,
   FirstName: string,
   LastName: string,
   Password: string,
   UserId: string,
   ProfileDisplay: string
}
type AccountUserType = {
  firstname: string | null | undefined,
  lastname: string | null | undefined,
  email: string | null | undefined,
  password?: string | null | undefined,
  profileDisplay?: string | null | undefined,
}

const Profile = () => {
  const [changePass, setChangePass] = useState<boolean>(false);
  const [userData, setUserData] = useState<documentType[]>([]);
  const [updateAccount, setUpdateAccount] = useState<AccountUserType>({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      profileDisplay: ''
  })
  const [confirmPassword, setConfirmPassword] = useState<string | null | undefined >('');
  const [documentReference, setDocumentReference] = useState<DocumentReference[]>([]);
  const [visible, setVisible] = useState(false);
  const accountInfo: accountInfoState = useAppSelector(state => state.getAccount) ;
  //image file
  const [imageFile, setImageFile] = useState< Blob | Uint8Array | ArrayBuffer | File | null | undefined>();
  const [imageUrl, setImageUrl] = useState<string | null| undefined>(null);
  const [picture, setPicture] = useState<string>('');



  const navigate = useNavigate(); 

  const collectionData = collection(db, 'Users'); 
  const status = useAppSelector(state => state.getStatus);
  const dispatch = useAppDispatch();
  


  //FOR MODAL ACCOUNT DELETION AND LOGOUT DIALOG
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            navigate('/login')
        }
    })
  }, [navigate])



  //store the account data in a state when reloading the page 

  //reference to the firebase storage
  const storageRef = ref(store, `Users/${auth.currentUser?.uid}/${imageFile}`);

useEffect(() => {
  const getData = async () => {
    const data = await getDocs(collectionData);
    
    const userdata = data.docs
     .map((doc) => doc.data() as documentType).filter(data => data.UserId === auth.currentUser?.uid);
     setUserData(userdata); //save all the user data info in local state

    
    const userQuery = query(collectionData, where('UserId', '==', auth.currentUser?.uid));
    const querySnapshot = await getDocs(userQuery);
  
    // Initialize an array to store the document references
    const documentReferences: DocumentReference[] = [];
  
  
    querySnapshot.forEach((doc) => {
      // Push the document reference, not the document data
      documentReferences.push(doc.ref);
    });
  
    // Set the document references in state
    setDocumentReference(documentReferences);

    //console.log('document reference', documentReferences);
    //console.log('userdata', userdata);

    if (userdata.length > 0) {
      userdata.forEach((data) => {
        dispatch(saveAccount(data)); //save all the user info in reducer state
      });

    }
   if(accountInfo) {
      //setting default user data in inputs 
     setUpdateAccount({
      firstname: accountInfo.value.FirstName,
      lastname: accountInfo.value.LastName, 
      email: accountInfo.value.Email,
      profileDisplay: accountInfo.value.ProfileDisplay
   })

   setConfirmPassword(accountInfo.value.Password);

   }  
  }
 
    getData(); 
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


//FOR UPDATING AND DISPLAYING STATUS 
function displayStatus<T>(status: T) {
  dispatch(updateStatus(status));
  setVisible(true);

  setTimeout(() => {
     dispatch(clearStatus());
     setVisible(false);
  }, 2000)
}

async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

 if(updateAccount.firstname === '' || updateAccount.lastname === '' || updateAccount.email === '') {
  console.log('Please complete all the details');
  displayStatus('Please complete all the details');
}

else if(updateAccount.password !== confirmPassword) {
  displayStatus('New Password does not match');
} 
 else {
  //execute the functions which actually to updates the data
   await updateData(); 
 }
}
function promptForCredentials() {
  const currentUser = auth.currentUser?.email;

try {
 
  if (currentUser && updateAccount.email !== accountInfo.value.Email) {
    // Prompt the user for their password and return an AuthCredential.
    const password = prompt('Enter your password');

    if(password) {
      return EmailAuthProvider.credential(currentUser, password);
    } else {
      // Handle the case where no password was provided.
      throw new Error('Password is required');
    }
  } else {
    // Handle the case where the user is not authenticated.
    throw new Error('User is not authenticated');
  }
}   
 catch (error: unknown) {
    const authError = error as AuthError
    switch (authError.code) {
      case 'auth/wrong-password':
        // Handle the wrong password error here
       displayStatus('Wrong password');
        break;
      // Add more cases for other error codes as needed
      default:
        // Handle other error cases or rethrow the error
        throw error;
    }
  }
}


async function updateData() {
  const authUser = auth.currentUser;

  try {
    if(imageFile) { //execute only this function when the image input has changed 
       uploadBytes(storageRef, imageFile!); // Assuming fileUpload is a Blob or File object
  
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
  
      //add the download url to account state to only update the image file when submitted
      dispatch(updateProfileDisplay(downloadURL));
      setPicture(downloadURL);
    }
    //update the email
    if(authUser && updateAccount.email !== accountInfo.value.Email) {
      const credential = promptForCredentials();

      reauthenticateWithCredential(authUser, credential as AuthCredential).then(() => {
        // User re-authenticated.
        console.log('Successfully Re-authenticated');
      }).catch((error: unknown) => {
        // An error ocurred
        // ...
        console.log(error);
      });

      if(updateAccount.email !== accountInfo.value.Email && updateAccount.email != '') {
        updateEmail(authUser, (updateAccount.email as string).toString().trim()).then(async () => {
              //only update the email on database if changes occur in updating the email auth
          for(const docRef of documentReference) {
            await updateDoc(docRef, {
              Email: updateAccount.email || null
            })
          }

          displayStatus('Email updated successfully');
        }).catch(error => {
          const authError = error as AuthError
          switch(authError.code) {
            case 'auth/email-already-in-use':
              displayStatus('Email already in use');
            break;
            case 'auth/email-already-exists':
              displayStatus('Email already exists');
            break;
            case 'auth/user-not-found':
              displayStatus('User not found');
            break;
            default: 
             return;
          }
        }) 
   }
  } 


  
  //update the password 
 if(confirmPassword !== null && confirmPassword !== undefined) {
    if(authUser) {
     updatePassword(authUser, confirmPassword).then(() => {
        displayStatus('Password updated successfully');
     })
     .catch(err => {
    console.log(err)
  })
 }
}

for (const docRef of documentReference) {
  // Use the document reference to update the document
  await updateDoc(docRef, {
    FirstName: updateAccount.firstname || null,
    LastName: updateAccount.lastname || null,
   // Email: updateAccount.email || null,
    ProfileDisplay: updateAccount.profileDisplay || picture
  });
}

  displayStatus('Successfully updated');
} 

  catch(err) {
    displayStatus('Error '+err);
   }
}  

  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;
      setUpdateAccount(prev => ({
        ...prev, 
        [name]: value
      }))
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]; 
      if (file) {
        const FileTypes = ["image/jpeg", "image/png", "image/jpg", "image/HEIF"];
        if(FileTypes.includes(file.type)) {
          const reader = new FileReader(); //filereader class to read the file uploaded and render to the image tag 

          reader.onload = (e) => {
              if(e.target) {
                  setImageUrl(e.target.result as string); 
              }
          }
          reader.readAsDataURL(file);
          setImageFile(file);
        }
        else {
          alert("Only JPG and PNG files are allowed for upload.");
          setImageUrl('');
          e.target.value = '';
        }
      }
  }


async function handleDelete() {
     //delete profile image
  const userId = auth.currentUser?.uid;
   try {  
       const path = `Users/${userId}/`;
       // Reference the user's folder
       const userFolderRef = ref(store, path);
       const listResult = await listAll(userFolderRef);

       // Delete each item (file) in the folder
       await Promise.all(listResult.items.map(async (item) => {
         await deleteObject(item);
         //console.log(`Deleted ${item.fullPath}`);
       }));

     // Check if the user is logged in
     if (userId) {
       // Delete documents in the Firestore collection associated with the user
       const userCollectionRef = collection(db, 'Users');
       const userQuery = query(userCollectionRef, where('UserId', '==', userId));
       const querySnapshot = await getDocs(userQuery);
 
       querySnapshot.forEach((docSnapshot) => {
         deleteDoc(doc(db, 'Users', docSnapshot.id));
         console.log(`Document with ID ${docSnapshot.id} deleted.`);
       });

     //DELETE AUTH
     const user = auth.currentUser;
     if(user) {
      deleteUser(user).then(() => {
        displayStatus("Successfilly deleted user");
      }).catch((err) => {
        displayStatus("Something went wrong "+err);
        console.error(err);
      })
     }
  }
}
  catch(err) {
    console.log(err);
  }

}
   function confirmDeletion() {
    dispatch(updateStatus('Deleting your account.....'));
    setVisible(true);

    setTimeout(() => {
       handleDelete();  //call the delete account function when user clicks the delete button 
       dispatch(clearStatus());
       setVisible(false);
    }, 1000)  //after 1 second execute this function
    setIsOpen(false); //close the modal
  }


 function handleLogout () {
  if(openLogoutDialog) {
    dispatch(updateStatus('Logged Out'));
    setVisible(true);

    setTimeout(() => {
        setVisible(false);
        dispatch(clearStatus());
        signOut(auth);
        navigate('/login');
    }, 2000)
  }
     setOpenLogoutDialog(false);
  }



return (
<div className='min-w-min bg-bg min-h-full m-0 p-0 box-border'>
  <div className='w-full h-max  relative'>
    <form onSubmit={formSubmit} className='font-kaisei w-full h-fit '>
        <ArrowLeft color='#EA9619' className='w-[26px] md:w-[30px] lg:w-[35px] h-auto object-cover mt-[30px] ml-[21px] cursor-pointer' onClick={() => navigate('/')}/>
         <h1 className='mt-[25px] ml-[21px] text-[20px] md:text-[25px] lg:text-[30px] font-bold'>Personal Information</h1>

      {userData.map((data: documentType) => (
         <div className='flex flex-col items-center gap-[50px]' key={data.UserId}>
         <div className='profile gap-[27px] flex flex-col items-center mt-[112px] '>
             <img src={imageUrl ? imageUrl : data.ProfileDisplay} alt="" className='cursor-pointer w-[116px] lg:w-[135px] h-auto rounded-full'/>
             <input type="file" className='p-2 border border-primary rounded-[10px] text-dark cursor-pointer' id="fileInput"  accept="image/*" placeholder='Upload New Display Photo' onChange={handleImageFileChange}/>
             <h1 className='text-[18px] md:text-[25px] lg:text-[30px] uppercase font-medium leading-[24px]'>Profile</h1>
         </div>

   
       <div className='flex flex-col gap-[30px]'>
         <TextField
            label="First Name"
            defaultValue={data.FirstName}
            color='success'
            className='md:w-[240px] lg:w-[260px]'
            name='firstname'
            onChange={handleChange}
           />

           <TextField
            label="Last Name"
            defaultValue={data.LastName}
            color='success'
            className='md:w-[240px] lg:w-[260px]'
            name='lastname'
            onChange={handleChange}
           />
           
           <TextField
            label="Email" 
            defaultValue={data.Email}
            color='success'
            name='email'
            className='md:w-[240px] lg:w-[260px]'
            onChange={handleChange}
           />

           <div className={`flex flex-col gap-2 ${changePass ? 'hidden' : 'block'}`}>
                 <h1 className='text-[#757063] text-[15px] leading-[16px] font-semibold'>Password</h1>
                 <p className='text-[#E08213] inline-block text-[17px] font-normal leading-[16px] underline cursor-pointer' onClick={() => setChangePass(true)}>Change Password</p>
           </div>

           <div className={`password ${changePass ? 'flex' : 'hidden'} relative pb-12 flex-col  gap-[22px]`}>
              <TextField
                 label="New Password"
                 defaultValue={data.Password}
                 color='success'
                 type='password'
                 className='md:w-[240px] lg:w-[260px]'
                 name='password'
                 onChange={handleChange}
               />
                <TextField
                 label="Confirm Password"
                 defaultValue={data.Password}
                 color='success'
                 type='password'
                 name='confirmPassword'
                 className='md:w-[240px] lg:w-[260px]'
                 onChange={(e) => setConfirmPassword(e.target.value)}
               />

               <span className='absolute left-0 mx-auto text-[17px] bottom-0 font-medium text-[#BD2323] cursor-pointer' onClick={() => setChangePass(false)}>Cancel</span>
           </div>     
      </div>
   
    
     

         <div className='my-[40px]'>
              <button className='text-stone-600 text-lg font-normal w-[189px] lg:w-[220px] mx-auto h-[42px] lg:h-[50px] rounded-[50px] hover:bg-primary hover:text-white transition-all duration-150 ease-in-out border border-yellow-900 leading-none' type='button' onClick={() => setIsOpen(true)  }>Delete Account</button>
        </div>
     </div>
      ))}  
      

       <div className='flex justify-between mx-8  pb-6'>
           <button className='w-[127px] h-[39px] pl-[9px] pr-2 pt-2 pb-[7px] bg-amber-500 rounded-[20px] justify-center items-center inline-flex text-white text-base font-medium leading-normal' type='submit'>Save Changes</button>
           <button className='w-[98px] h-[39px] pl-[22px] pr-[23px] pt-2 pb-[7px] bg-red-600 rounded-[20px] justify-center items-center inline-flex text-white text-base font-medium leading-normal' type='button' onClick={() => setOpenLogoutDialog(true)}><LogOut color='#0000' size={5}/>Logout</button>
       </div>
    </form>
   {visible && status && <h1 className={` transition-all duration-150 font-inter absolute  text-[14px] left-[20%] sm:left-[25%] md:left-[30%] lg:left-[40%] xl:left-[45%] bottom-3 bg-[#17140F] w-fit text-white py-2 rounded-[20px] px-3`}>{status.value}</h1>}

  {isOpen && <AccountDeletionModal 
      open={isOpen}
      onRequestClosed={() => setIsOpen(false)}
      confirmDeletion={confirmDeletion} 
   />}
   {openLogoutDialog && <LogoutModal 
      openDialog={openLogoutDialog}
      onRequestClosed={() => setOpenLogoutDialog(false)}
      confirmLogout={handleLogout}
   />}
  
  </div>
</div>
  ) 
} 
    
export default Profile


