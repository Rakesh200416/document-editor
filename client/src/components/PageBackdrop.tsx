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
            "print:shadow-none print:border-none print:m-0"
          )}
          style={{
            width: "816px", // 8.5in
            height: `${PAGE_HEIGHT}px`, // 11in
            marginBottom: `${PAGE_GAP}px`,
          }}
        >
          {/* Header Area */}
          <div className="absolute top-8 left-12 right-12 h-12 border-b border-transparent group-hover:border-border/30 flex items-end justify-between text-xs text-muted-foreground/70">
            <span>{headerContent}</span>
          </div>

          {/* Footer Area */}
          <div className="absolute bottom-8 left-12 right-12 h-12 border-t border-transparent group-hover:border-border/30 flex items-start justify-between text-xs text-muted-foreground/70 pt-2">
            <span>{footerContent}</span>
            {showPageNumbers && (
              <span>Page {i + 1} of {pageCount}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
