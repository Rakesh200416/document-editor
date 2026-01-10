# Rich Text Editor with Real-time Pagination

This project is a frontend-focused rich text editor built with React, Tiptap, and Tailwind CSS. It mimics the layout and pagination features of Microsoft Word / Google Docs.

## Features

-   **Real-time Pagination**: Visual page boundaries that update as you type.
-   **Print Layout**: WYSIWYG printing support (US Letter size).
-   **PDF Export**: Client-side PDF generation matching the editor view.
-   **Headers & Footers**: Fixed headers and dynamic page numbers in footers.
-   **Rich Text Formatting**: Bold, Italic, Lists, Alignment, Typography, etc.

## Technical Implementation

### Pagination Logic
Pagination is implemented using a "Continuous Layout" approach with visual overlays:
1.  **DOM Measurement**: The editor content is rendered in a continuous stream.
2.  **Visual Pages**: A background layer renders "Page Containers" (White 8.5x11" blocks) at fixed intervals (1056px height + gap).
3.  **Headers/Footers**: These are rendered absolutely positioned relative to each Page Container in the background layer.
4.  **Syncing**: The number of pages is calculated based on the total scroll height of the editor content divided by the page height.

### Page Size & Margins
-   **US Letter**: 8.5in x 11in.
-   **DPI**: Assumed 96 DPI -> 816px x 1056px.
-   **Margins**: 1 inch (96px) padding is applied to the editor container to ensure text stays within the printable area.

### Print & PDF
-   **CSS Print**: `@media print` styles hide the UI toolbar and adjust the layout to remove gaps and shadows, ensuring distinct physical pages.
-   **PDF Export**: Uses `html2pdf.js` to capture the DOM state and generate a PDF file that respects the visual layout.

## Limitations & Trade-offs
-   **Content Splitting**: Content is not physically split into separate DOM nodes per page (which is complex and prone to data loss). Instead, it flows continuously, and the "Pages" are drawn behind it. This ensures stable editing but might lead to a line of text being split across a visual page break if line-heights are not perfectly aligned with page height.
-   **Performance**: Recalculating page counts on every edit can be expensive for very large documents; we debounce this calculation.

## Improvements
-   **True Node Splitting**: Implement a custom Tiptap NodeView that strictly handles content separation for 100% accurate "content-in-page" logic.
-   **Virtualization**: For documents with 100+ pages, render only visible pages to improve performance.
