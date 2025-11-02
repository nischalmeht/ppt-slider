import React from 'react'
import { Skeleton } from '../ui/skeleton'
import type { Outline } from '@/workspace/project/outline'
import { Edit, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import EditOutlineDialog from './EditOutlineDialog'

type Props = {
    loading: boolean,
    Outline: Outline[],
    handleUpdateOutline:any
}
const OutlineSection = ({ loading, Outline,handleUpdateOutline }: Props) => {
  
    return (
        <div className="mt-7">
            <div className="font-medium text-xl">Sliders Outline</div>
            {loading &&
                <div>
                    {[1, 2, 3, 4].map((item, index) => (
                        <Skeleton key={index} className='h-[60px] w-full rounded-2xl mb-4' />
                    ))}
                </div>
            }
            <div>
                {Outline && Outline.map((item, index) => (
                    <div key={index}
                     className='bg-white gap-6 border mt-5 p-3 
                     flex rounded-xl text-left items-center'>
                        {/* <div> */}
                            <h2 className='font-bold p-4 bg-gray-100 text-2xl'>{index +1}</h2>
                        {/* </div> */}
                        <div>

                        <h2 className="font-bold">{item.slidePoint}</h2>
                        <p >{item.outline}</p>
                        </div>              
                        <EditOutlineDialog outlineData={item}>
                            
                    <Button variant={'ghost'} size={'icon-sm'} onClick={() => handleUpdateOutline(item)}><Edit/></Button>
                            </EditOutlineDialog>          
                    </div>

                ))}
            </div>
         
        </div>
    )
}

export default OutlineSection