import React, { useContext } from 'react'
import logo from '@/assets/logo.png'
import { Button } from '../ui/button';
import { useUser ,SignInButton,UserButton} from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { Diamond, Gem } from 'lucide-react';
import { userDetailsContext } from '../../../context/userDetailsContext';
const Header = () => {
    const { user}=useUser();
    const { userDetails, setUserDetails } = useContext(userDetailsContext);
    const location = useLocation();

  return (
    <div className='flex justify-between items-center px-10 shadow '>
        <img src={logo} alt="Logo" width={130} height={130}/>
       {!user ? <SignInButton mode="modal"><Button>Sign In</Button></SignInButton> :
       <div className='flex gap-5 items-center'>
         <UserButton/>
         {location.pathname.includes("workspace")?
        <div className='flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-2xl'>
            <Gem/>{userDetails?.credits??0}
        </div> :
        <Link to="/workspace">
         <Button>Go to workspace</Button>
         </Link>
        }
         
       </div>
       }
    </div>
  )
}

export default Header