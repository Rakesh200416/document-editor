## Packages
@tiptap/react | Core editor
@tiptap/pm | ProseMirror core (required by Tiptap)
@tiptap/starter-kit | Basic extensions
@tiptap/extension-underline | Underline support
@tiptap/extension-text-align | Alignment support
@tiptap/extension-placeholder | Placeholder text
@tiptap/extension-text-style | Base for styling
@tiptap/extension-font-family | Font selection
@tiptap/extension-typography | Typographic fixes
html2pdf.js | PDF export
@types/html2pdf.js | Types for html2pdf
lucide-react | Icons
date-fns | Date formatting
clsx | Class name utility
tailwind-merge | Tailwind utility

## Notes
- Pagination is visual-only: Editor overlays a background of "pages".
- Page height is fixed at 1056px (11in at 96dpi).
- Margins are visual (padding on editor).
- Print styles must hide UI and remove shadows.
