import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Document Settings</DialogTitle>
          <DialogDescription>
            Configure headers, footers, and page display options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Header Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="header">Header Content</Label>
              <Textarea
                id="header"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="min-h-[80px]"
                placeholder="Enter header text (supports basic formatting)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Header Position</Label>
                <Select defaultValue="top">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top of Page</SelectItem>
                    <SelectItem value="bottom">Bottom of Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Header Alignment</Label>
                <Select defaultValue="left">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Footer Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="footer">Footer Content</Label>
              <Textarea
                id="footer"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="min-h-[80px]"
                placeholder="Enter footer text (supports basic formatting)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Footer Position</Label>
                <Select defaultValue="bottom">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top of Page</SelectItem>
                    <SelectItem value="bottom">Bottom of Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Footer Alignment</Label>
                <Select defaultValue="left">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Page Numbering</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="page-numbers" className="text-base font-medium">
                  Page Numbers
                </Label>
                <p className="text-sm text-gray-500 mt-1">Display page numbers in footer</p>
              </div>
              <Switch
                id="page-numbers"
                checked={pageNumbers}
                onCheckedChange={setPageNumbers}
              />
            </div>
            <div>
              <Label>Number Format</Label>
              <Select defaultValue="arabic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">1, 2, 3, ...</SelectItem>
                  <SelectItem value="roman">i, ii, iii, ...</SelectItem>
                  <SelectItem value="Roman">I, II, III, ...</SelectItem>
                  <SelectItem value="alpha">a, b, c, ...</SelectItem>
                  <SelectItem value="Alpha">A, B, C, ...</SelectItem>
                </SelectContent>
              </Select>
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
