import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Workspace from './workspace/index.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { userDetailsContext } from '../context/userDetailsContext'
import Outline from './workspace/project/outline/index.tsx'
import Editor from './workspace/project/editor/index.tsx'
const router = createBrowserRouter([
  {path:"/",element:<App/>},
  {path:"/workspace",element:<Workspace/>,
    children:[
      {path:'project/:projectId/outline',element:<Outline/>},
           {path:'project/:projectId/editor',element:<Editor/>}
    ] 
  },
])
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
function Root() {
  const [userDetails,setUserDetails]=useState<any>(null);
  return (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <userDetailsContext.Provider value={{userDetails,setUserDetails}}>
    <RouterProvider  router={router}/>
    </userDetailsContext.Provider>
     </ClerkProvider>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Root/>
  </StrictMode>,
)
