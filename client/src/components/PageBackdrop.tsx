import { clsx } from "clsx";

interface PageBackdropProps {
  pageCount: number;
  headerContent: string;
  footerContent: string;
  showPageNumbers: boolean;
}

const PAGE_HEIGHT = 1056; // px
const PAGE_GAP = 24; // px

export function PageBackdrop({ pageCount, headerContent, footerContent, showPageNumbers }: PageBackdropProps) {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-0 flex flex-col items-center pb-12">
      {Array.from({ length: Math.max(1, pageCount) }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "page-container relative bg-white shadow-md border border-border/50 transition-all duration-300 ease-in-out",
            "print:shadow-none print:border print:border-border/50 print:m-0"
          )}
          style={{
            width: "816px", // 8.5in
            height: `${PAGE_HEIGHT}px`, // 11in
            marginBottom: `${PAGE_GAP}px`,
          }}
        >
          {/* Header Area */}
          <div className="header-area absolute top-0 left-0 right-0 h-16 px-12 flex items-center justify-between text-sm text-gray-600 border-b border-gray-300 print:border-gray-300 print:z-50">
            <div className="font-medium">{headerContent || "Header"}</div>
            <div className="text-right text-xs space-y-1">
              <div className="font-medium">Page {i + 1}</div>
              <div className="text-gray-500">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="footer-area absolute bottom-0 left-0 right-0 h-16 px-12 flex items-center justify-between text-sm text-gray-600 border-t border-gray-300 print:border-gray-300 print:z-50">
            <div className="font-medium">{footerContent || "Footer"}</div>
            <div className="text-right">
              <div className="text-xs">
                {showPageNumbers && (
                  <span>Page {i + 1} of {pageCount}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
