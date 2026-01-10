import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Editor } from "@tiptap/react";

interface FontSizePickerProps {
  editor: Editor | null;
}

const fontSizes = [
  "12px", "14px", "16px", "18px", "20px", "24px", 
  "30px", "36px", "48px", "60px", "72px"
];

export function FontSizePicker({ editor }: FontSizePickerProps) {
  if (!editor) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || "16px";

  return (
    <Select
      value={currentSize}
      onValueChange={(value) => editor.chain().focus().setFontSize(value).run()}
    >
      <SelectTrigger className="w-[80px] h-9 text-xs">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {fontSizes.map((size) => (
          <SelectItem key={size} value={size}>
            {size.replace("px", "")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
