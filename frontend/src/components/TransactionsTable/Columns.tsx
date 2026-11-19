import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Transaction } from "@/types/Transaction";
import { cn } from "@/lib/utils";
import { UNCATEGORIZED } from "@/types/Categories";
import { Badge } from "../ui/badge";
import { DataTableColumnHeader } from "../ui/table/data-table-column-header";

type TransactionColumnProps = {
  onCategoryClick?: (transaction: Transaction) => void;
};

export const createTransactionColumns = ({
  onCategoryClick,
}: TransactionColumnProps = {}): ColumnDef<Transaction>[] => [
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sender/Receiver" />
    ),
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="w-[250px] max-w-[250px]">
          <span
            title={transaction.account}
            className="block truncate max-w-full"
          >
            {transaction.account}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const formattedAmount =
        amount < 0 ? `-Ksh ${Math.abs(amount)}` : `Ksh ${amount}`;

      return (
        <div
          className={`w-[100px] ${amount < 0 ? "text-money-out" : "text-money-in"} font-semibold`}
        >
          {formattedAmount}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("date") as number;
      const date = new Date(timestamp);

      return (
        <div className="w-[160px]">
          {format(date, "EEE, MMM dd yyyy HH:mm")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const transaction = row.original;

      return (
        <Badge
          title={category === UNCATEGORIZED ? "Categorize" : category}
          className={cn(
            "w-[120px] cursor-pointer hover:opacity-80 truncate",
            category !== UNCATEGORIZED
              ? "bg-primary/90 text-white border border-primary/10"
              : "bg-orange-400/20 dark:bg-amber-500/10 dark:text-amber-500/80 text-orange-500",
          )}
          onClick={() => onCategoryClick && onCategoryClick(transaction)}
        >
          <span className="truncate">
            {category === UNCATEGORIZED ? "Categorize" : category}
          </span>
        </Badge>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transactionType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("transactionType")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
