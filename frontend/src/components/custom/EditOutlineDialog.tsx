import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

const EditOutlineDialog = ({children,outlineData,onUpdate}:any) => {
    const [localData,setLocalData]=useState(outlineData);
    const [openDialog,setOpenDialog]=useState(false)
      const handleChange = (field: string, value: string) => {
    setLocalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
  if (onUpdate) onUpdate(localData);
    setOpenDialog(false);
  };
  return (
<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Slider Outline</DialogTitle>
      <DialogDescription>
        <div>
            <label>Slider Title</label>
        <Input placeholder="Slider title" value={localData.slidePoint}   onChange={(e) => handleChange("slidePoint", e.target.value)}/>
        <div className="mt-3">
            <label>Slider Outline</label>
            <Textarea placeholder="Slider Outline" value={localData.outline} className="h-40 mt-2"  onChange={(e) => handleChange("outline", e.target.value)}/>
        </div>
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <DialogClose>  
        <Button variant={"outline"}>Close</Button>
        </DialogClose>
        <Button onClick={handleUpdate}>Update</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default EditOutlineDialog