// import React, { useEffect, useState } from 'react'
// import OutlineSection from '@/components/custom/OutlineSection'
// import { firbaseDb, LiveGenerativeModel } from '../../../../config/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import { useParams } from 'react-router-dom';
// import type { Outline } from '../outline';
// import modernSlider from "../../../assets/modern-gradient.jpg";
// import SliderFrameWork from '@/components/custom/SliderFrameWork';

// type DesignStyle = {
//     designGuide?: string;
//     colors?: Record<string, string>;
// };

// type Project = {
//     userPrompt: string;
//     projectId: string;
//     createdAt: string;
//     numberOfSlides: string;
//     outline?: Outline[];
//     slides?: any[];
//     designStyle?: DesignStyle;
// };


// const Editor = () => {
//     const { projectId } = useParams();
//     const [projectDetail, setProjectDetail] = useState<Project | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [slider, setSlider] = useState<any[]>([]);
//     // Fetch project details when projectId changes
//     useEffect(() => {
//         if (projectId) GetProjectDetails();
//     }, [projectId]);

//     // Auto-generate slides if none exist
//     useEffect(() => {
//         if (projectDetail && (!projectDetail.slides || projectDetail.slides.length === 0)) {
//             GenerateSlide();
//         }
//     }, [projectDetail]);

//     const GetProjectDetails = async () => {
//         try {
//             setLoading(true);
//             const docRef = doc(firbaseDb, 'projects', projectId ?? '');
//             const docSnap = await getDoc(docRef);

//             if (!docSnap.exists()) {
//                 console.warn("Project not found");
//                 return;
//             }

//             const data = docSnap.data() as Project;
//             setProjectDetail(data);
//         } catch (error) {
//             console.error("Error fetching project:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const GenerateSlide = async () => {
//         if (!projectDetail) return;

//         const prompt = SLIDER_PROMPT
//             .replace(/{DESIGN_STYLE}/g, projectDetail?.designStyle?.designGuide || 'Modern Dark')
//             .replace(/{COLORS_CODE}/g, JSON.stringify(projectDetail?.designStyle?.colors || {}))
//             .replace(/{METADATA}/g, JSON.stringify(projectDetail?.outline?.[0] || {}))
//             .replace(/{IMAGE_URL}/g, modernSlider);

//         console.log("Generated Prompt:", prompt);
//         const session = await LiveGenerativeModel.connect()
//         session.send(prompt);

//         // Collect text from model's turn
//         let text = "";
//         const messages = session.receive();
//         for await (const message of messages) {
//             switch (message.type) {
//                 case "serverContent":
//                     if (message.turnComplete) {
//                         console.log(text);
//                     } else {
//                         const parts = message.modelTurn?.parts;
//                         if (parts) {
//                             text += parts.map((part) => part.text).join("");
//                             console.log(text);
//                             const finalText = text.replace(/```html|```/g, '').trim();
//                             setSlider((prev: any) => {
//                                 // If prev is undefined or null, initialize it as an empty array
//                                 if (!prev) return [];

//                                 const updated = [...prev];

//                                 // If there's at least one element, update the first one
//                                 if (updated.length > 0) {
//                                     updated[0] = { ...updated[0], code: finalText };
//                                 } else {
//                                     // Otherwise, add a new first element
//                                     updated.push({ code: finalText });
//                                 }

//                                 return updated;
//                             });

//                         }
//                     }
//                     break;
//                 case "toolCall":
//                 // Ignore
//                 case "toolCallCancellation":
//                 // Ignore
//             }
//         }
//     };

//     return (
//         <div className='grid grid-cols-5'>
//             <div className="col-span-2 h-screen overflow-auto border-r border-gray-800">
//                 <OutlineSection
//                     loading={loading}
//                     Outline={(projectDetail?.outline || []) as Outline[]}
//                     handleUpdateOutline={() => console.log("Update Outline clicked")}
//                 />
//             </div>

