// import SliderStyle from '@/components/custom/SliderStyle';
// import { firbaseDb, model } from '../../../../config/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom';
// import OutlineSection from '@/components/custom/OutlineSection';

// type Project = {
//     userPrompt: string,
//     projectId: string,
//     createdAt: string,
//     numberOfSlides:string,
//     outline:any
// }
// type Outline={
//     slideNo:string,
//     slidePoint:string,
//     outline:string
// }
// const Outline = () => {
//     const { projectId } = useParams();
//     const [projectDetail, setProjectDetail] = useState<Project | null>();
//     const [loading, setLoading] = useState<boolean>(false);

//     const OUTLINE_PROMPT = `
// Generate a PowerPoint slide outline for the topic "{userInput}" in the context of the AI Age.
// Create a total of {noOfSlides} slides.

// Structure requirements:
// 1. The first slide should be a Welcome screen.
// 2. The second slide should be an Agenda screen.
// 3. The final slide should be a Thank You screen.
// 4. The remaining slides should cover key points, insights, or examples relevant to the topic.

// Return the response only in JSON format, following this exact schema:
// [
//   {
//     "slideNo": "",
//     "slidePoint": "",
//     "outline": ""
//   }
// ]
// Ensure all fields are strings and that the JSON is valid and properly formatted.
// `


//     useEffect(() => {
//         projectId && GetProjectDetails();
//     }, [projectId]);

// //   useEffect(() => {
// //         if (projectDetail?.userInputPrompt) {
// //             GetProjectDetails();
// //         }
// //     }, [projectDetail]);
//     const GetProjectDetails = async () => {
//         const docRef = doc(firbaseDb, "projects", projectId ?? "");
//         const docSnap = await getDoc(docRef);
//         if (!docSnap.exists()) return;
//         setProjectDetail(docSnap.data() as Project)
//         // if(!docSnap.data().outline){

//             generateSliderOutline(docSnap.data() as Project);
//         // }
//     }
//     const generateSliderOutline = async (projectData:Project) => {
//         if (!projectData?.userPrompt) return;
//         setLoading(true)

//         const prompt = OUTLINE_PROMPT.replace('${userInput}', projectData.userPrompt)
//         .replace('{noOfSlides}', projectData?.numberOfSlides?.toString() ?? "5");

//         try {
//             const result = await model.generateContent(prompt);
//             const response = result.response;
//             const outlineText = response.text();
//             console.log('Raw outline response:', outlineText);
//             // Parse the JSON response
//             try {
//                 const outlineData = JSON.parse(outlineText);
//                 console.log('Outline generated:', outlineData);
//                 // TODO: Store or process the outline data
//                 return outlineData;
//             } catch (e) {
//                 console.error('Failed to parse outline JSON:', e);
//                 return null;
//             }
//         } catch (e) {
//             console.error('Failed to generate outline:', e);
//             return null;
//         }
//     }
//     return (
//         <div className='flex justify-center mt-20'>
//             <div className="max-w-3xl">
//                 <h2 className="font-bold text-2xl">Setting and Slider Outline</h2>
//                 <SliderStyle />
//                 <OutlineSection loading={loading}/>
//             </div>
//         </div>
//     )
// }

// export default Outline

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firbaseDb, model } from '../../../../config/FirebaseConfig';
import SliderStyle, { type DesignStyle } from '@/components/custom/SliderStyle';
import OutlineSection from '@/components/custom/OutlineSection';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export type Outline = {
  slideNo: string;
  slidePoint: string;
  outline: string;
  bannerImage:string
  slides:any
};

export type Project = {
  userPrompt: string;
  projectId: string;
  createdAt: string;
  numberOfSlides: string;
  outline?: Outline;
};

const Outline = () => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [outline, setOutline] = useState<Outline[]>();
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>()
  const handleUpdateOutline = (index: string, value: Outline) => {
    setOutline((prev) => prev?.map((item) => item.slideNo == index ? { ...item, ...value } : item))
  }
  const OUTLINE_PROMPT = `
Generate a PowerPoint slide outline for the topic "{userInput}".  
Create a total of {noOfSlides} slides.

Structure requirements:
1. The first slide should be a Welcome screen introducing the topic.
2. The final slide should be a Thank You screen.
3. The remaining slides should cover key points, insights, or examples relevant to the topic.

Return the response only in JSON format, following this exact schema:
[
  {
    "slideNo": "",
    "slidePoint": "",
    "outline": ""
  }
]
Ensure all fields are strings and that the JSON is valid and properly formatted.

  `

  useEffect(() => {
    if (projectId) GetProjectDetails();
  }, [projectId]);

  const GetProjectDetails = async () => {
    const docRef = doc(firbaseDb, 'projects', projectId ?? '');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data() as Project;
    setProjectDetail(data);

    // if (!data.outline) {
    generateSliderOutline(data);
    // } 
    //     else {
    // //  setOutlineData(data.outline);
    //     }
  };
  const onGenerateSlider = async () => {
    setLoading(true)
    if (!projectId) return;
    const docRef = doc(firbaseDb, 'projects', projectId ?? '');
    const dataToUpdate: any = {
      outline: outline ?? [],
    };
    if (selectedStyle) dataToUpdate.designStyle = selectedStyle;

    await updateDoc(docRef, dataToUpdate);
    setLoading(false)
  }

  const generateSliderOutline = async (projectData: Project) => {
    if (!projectData?.userPrompt) return;
    setLoading(true);

    const prompt = OUTLINE_PROMPT
      .replace('{userInput}', projectData.userPrompt)
      .replace('{noOfSlides}', projectData.numberOfSlides?.toString() ?? '5');

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const outlineText = response.text();
      const rawJson = outlineText.replace(/```json|```/g, '')  // removes all ```json and ``` from anywhere.trim(); 
      let outlineJSON = JSON.parse(rawJson);
      setOutline(outlineJSON);
      console.log('Parsed outline:', outlineJSON);

      //   setOutlineData(outlineJSON);

      // Store in Firestore
      const docRef = doc(firbaseDb, 'projects', projectData.projectId);
      await updateDoc(docRef, { outline: outlineJSON });

    } catch (err) {
      console.error('Error generating outline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      <div className='max-w-3xl w-full'>
        <h2 className='font-bold text-2xl mb-6'>Settings and Slide Outline</h2>
        <SliderStyle selectStyle={(value: any) => setSelectedStyle(value)} />
        <OutlineSection loading={loading} Outline={outline ?? []} handleUpdateOutline={(index: string, value: Outline) => handleUpdateOutline(index, value)} />
      </div>
      <Button onClick={onGenerateSlider} size={'lg'} className='fixed bottom-6 transform left-1/2  -translate-x-1/2'>
        Generate Sliders <Sparkles />
      </Button>
    </div>
  );
};

export default Outline;
