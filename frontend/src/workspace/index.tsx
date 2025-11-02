import { useUser } from '@clerk/clerk-react'
import React, { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import {firbaseDb} from "../../config/FirebaseConfig";
import { userDetailsContext } from '../../context/userDetailsContext';
import Header from '@/components/custom/Header';
import PromptBox from '@/components/custom/PromptBox';
import MyProjects from '@/components/custom/MyProjects';
const Workspace = () => {
    const {user} = useUser();
    const { userDetails, setUserDetails } = useContext(userDetailsContext);
    const location = useLocation()
    
    useEffect(()=>{
        user && CreateNewUser();
    },[user])
   
    const CreateNewUser = async () => {
        if(user){
            const docRef = doc(firbaseDb,"users",user?.primaryEmailAddress?.emailAddress??"")
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                console.log("Document data:", docSnap.data());
                setUserDetails(docSnap.data());
            }else{
                const data = {
                    fullName: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                    credits: 3,
                    createdAt: new Date()
                }
                await setDoc(doc(firbaseDb,"users",user?.primaryEmailAddress?.emailAddress??""),{
                   ...data
                })
                setUserDetails(data);
            }
        }
    }
  return (
    <div>
        <Header/>
        {location.pathname==='/workspace'&& <PromptBox/>}
        {location.pathname==='/workspace'&& <MyProjects/>}
        {/* <MyProjects/> */}
        <Outlet/>
    </div>
  )
}

export default Workspace