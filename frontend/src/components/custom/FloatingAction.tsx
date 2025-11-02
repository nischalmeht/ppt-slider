// import { X } from "lucide-react";
// import React, { useState } from "react";
// import { Button } from "../ui/button";

// const FloatingAction = () => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [showTooltip, setShowTooltip] = useState(false);

//   const handleMouseEnter = (e:any) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setPosition({
//       x: rect.left + rect.width / 2,
//       y: rect.top,
//     });
//     setShowTooltip(true);
//   };

//   const handleMouseLeave = () => {
//     setShowTooltip(false);
//   };

//   return (
//     <div className="fixed bottom-6 right-6">
//       <button
//         className="bg-orange
//         -600 text-white p-4 rounded-full shadow-lg"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         ⚙️
//       </button>

//       {showTooltip && (
//         <div
//           className="absolute z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl border flex"
//           style={{
//                     top:position.y+8,
//         left:position.x,
//         transform:"translate(-50%)"
//           }}
//         >
//           <h2>Action with Tool</h2>
//           <Button variant={'ghost'} size={"icon-sm"}><X/></Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FloatingAction;

// FloatingAction.tsx
// import { ArrowRight, Sparkle, Sparkles, X } from "lucide-react";
// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import { Separator } from "../ui/separator";

// const FloatingAction = ({
//   show,
//   position,
//   loading,
//   onClose,
// }: {
//   show: boolean;
//   position: { x: number; y: number } | null;
//   onClose: () => void;
//   handleAiChange:any;
//   loading:boolean
// }) => {
//   if (!show || !position) return null;
//   const [aiPrompt,setAiPrompt]=useState<string>()
//   const handleAiChange = async(value:string)=>{
    
//   }
//   return (
//     <div
//       className="fixed z-[9999] bg-white text-sm px-3 py-2 rounded-lg shadow-xl border flex gap-2 items-center"
//       style={{
//         top: position.y + 10,
//         left: position.x,
//         transform: "translate(-50%, 0)",
//       }}
//     >
//       <div className="flex gap-2 items-center">
//         <Sparkles className="h-4 2-4 " />
//         <input type="text" placeholder="Edit with AI"
//         className="outline-none border-none" 
//         value={aiPrompt}
//         onChange={(event)=>setAiPrompt(event?.target?.value)}/>
//         {aiPrompt &&<Button variant={"ghost"} onClick={()=>{handleAiChange(aiPrompt); setAiPrompt("")} }> 
//           <ArrowRight className="h-4 w-4"/>
//         </Button>}
//       </div>
//       <Separator orientation="vertical"/>
//       <Button variant="ghost" size="icon-sm" onClick={onClose} >
//         <X size={14} />
//       </Button>
//     </div>
//   );
// };

// export default FloatingAction;
import { ArrowRight, Loader2Icon, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const FloatingAction = ({
  show,
  position,
  loading,
  onClose,
  handleAiChange, // ✅ Accept prop here
}: {
  show: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
  handleAiChange: (value: string) => void; // ✅ Correct type
  loading: boolean;
}) => {
  if (!show || !position) return null;

  const [aiPrompt, setAiPrompt] = useState<string>("");

  return (
    <div
      className="fixed z-[9999] bg-white text-sm px-3 py-2 rounded-lg shadow-xl border flex gap-2 items-center"
      style={{
        top: position.y + 10,
        left: position.x,
        transform: "translate(-50%, 0)",
      }}
    >
      <div className="flex gap-2 items-center">
        <Sparkles className="h-4 2-4 " />
        
        <input
          type="text"
          placeholder="Edit with AI"
          className="outline-none border-none"
          value={aiPrompt}
          onChange={(event) => setAiPrompt(event.target.value)}
        />

        {aiPrompt && (
          <Button
            variant={"ghost"}
            onClick={() => {
              handleAiChange(aiPrompt); // ✅ Call real prop
              setAiPrompt("");
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {loading && <Loader2Icon className="animate-spin"/>}
      </div>

      <Separator orientation="vertical" />

      <Button variant="ghost" size="icon-sm" onClick={onClose}>
        <X size={14} />
      </Button>
    </div>
  );
};

export default FloatingAction;

