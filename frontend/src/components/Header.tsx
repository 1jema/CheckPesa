import { DateRange } from "react-day-picker";
import { useCallback, useState } from "react";
import { Bot, ListFilter, RefreshCcw } from "lucide-react";
import { Filter, FilterMode } from "@/types/Filters";
import useSidepanelStore, { SidepanelMode } from "@/stores/ui.store";
import useTransactionStore from "@/stores/transactions.store";
import { getDemoData, useLoadTransactions } from "@/hooks/useLoadTransactions";
import { useTransactionRepository } from "@/context/RepositoryContext";
import { cn } from "@/lib/utils";
import DateRangePicker from "./DateRangePicker";
import UploadStatementButton from "./Upload/LoadDataButton";
import { FilterChips } from "./FilterChips";
import AnalysisInitiator from "./AnalysisInitiator";
import { Button } from "./ui/button";
import { MoreActions } from "./HeaderMenu";

function Header() {
  const dateRangeData = useTransactionStore((state) => state.dateRangeData);
  const validateAndAddFilters = useTransactionStore(
    (state) => state.validateAndAddFilters,
  );
  const setSidepanel = useSidepanelStore((state) => state.setSidepanelMode);
  const transactionRepository = useTransactionRepository();
  const { loadTransactions, loadInitialTransactions } = useLoadTransactions();
  const allTrs = useTransactionStore((state) => state.allTransactions);

  const [loading, setLoading] = useState(false);

  const handleDateChange = useCallback(
    (dateRange: DateRange | undefined) => {
      if (!dateRange?.from || !dateRange?.to) return;

      const dateRangeFilter: Filter[] = [
        {
          field: "date",
          operator: ">=",
          value: dateRange.from.getTime(),
          mode: FilterMode.AND,
        },
        {
          field: "date",
          operator: "<=",
          value: dateRange.to.getTime(),
          mode: FilterMode.AND,
        },
      ];

      validateAndAddFilters(dateRangeFilter);
    },
    [validateAndAddFilters],
  );

  const handleAddDemoData = useCallback(async () => {
    setLoading(true);
    const demoTrs = await getDemoData();
    await transactionRepository.processMpesaStatementData(demoTrs);
    await loadTransactions();
    loadInitialTransactions();
    setLoading(false);
  }, [loadInitialTransactions, loadTransactions, transactionRepository]);

  return (
    <header className="sticky top-0 w-full border-b pt-2 pb-4 px-2 sm:px-4 h-14">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <DateRangePicker
            range={dateRangeData.dateRange}
            onDateChange={handleDateChange}
          />
          <Button
            variant="outline"
            onClick={() => setSidepanel(SidepanelMode.Filters)}
          >
            <ListFilter size={8} />
            <span className="hidden lg:block">Filter</span>
          </Button>
          <AnalysisInitiator />
          <Button
            variant="outline"
            onClick={() => setSidepanel(SidepanelMode.ChatPesa)}
          >
            <Bot size={8} />
            <span className="hidden lg:block">Chat</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {!allTrs.length && (
            <Button
              title="Generate fake data"
              variant="ghost"
              disabled={loading}
              className={cn(
                "flex items-center gap-2",
                loading && "animate-spin",
              )}
              onClick={handleAddDemoData}
            >
              <RefreshCcw className="text-primary" size={8} />
            </Button>
          )}

          <UploadStatementButton />
          <MoreActions />
        </div>
      </div>
    </header>
  );
}

export default Header;

export function HeaderWithFilters() {
  const currentFilters = useTransactionStore((state) => state.currentFilters);

  return (
    <div className="sticky top-0 mx-auto pt-2 z-[10]">
      {currentFilters?.length ? <FilterChips /> : null}
    </div>
  );
}