//             <div className="col-span-3 h-screen overflow-auto p-4">
//         <h2 className="text-xl font-semibold mb-4">Slides Preview</h2>
//         {slider && slider.map((slide:any,index:number)=>(
//             <SliderFrameWork slide={slide} key={index} color={projectDetail?.designStyle?.colors}/>
//         ))}
//       </div>
//         </div>
//     );
// };

// export default Editor;

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import type { Outline } from '../outline';


// import { firbaseDb, LiveGenerativeModel } from "./../../../../config/FirebaseConfig";
// // import type { Project } from "../outline";
// // import * as htmlToImage from "html-to-image";
// // import PptxGenJS from "pptxgenjs";
// import { FileDown, InfoIcon, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import OutlineSection from "@/components/custom/OutlineSection";
// import SliderFrameWork from "@/components/custom/SliderFrameWork";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// type DesignStyle = {
//     designGuide?: string;
//     colors?: Record<string, string>;
// };

// type Project = {
//     userPrompt: string;
//     projectId: string;
//     createdAt: string;
//     numberOfSlides: string;
//     outline?: Outline[];
//     slides?: any[];
//     designStyle?: DesignStyle;
// };
// const SLIDER_PROMPT = `
// Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons)
// code for a 16:9 PPT slide in Modern Dark style. {DESIGN_STYLE}.
// Use a fixed 16:9 layout (no responsive). 
// Use Flowbite components, Tailwind gradients, and include colors from {COLORS_CODE}.
// MetaData for Slider: {METADATA}

// Ensure:
// - Images fit within containers, using 'object-cover' or 'object-contain'.
// - Maintain 16:9 aspect ratio.
// - Avoid overlays like: 
//   <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20"></div>

// Just provide body content for one slide.
// `;


// const Editor = () => {
//   const { projectId } = useParams();
//   const [projectDetail, setProjectDetail] = useState<Project>();
//   const [loading, setLoading] = useState(false);
//   const [sliders, setSliders] = useState<any[]>([]);
//   const [isSlidesGenerated, setIsSlidesGenerated] = useState(false);
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);
  

//   // ✅ Fetch Project
//   useEffect(() => {
//     if (projectId) GetProjectDetail();
//   }, [projectId]);

//   const GetProjectDetail = async () => {
//     try {
//       setLoading(true);
//       const docRef = doc(firbaseDb, "projects", projectId ?? "");
//       const docSnap = await getDoc(docRef);
//     //   if (!docSnap.exists()) return;

//       const data = docSnap.data() as Project;
//       console.log("📄 Project:", data);
//       setProjectDetail(data);
//     } catch (err) {
//       console.error("❌ Error fetching project:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Auto-generate slides
//   useEffect(() => {
//     if (!projectDetail) return;
//     if (!projectDetail.slides || projectDetail.slides.length === 0) {
//       GenerateSlides();
//     } else {
//       setSliders(projectDetail.slides);
//     }
//   }, [projectDetail]);

//   // ✅ Slide Generation
//   const GenerateSlides = async () => {
//     if (!projectDetail?.outline?.length) return;
//     console.log("🚀 Generating slides...");

//     for (let i = 0; i < projectDetail.outline.length && i < 4; i++) {
//       const metaData = projectDetail.outline[i];
//       const prompt = SLIDER_PROMPT
//         .replace("{DESIGN_STYLE}", projectDetail?.designStyle?.designGuide ?? "")
//         .replace("{COLORS_CODE}", JSON.stringify(projectDetail?.designStyle?.colors ?? {}))
//         .replace("{METADATA}", JSON.stringify(metaData));

        
//       await GeminiSlideCall(prompt, i);
//     }

//     console.log("✅ All slides generated!");
//     // setIsSlidesGenerated(true);
//   };

//   // ✅ Call AI model
//   const GeminiSlideCall = async (prompt: string, index: number) => {
//     try {
//       const session = await LiveGenerativeModel.connect();
//       await session.send(prompt);

