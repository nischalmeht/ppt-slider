import React, { useState } from 'react'
import ProfessionalSlider from "../../assets/Minimalist-White.jpg";
import dark from "../../assets/dark.jpg";
import modernSlider from "../../assets/modern-gradient.jpg";
import PastelSlider from "../../assets/pastel-ppt.jpg";
import techSlider from "../../assets/tech.jpg";

const Design_Styles = [
  {
    id: 1,
    styleName: "Professional Blue",
    colors: {
      primary: "#0A66C2",
      secondary: "#1C1C1C",
      accent: "#E8F0FE",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #0A66C2, #4F8BE6)",
    },
    designGuide:
      "Create a professional corporate look — clean layout, ample whitespace, consistent typography, and subtle shadows.",
    icon: "Briefcase",
    bannerImage: modernSlider,
  },
  {
    id: 2,
    styleName: "Minimal White",
    colors: {
      primary: "#1C1C1C",
      secondary: "#AAAAAA",
      accent: "#F5F5F5",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFFFFF, #F7F7F7)",
    },
    designGuide:
      "Minimal, airy slides with high contrast and restrained color use — focus on typography and layout.",
    icon: "Square",
    bannerImage: ProfessionalSlider,
  },
  {
    id: 3,
    styleName: "Tech Edge",
    colors: {
      primary: "#0F172A",
      secondary: "#06B6D4",
      accent: "#8B5CF6",
      background: "#0B1220",
      gradient: "linear-gradient(135deg, #0F172A, #06B6D4)",
    },
    designGuide:
      "Futuristic, high-contrast technology theme — neon accents, dark backgrounds, and sharp geometry.",
    icon: "Chip",
    bannerImage: techSlider,
  },
  {
    id: 4,
    styleName: "Pastel Breeze",
    colors: {
      primary: "#8EC5FC",
      secondary: "#E0BBE4",
      accent: "#FFDFD3",
      background: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFDFD3, #8EC5FC)",
    },
    designGuide:
      "Soft, friendly pastel theme — gentle gradients, rounded shapes, and calm imagery to keep focus on content.",
    icon: "Palette",
    bannerImage: PastelSlider,
  },
  {
    id: 5,
    styleName: "Dark Mode Pro",
    colors: {
      primary: "#0B1220",
      secondary: "#27272A",
      accent: "#94A3B8",
      background: "#07080A",
      gradient: "linear-gradient(135deg, #07080A, #27272A)",
    },
    designGuide:
      "Sleek dark mode for presentations — prioritize legibility with high-contrast text and subtle neon accents.",
    icon: "Moon",
    bannerImage: dark,
  },
]
type Props = {
  selectStyle: any
}
export type  DesignStyle={
   styleName: string,
  colors: any,
  designGuide: string
}
const SliderStyle = ({ selectStyle }: Props) => {
  const [selectedStyle, setSelectedStyle] = useState("");

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-xl'>Select Slider Style</h2>
      <div className='grid grid-cols-2 md:grid-cols-3  gap-5'>
        {Design_Styles.map((s) => (
          <div key={s.id} className={`rounded-lg overflow-hidden shadow-sm border
             ${selectedStyle === s.styleName ? "p-1 border-2 rounded-2xl border-primary" : "border-transparent"}`}
            onClick={() => {
              setSelectedStyle(s.styleName);
              selectStyle(s);
            }}>
            <div
              className='h-40 bg-cover bg-center hover:scale-105 transition-all cursor-pointer'
              style={{ backgroundImage: `url(${s.bannerImage})` }}
              aria-hidden
            />
            <div className='p-4'>
              <div className='text-lg font-semibold'>{s.styleName}</div>
              <div className='text-sm text-gray-500 mt-1'>{s.designGuide}</div>
              <div className='mt-3 flex items-center gap-3'>
                <div
                  className='w-8 h-8 rounded-full border'
                  style={{ background: s.colors.primary }}
                  title='primary color'
                />
                <div
                  className='w-8 h-8 rounded-full border'
                  style={{ background: s.colors.secondary }}
                  title='secondary color'
                />
                <div
                  className='w-8 h-8 rounded-full border'
                  style={{ background: s.colors.accent }}
                  title='accent color'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SliderStyle