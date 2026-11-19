import { useState } from "react";
import { FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MpesaUploadSection from "./StatementUpload";

type LoadDataButtonProps = {
  variant?: "default" | "ghost";
};
function LoadDataButton({ variant = "ghost" }: LoadDataButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <FileDown className="h-4 w-4" />
        <span className={cn("block", { hidden: variant === "ghost" })}>
          Load Transactions
        </span>{" "}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Upload Statement
            </DialogTitle>
          </DialogHeader>

          <MpesaUploadSection setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LoadDataButton;
