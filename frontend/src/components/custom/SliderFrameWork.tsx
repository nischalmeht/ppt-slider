// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import FloatingAction from "./FloatingAction";
// import { LiveGenerativeModel, model } from "../../../config/FirebaseConfig";

// const HTML_DEFAULT = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template" />
// <title>AI Website Builder</title>

// <!-- Tailwind CSS -->
// <script src="https://cdn.tailwindcss.com"></script>

// <!-- Custom Tailwind Config for Colors -->
// <script>
// tailwind.config = {
//   theme: {
//     extend: {
//       colors: {colorCodes},
//       backgroundImage: {
//         gradient: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
//       },
//     },
//   },
// };
// </script>

// <!-- Flowbite -->
// <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
// <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

// <!-- Font Awesome -->
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

// <!-- Chart.js -->
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// <!-- AOS -->
// <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet" />
// <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

// <!-- GSAP -->
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

// <!-- Lottie -->
// <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

// <!-- Swiper.js -->
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
// <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

// <!-- Tippy.js -->
// <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
// <script src="https://unpkg.com/@popperjs/core@2"></script>
// <script src="https://unpkg.com/tippy.js@6"></script>
// </head>

// <body>
// {code}
// </body>
// </html>
// `;

// type Props = {
//   slide: { code: string };
//   colors: Record<string, string>;
//   setUpdateSlider?: any;
//   handleAiChange: any
// };

// const SliderFrameWork = ({ slide, colors, setUpdateSlider, handleAiChange }: Props) => {
//   const { projectId } = useParams();
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const selectedElRef = useRef<HTMLElement | null>(null);

//   const FINAL_CODE = HTML_DEFAULT
//     .replace("{colorCodes}", JSON.stringify(colors))
//     .replace("{code}", slide?.code ?? "");

//   const [loading, setLoading] = useState(false);
//   const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null);
//   const [actionVisible, setActionVisible] = useState(false);
//   const [showPanel, setShowPanel] = useState(false);
//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (!iframe) return;

//     const doc = iframe.contentDocument;
//     if (!doc) return;

//     doc.open();
//     doc.write(FINAL_CODE);
//     doc.close();

//     let hoverEl: HTMLElement | null = null;
//     let selectedEl: HTMLElement | null = null;

//     const handleMouseOver = (e: MouseEvent) => {
//       if (selectedEl) return;
//       const target = e.target as HTMLElement;
//       if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
//       hoverEl = target;
//       hoverEl.style.outline = "2px dotted blue";
//     };

//     const handleMouseOut = () => {
//       if (selectedEl) return;
//       if (hoverEl) {
//         hoverEl.style.outline = "";
//         hoverEl = null;
//       }
//     };

//     const handleClick = (e: MouseEvent) => {
//       e.stopPropagation();
//       const target = e.target as HTMLElement;

//       if (selectedEl && selectedEl !== target) {
//         selectedEl.style.outline = "";
//         selectedEl.removeAttribute("contenteditable");
//       }

//       selectedEl = target;
//       selectedElRef.current = target;

//       selectedEl.style.outline = "2px solid blue";
//       selectedEl.setAttribute("contenteditable", "true");
//       selectedEl.focus();

//       const rect = target.getBoundingClientRect();
//       const iframeRect = iframe.getBoundingClientRect();

