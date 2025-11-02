import React from 'react'
import { Button } from '../ui/button';
import { HeroVideoDialog } from '../ui/hero-video-dialog';
import { Play } from 'lucide-react';
import { useUser ,SignInButton} from '@clerk/clerk-react';
const Hero = () => {
    const { user}=useUser();

  return (
    <div className='flex flex-col justify-center mt-20 space-y-4 items-center '>
        <h2 className="font-bold text-5xl">From Idea to <span className='text-primary'>Presentation</span> in One Click </h2>
        <p className='text-xl text-gray-500 max-w-2xl'   >Generate Stock,editable PPTs powered by AI</p>        
        <div className='flex gap-5 mt-10'>
            <Button variant={'outline'} size={'lg'}>Watch Video  <Play/></Button>
            {!user ?<SignInButton mode="modal"/>:<Button size={'lg'}>Get to Workspace</Button>}
            
        </div>
        <div className="relative max-w-3xl mt-14">
            <h2 className='text-center my-4'>Watch How to Create Ai PPT</h2>
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
    </div>
  )
}

export default Hero