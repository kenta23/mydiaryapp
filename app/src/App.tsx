import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { useAppDispatch } from "./States/hook"
import Diary from "./Contents/Diary";
import { collection, getDocs} from "firebase/firestore";
import { auth, db } from "./Firebase/firebase";
import { saveAccount } from "./States/SaveAccountLogin";

function App() {
  const dispatch = useAppDispatch();
  const collectionData = collection(db, 'Users');
  
  //find exact user's data from firebase database 
  useEffect(() => {
    const getData = async () => {
     const data = await getDocs(collectionData);
     
     const userdata = data.docs
     .map((doc) => doc.data()).filter(data => data.UserId === auth.currentUser?.uid);

     if (userdata.length > 0) {
      userdata.forEach((data) => {
        dispatch(saveAccount(data)); //save all the user info
      });
    }
  
   //store the value of reducer to the state
 } 
   getData(); 
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
 
return (
   <div className="w-full relative min-h-full h-screen overflow-hidden bg-[#F4F0E9]">
        <div className="">
          <Navbar />
        </div>

       
      {/* RENDER FOLLOWS*/ }
      <div className="w-full flex  h-screen  items-center justify-center">
         <Diary />
      </div>
    </div>
  )
}

export default App
