import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { Project } from '@/workspace/project/outline'
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore'
import { firbaseDb } from '../../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-react'
import PPT_ICON from "../../assets/ppt.png"
import moment from 'moment';
import { Link } from 'react-router-dom'
const MyProjects = () => {
  const [projects, setProjects] = useState<Project[] | null>([]);
  const { user } = useUser();

  useEffect(() => {
    user && getProject()
  }, [user])
  const formatDate = (timestamp: any) => {
    const formateData = moment(timestamp).fromNow();
    return formateData

  }
  const getProject = async () => {
    const q = query(collection(firbaseDb, "projects"), where("createdBy", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setProjects((prev: any) => [...prev, doc.data()])
    });
  }
  return (
    <div className="mx-32 mt-12">
      <div className='flex justify-between items-center'>
        <h2 className="font-bold text-2xl">My Projects</h2>
        <Button>+ Create new Project</Button>
      </div>
      <div>
        {!projects?.length
          ?
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconFolderCode />
              </EmptyMedia>
              <EmptyTitle>No Projects Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any projects yet. Get started by creating
                your first project.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button>Create Project</Button>
              </div>
            </EmptyContent>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground"
              size="sm"
            >
              <a href="#">
                Learn More <ArrowUpRightIcon />
              </a>
            </Button>
          </Empty>
          :
          <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 space-y-2'>
            {projects.map((projects, index) => (
              <Link to={'/workspace/project/' + projects.projectId + "/editor"}>
               <div key={index} className="p-4 rounded-2xl shadow mt-3 border">
                <img src={PPT_ICON} height={50} width={50} alt="ppt icon" />

                <h2 className="font-bold text-lg">
                  {projects?.userPrompt}
                </h2>

                <h2 className="text-red-600">
                  {projects?.slides?.length || 0} Slides
                </h2>

                <h2 className="text-gray-500">
                  {formatDate(projects?.createdAt?.toDate())}
                </h2>
              </div>
              </Link>
             

            ))}
          </div>
        }
      </div>


    </div>
  )
}

export default MyProjects