//       let text = "";
//       for await (const message of session.receive()) {
//         if (message.type === "serverContent") {
//           const parts = message.modelTurn?.parts;
//           if (parts?.length) {
//             text += parts.map((p) => p.text).join("");
//             const finalText = text.replace(/```html|```/g, "").trim();

//             setSliders((prev) => {
//               const updated = [...(prev ?? [])];
//               updated[index] = { code: finalText };
//               return updated;
//             });
//           }

//           if (message.turnComplete) break;
//         }
//       }
//       session.close();
//     } catch (err) {
//       console.error(`❌ Error generating slide ${index + 1}:`, err);
//     }
//   };

//   // ✅ Save slides to Firebase
//   useEffect(() => {
//     if (isSlidesGenerated) SaveAllSlides();
//   }, [isSlidesGenerated]);

//   const SaveAllSlides = async () => {
//     if (!projectId) return;
//     await setDoc(
//       doc(firbaseDb, "projects", projectId),
//       { slides: sliders },
//       { merge: true }
//     );
//   };

//   // ✅ Update single slide code
//   const updateSliderCode = (updatedCode: string, index: number) => {
//     setSliders((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], code: updatedCode };
//       return updated;
//     });
//     setIsSlidesGenerated(true);
//   };
//   return(
//             <div className='grid grid-cols-5'>
//             <div className="col-span-2 h-screen overflow-auto border-r border-gray-800">
//                 <OutlineSection
//                     loading={loading}
//                     Outline={(projectDetail?.outline || []) as Outline[]}
//                     handleUpdateOutline={() => console.log("Update Outline clicked")}
//                 />
//             </div>

//             <div className="col-span-3 h-screen overflow-auto p-4">
//         <h2 className="text-xl font-semibold mb-4">Slides Preview</h2>
//         {sliders && sliders.map((slide:any,index:number)=>(
//             <SliderFrameWork slide={slide} key={index} color={projectDetail?.designStyle?.colors}/>
//         ))}
//       </div>
//         </div>
//   )
// };

// export default Editor;
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Outline } from "../outline";

import { firbaseDb, LiveGenerativeModel } from "../../../../config/FirebaseConfig";
import OutlineSection from "@/components/custom/OutlineSection";
import SliderFrameWork from "@/components/custom/SliderFrameWork";
import modernSlider from "../../../assets/modern-gradient.jpg";
type DesignStyle = {
  designGuide?: string;
  colors?: Record<string, string>;
};

type Project = {
  userPrompt: string;
  projectId: string;
  createdAt: string;
  numberOfSlides: string;
  outline?: Outline[];
  slides?: any[];
  designStyle?: DesignStyle;
};

// const SLIDER_PROMPT = `
// Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons)
// for a single 16:9 PPT slide in {DESIGN_STYLE}.
// Use Tailwind gradients and Flowbite components.
// Use these colors: {COLORS_CODE}.
// MetaData for this slide: {METADATA}

// Make sure the layout fits within 16:9, not full page.
// Return only one slide body content (<div>...</div>).
// `;
const SLIDER_PROMPT = `
Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons)
for a single 16:9 PPT slide in {DESIGN_STYLE}.
Use Tailwind gradients and Flowbite components.
Use these colors: {COLORS_CODE}.
MetaData for this slide: {METADATA}

Make sure:
- Background images or <img> use "object-cover" and fill the area properly.
- Return only one <div>...</div> block for the slide body.
`;

