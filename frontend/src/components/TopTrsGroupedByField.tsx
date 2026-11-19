import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FieldGroupSummary, GroupByField } from "@/lib/groupByField";
import { MoneyMode } from "@/types/Transaction";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import NoData from "./NoData";

interface TopTrsGroupedByFieldProps {
  groupedBy: GroupByField;
  moneyInSummaryByAmt: FieldGroupSummary[];
  moneyOutSummaryByAmt: FieldGroupSummary[];
  moneyInSummaryByCount: FieldGroupSummary[];
  moneyOutSummaryByCount: FieldGroupSummary[];
}

function TopTrsGroupedByField({
  groupedBy,
  moneyInSummaryByAmt,
  moneyOutSummaryByAmt,
  moneyInSummaryByCount,
  moneyOutSummaryByCount,
}: TopTrsGroupedByFieldProps) {
  const [moneyMode, setMoneyMode] = useState<MoneyMode>(MoneyMode.MoneyOut);
  const [summaryMode, setSummaryMode] = useState<"count" | "amount">("amount");

  const summary = useMemo(() => {
    if (moneyMode === MoneyMode.MoneyOut) {
      return summaryMode === "amount"
        ? moneyOutSummaryByAmt
        : moneyOutSummaryByCount;
    }
    return summaryMode === "amount"
      ? moneyInSummaryByAmt
      : moneyInSummaryByCount;
  }, [
    moneyMode,
    summaryMode,
    moneyInSummaryByAmt,
    moneyOutSummaryByAmt,
    moneyInSummaryByCount,
    moneyOutSummaryByCount,
  ]);

  const groupTitle =
    groupedBy === GroupByField.Account ? "Top Accounts" : "Top Categories";

  const moneyModeOptions =
    groupedBy === GroupByField.Account
      ? [
          { label: "I Send To", value: MoneyMode.MoneyOut },
          { label: "I Receive From", value: MoneyMode.MoneyIn },
        ]
      : [
          { label: "(Money Out)", value: MoneyMode.MoneyOut },
          { label: "(Money In)", value: MoneyMode.MoneyIn },
        ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{groupTitle}</span>
            <Select
              value={moneyMode}
              onValueChange={(value) => setMoneyMode(value as MoneyMode)}
            >
              <SelectTrigger className="h-7 w-auto border-none px-2 shadow-none flex gap-2 items-center focus:border-none focus:ring-none focus:outline-none">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                {moneyModeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>{" "}
        </CardTitle>
        <ToggleGroup type="single" value={summaryMode}>
          {["amount", "count"].map((value) => (
            <ToggleGroupItem
              className="text-xs"
              onClick={() => setSummaryMode(value as "count" | "amount")}
              value={value}
              key={value}
            >
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-4">
        {!summary.length ? (
          <NoData />
        ) : (
          summary.map((item) => (
            <div key={item.name} className="space-y-1 mb-4">
              <div className="flex items-center justify-between">
                <span
                  title={item.name}
                  className="text-sm max-w-[60%] truncate"
                >
                  {item.name}
                </span>

                <span className="text-sm font-medium">
                  {summaryMode === "amount"
                    ? formatCurrency(item.amount)
                    : item.count}
                </span>
              </div>
              <div>
                <Progress
                  className="cursor-pointer"
                  color={
                    moneyMode === MoneyMode.MoneyIn
                      ? "bg-money-in"
                      : "bg-money-out"
                  }
                  value={
                    summaryMode === "count"
                      ? item.countPercentage
                      : item.amountPercentage
                  }
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default TopTrsGroupedByField;
