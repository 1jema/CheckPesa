import { useState } from "react";
import { Ellipsis, Database } from "lucide-react";
import { useTransactionRepository } from "@/context/RepositoryContext";

import { useLoadTransactions } from "@/hooks/useLoadTransactions";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MoreActions() {
  const [open, setOpen] = useState(false);
  const transactionRepository = useTransactionRepository();
  const { loadTransactions } = useLoadTransactions();

  const handleClearData = async () => {
    await transactionRepository.clearAllData();
    await loadTransactions();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Ellipsis className="h-6 w-6" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={handleClearData}
          className="flex items-center gap-2 py-3  cursor-pointer"
        >
          <Database className="h-5 w-5 text-red-600" />
          <span className="text-red-600">Clear All Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