const Editor = () => {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState<any[]>([]);
  const [isSlidesGenerated, setIsSlidesGenerated] = useState(false);

  // ✅ Fetch Project
  useEffect(() => {
    if (projectId) GetProjectDetail();
  }, [projectId]);

  const GetProjectDetail = async () => {
    try {
      setLoading(true);
      const docRef = doc(firbaseDb, "projects", projectId ?? "");
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;

      const data = docSnap.data() as Project;
      console.log("📄 Project:", data);
      setProjectDetail(data);
    } catch (err) {
      console.error("❌ Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-generate slides if empty
  useEffect(() => {
    if (!projectDetail) return;
    if (!projectDetail.slides || projectDetail.slides.length === 0) {
      GenerateSlides();
    } else {
      setSliders(projectDetail.slides);
    }
  }, [projectDetail]);

  // ✅ Generate slides one-by-one
  const GenerateSlides = async () => {
    if (!projectDetail?.outline?.length) return;
    console.log("🚀 Generating slides...");

    const generatedSlides: any[] = [];

    for (let i = 0; i < projectDetail.outline.length && i < 4; i++) {
      const metaData = projectDetail.outline[i];
    //   const imageUrl = metaData?.bannerImage || modernSlider;
      const prompt = SLIDER_PROMPT
        .replace("{DESIGN_STYLE}", projectDetail?.designStyle?.designGuide ?? "Modern Dark")
        .replace("{COLORS_CODE}", JSON.stringify(projectDetail?.designStyle?.colors ?? {}))
        .replace("{METADATA}", JSON.stringify(metaData))
        // .replace("{IMAGE_URL}", imageUrl);;
      const htmlCode = await GeminiSlideCall(prompt, i);
      if (htmlCode) generatedSlides.push({ code: htmlCode });
    }

    setSliders(generatedSlides);
    setIsSlidesGenerated(true);
  };

  // ✅ Generate one slide
  const GeminiSlideCall = async (prompt: string, index: number) => {
    try {
      const session = await LiveGenerativeModel.connect();
      await session.send(prompt);

      let text = "";
      for await (const message of session.receive()) {
        if (message.type === "serverContent") {
          const parts = message.modelTurn?.parts;
          if (parts?.length) {
            text += parts.map((p) => p.text).join("");
          }
          if (message.turnComplete) break;
        }
      }
      session.close();
      const finalText = text.replace(/```html|```/g, "").trim();
      return finalText;
    } catch (err) {
      console.error(`❌ Error generating slide ${index + 1}:`, err);
      return null;
    }
  };

  // ✅ Save slides
  useEffect(() => {
    if (isSlidesGenerated && projectId) {
      setDoc(
        doc(firbaseDb, "projects", projectId),
        { slides: sliders },
        { merge: true }
      );
    }
  }, [isSlidesGenerated]);
  
//   // ✅ Save slides to Firebase
  useEffect(() => {
    if (isSlidesGenerated) SaveAllSlides();
  }, [isSlidesGenerated]);
  const SaveAllSlides = async () => {
    if (!projectId) return;
    await setDoc(
      doc(firbaseDb, "projects", projectId),
      { slides: sliders },
      { merge: true }
    );
  };
  // ✅ Update one slide code
  const updateSliderCode = (updatedCode: string, index: number) => {
    setSliders((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], code: updatedCode };
      return updated;
    });
    setIsSlidesGenerated(Date.now());
  };

  return (
    <div className="grid grid-cols-5">
      {/* Outline Section */}
      <div className="col-span-2 h-screen overflow-auto border-r border-gray-800">
        <OutlineSection
          loading={loading}
          Outline={(projectDetail?.outline || []) as Outline[]}
          handleUpdateOutline={() => console.log("Update Outline clicked")}
        />
      </div>

      {/* Slides Preview */}
      <div className="col-span-3 h-screen overflow-auto p-4 space-y-8">
        <h2 className="text-xl font-semibold mb-4">Slides Preview</h2>
        {sliders.length > 0 ? (
          sliders.map((slide, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-lg p-2 bg-white">
              <SliderFrameWork
                slide={slide}
                colors={projectDetail?.designStyle?.colors ?? {}}
                setUpdateSlider={(newCode:string) => updateSliderCode(newCode, index)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">Generating slides...</p>
        )}
      </div>
    </div>
  );
};

export default Editor;