//       setCardPosition({
//         x: iframeRect.left + rect.left + rect.width / 2,
//         y: iframeRect.top + rect.bottom + window.scrollY,
//       });
//       setShowPanel(true)
//       setActionVisible(true);
//     };

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && selectedEl) {
//         selectedEl.style.outline = "";
//         selectedEl.removeAttribute("contenteditable");
//         selectedEl = null;
//       }
//     };

//     const handleBlur = () => {
//       if (selectedEl && setUpdateSlider) {
//         const updatedCode = iframe.contentDocument?.body?.innerHTML ?? "";
//         setUpdateSlider(updatedCode);
//       }
//     };

//     doc.addEventListener("mouseover", handleMouseOver);
//     doc.addEventListener("mouseout", handleMouseOut);
//     doc.addEventListener("click", handleClick);
//     doc.addEventListener("keydown", handleKeyDown);
//     doc.addEventListener("blur", handleBlur, true);

//     return () => {
//       doc.removeEventListener("mouseover", handleMouseOver);
//       doc.removeEventListener("mouseout", handleMouseOut);
//       doc.removeEventListener("click", handleClick);
//       doc.removeEventListener("keydown", handleKeyDown);
//       doc.removeEventListener("blur", handleBlur, true);
//     };
//   }, [FINAL_CODE, setUpdateSlider]);

//   const handleAiSectionChange = async (userAiPrompt: string) => {
//     setLoading(true);
//     const selectedEl = selectedElRef.current;
//     const iframe = iframeRef.current;
//     if (!selectedEl || !iframe) return;

//     const oldHTML = selectedEl.outerHTML;

//     const prompt = `
// Regenerate or rewrite the following HTML code based on user instruction.
// If user asked to change or regenerate the image, use ImageKit:
// 'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
// Use '?tr=fo-auto,<transformations>' for background removal, cropping, or optimization.
// User Instruction: "${userAiPrompt}"
// HTML Code:
// ${oldHTML}
// `;
//     try {
//       // const result = await model.generateContent(prompt);
//       const result = await model.generateContent(prompt);
//       const newHTML = (await result.response.text()).trim();
//       console.log("newHTML===================?",newHTML)
//       // const newHTML = await result.text();z

//       const tempDiv = iframe.contentDocument?.createElement("div");
//       if (tempDiv) {
//         tempDiv.innerHTML = newHTML;
//         const newNode = tempDiv.firstElementChild;
//         if (newNode && selectedEl.parentNode) {
//           selectedEl.parentNode.replaceChild(newNode, selectedEl);
//           selectedElRef.current = newNode as HTMLElement;
//           const updateSliderCode = iframe.contentDocument?.body?.innerHTML || newHTML;
//           console.log("updateSliderCode", updateSliderCode)
//           setUpdateSlider(updateSliderCode)
//           console.log("Element replaced succesfully")
//         }

//       }
//     } catch (error) {
//       console.log("AI generation Failed", error)

//     }
//     setLoading(false);
//   };
//   return (
//     <div className="w-full h-full relative">
//       <iframe
//         ref={iframeRef}
//         className="aspect-[16/9] w-full max-w-4xl border-0 rounded-lg shadow-lg relative z-0"
//         sandbox="allow-scripts allow-same-origin"
//       />
//       <FloatingAction
//         show={showPanel}
//         position={cardPosition}
//         loading={loading}
//         handleAiChange={(value: string) => handleAiSectionChange(value)}
//         onClose={() => setShowPanel(false)}
//       />
//     </div>
//   );
// };

// export default SliderFrameWork;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FloatingAction from "./FloatingAction";
import { model } from "../../../config/FirebaseConfig";

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI Website Builder</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: { colors: {colorCodes} },
  },
};
</script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
</head>
<body>
{code}
</body>
</html>`;

type Props = {
  slide: { code: string };
  colors: Record<string, string>;
  setUpdateSlider: any;
};

const SliderFrameWork = ({ slide, colors, setUpdateSlider }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const selectedElRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const FINAL_CODE = HTML_DEFAULT
    .replace("{colorCodes}", JSON.stringify(colors))
    .replace("{code}", slide?.code ?? "");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(FINAL_CODE);
    doc.close();

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted #007bff";
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      if (hoverEl) hoverEl.style.outline = "";
      hoverEl = null;
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      selectedElRef.current = target;
      selectedEl.style.outline = "2px solid #007bff";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();

      const rect = target.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();

      setCardPosition({
        x: iframeRect.left + rect.left + rect.width / 2,
        y: iframeRect.top + rect.bottom + window.scrollY,
      });
      setShowPanel(true);
    };

    doc.addEventListener("mouseover", handleMouseOver);
    doc.addEventListener("mouseout", handleMouseOut);
    doc.addEventListener("click", handleClick);

    return () => {
      doc.removeEventListener("mouseover", handleMouseOver);
      doc.removeEventListener("mouseout", handleMouseOut);
      doc.removeEventListener("click", handleClick);
    };
  }, [FINAL_CODE]);

  const handleAiSectionChange = async (userPrompt: string) => {
    setLoading(true);
    const iframe = iframeRef.current;
    const selected = selectedElRef.current;
    if (!iframe || !selected) return;

    /// ✅ Clean HTML (remove editor markings)
    const clean = selected.cloneNode(true) as HTMLElement;
    clean.removeAttribute("style");
    clean.removeAttribute("contenteditable");
    const oldHTML = clean.outerHTML;

    const prompt = `
Rewrite this HTML section based on the user instruction.
- Keep it clean Tailwind UI
- DO NOT include contenteditable or outlines
User Instruction: "${userPrompt}"
HTML:
${oldHTML}
`;

    try {
      const result = await model.generateContent(prompt);
      const newHTML = result.response.text().trim();

      const temp = iframe.contentDocument!.createElement("div");
      temp.innerHTML = newHTML;
      const newNode = temp.firstElementChild as HTMLElement;

      if (newNode && selected.parentNode) {
        newNode.removeAttribute("style");
        newNode.removeAttribute("contenteditable");
        selected.parentNode.replaceChild(newNode, selected);
        selectedElRef.current = newNode;
        setUpdateSlider(iframe.contentDocument?.body?.innerHTML);
      }
    } catch (e) {
      console.error("AI Edit Error:", e);
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-full relative">
      <iframe
        ref={iframeRef}
        className="w-full aspect-[16/9] border rounded-lg shadow"
        sandbox="allow-scripts allow-same-origin"
      />

      <FloatingAction
        show={showPanel}
        position={cardPosition}
        loading={loading}
        handleAiChange={handleAiSectionChange}
        onClose={() => setShowPanel(false)}
      />
    </div>
  );
};

export default SliderFrameWork;
