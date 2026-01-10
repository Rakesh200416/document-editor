import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Editor } from "@tiptap/react";

interface FontFamilyPickerProps {
  editor: Editor | null;
}

const fontFamilies = [
  { name: "Inter", value: "Inter" },
  { name: "Serif", value: "Merriweather" },
  { name: "Mono", value: "Roboto Mono" },
  { name: "Comic", value: "Comic Neue" },
  { name: "Sans", value: "Arial" },
];

export function FontFamilyPicker({ editor }: FontFamilyPickerProps) {
  if (!editor) return null;

  const currentFont = editor.getAttributes("textStyle").fontFamily || "Inter";

  return (
    <Select
      value={currentFont}
      onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
    >
      <SelectTrigger className="w-[110px] h-9 text-xs">
        <SelectValue placeholder="Font" />
      </SelectTrigger>
      <SelectContent>
        {fontFamilies.map((font) => (
          <SelectItem 
            key={font.value} 
            value={font.value}
            style={{ fontFamily: font.value }}
          >
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
