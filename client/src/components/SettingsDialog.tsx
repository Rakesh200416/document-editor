import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerContent: string;
  footerContent: string;
  showPageNumbers: boolean;
  onSave: (settings: { headerContent: string; footerContent: string; showPageNumbers: boolean }) => void;
}

export function SettingsDialog({ 
  open, 
  onOpenChange, 
  headerContent, 
  footerContent, 
  showPageNumbers, 
  onSave 
}: SettingsDialogProps) {
  const [header, setHeader] = useState(headerContent);
  const [footer, setFooter] = useState(footerContent);
  const [pageNumbers, setPageNumbers] = useState(showPageNumbers);

  // Sync state when props change
  useEffect(() => {
    if (open) {
      setHeader(headerContent);
      setFooter(footerContent);
      setPageNumbers(showPageNumbers);
    }
  }, [open, headerContent, footerContent, showPageNumbers]);

  const handleSave = () => {
    onSave({ 
      headerContent: header, 
      footerContent: footer, 
      showPageNumbers: pageNumbers 
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Settings</DialogTitle>
          <DialogDescription>
            Configure headers, footers, and page display options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="header" className="text-right">
              Header
            </Label>
            <Input
              id="header"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Confidential"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="footer" className="text-right">
              Footer
            </Label>
            <Input
              id="footer"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Draft v1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="page-numbers" className="text-right">
              Page #
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="page-numbers"
                checked={pageNumbers}
                onCheckedChange={setPageNumbers}
              />
              <Label htmlFor="page-numbers" className="text-sm text-muted-foreground">
                Show page numbers in footer
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
