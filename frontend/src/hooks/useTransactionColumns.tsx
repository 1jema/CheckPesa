import { useMemo } from "react";
import { transactionGroupSummaryColumns } from "@/components/GroupedTrsTable/Columns";
import {
  TableRowActions,
  ActionItem,
} from "@/components/GroupedTrsTable/RowAction";
import {
  GroupByField,
  TransactionSummary,
  groupTrxByField,
} from "@/lib/groupByField";
import { Filter } from "@/types/Filters";
import { Badge } from "@/components/ui/badge";
import { UNCATEGORIZED } from "@/types/Categories";
import { cn } from "@/lib/utils";

interface UseTransactionColumnsProps {
  groupByField: GroupByField;
  actions: ActionItem[];
  title: string;
  onCategoryClick?: (group: TransactionSummary) => void;
}

const createFilters = (field: GroupByField, value: string): Filter[] => [
  { field, operator: "==", value },
  { field, operator: "!=", value },
];

export const useTransactionColumns = ({
  groupByField,
  actions,
  title,
  onCategoryClick,
}: UseTransactionColumnsProps) => {
  const columns = useMemo(() => {
    const baseRows = [
      {
        headerTitle: "Actions",
        rowElement: (row: TransactionSummary) => (
          <TableRowActions row={row} actions={actions} />
        ),
      },
    ];

    const categoryRow = onCategoryClick
      ? [
          {
            headerTitle: "Main Category",
            rowElement: (row: TransactionSummary) => {
              const groups = groupTrxByField(
                row.transactions,
                GroupByField.Category,
              );
              const mainCateg = groups[0];
              return (
                <div className="w-[180px]">
                  <Badge
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(row);
                    }}
                    className={cn(
                      "w-[120px] cursor-pointer hover:opacity-80 truncate",
                      mainCateg.name !== UNCATEGORIZED
                        ? "bg-primary/90 text-white border border-primary/10"
                        : "bg-orange-400/20 dark:bg-amber-500/10 dark:text-amber-500/80 text-orange-500",
                    )}
                  >
                    {mainCateg.name}
                  </Badge>
                </div>
              );
            },
          },
        ]
      : [];

    return transactionGroupSummaryColumns({
      title,
      filters: (value: string) => createFilters(groupByField, value),
      rows: [...categoryRow, ...baseRows],
    });
  }, [groupByField, actions, title, onCategoryClick]);

  return columns;
};
