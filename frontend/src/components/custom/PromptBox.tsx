import React, { useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea, } from "@/components/ui/input-group"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowUp, Loader2Icon } from 'lucide-react'

import { doc, setDoc } from 'firebase/firestore'
import { firbaseDb } from '../../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-react'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'
const PromptBox = () => {
    const [userInput, setUserInput] = useState<string>();
    const { user } = useUser()
    const [loading, setLoading] = useState<boolean>(false);
    const [noOfSlider,setNoOfSlider]=useState<string>("4 to 6");
    const navigate=useNavigate();
    const createProject = async () => {
        setLoading(true)
        const projectId = uuidv4()
        await setDoc(doc(firbaseDb, "projects", projectId), {
            projectId: projectId,
            userPrompt: userInput,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date()
        })
        setLoading(false);
        navigate("/workspace/project/" + projectId + "/outline" )
    }
    return (
        <div className='w-full flex justify-center items-center mt-28'>
            <div className='flex flex-col items-center  justify-center '>
                <h2 className='font-bold text-3xl'>Describe your topic, we'll design the slides</h2>
                <p className='text-xl text-gray-500'> your design will be saved as new design</p>
                <InputGroup>
                    <InputGroupTextarea placeholder='Enter what kind of ' className='min-h-36' onChange={(e) => setUserInput(e.target.value)} />
                    <InputGroupAddon align={"block-end"}>
                        {/* <InputGroupButton>
      <PlusIcon/>
      </InputGroupButton> */}
                        <Select onValueChange={(value)=>setNoOfSlider(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select No of Slider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>No. of Slider</SelectLabel>
                                    <SelectItem value="4 to 6">4-6 Slider</SelectItem>
                                    <SelectItem value="6 to 8">6-8</SelectItem>
                                    <SelectItem value="8 to 10">8-10</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputGroupButton
                            disabled={!userInput}
                            variant={'default'} className='rounded-full ml-auto' size={'icon-sm'} onClick={createProject}>
                            {loading ? <Loader2Icon /> : <ArrowUp />}
                            {/* <ArrowUp/> */}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>


            </div>
        </div>
    )
}

export default PromptBox