import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useTransactionStore from "@/stores/transactions.store";
import AmtSummaryCard from "@/components/AmtSummaryCard";
import BalanceTrendCard from "@/components/BalanceTrend";
import PeriodicTransactionsChart from "@/components/PeriodicTransactionsChart";
import { MoneyMode } from "@/types/Transaction";
import TopGroups from "@/components/TopGroups";
import { Period } from "@/lib/groupByPeriod";

function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>();

  const transactions = useTransactionStore((state) => state.transactions);
  const calculatedData = useTransactionStore((state) => state.calculatedData);
  const dateRangeData = useTransactionStore((state) => state.dateRangeData);
  const { transactionTotals, balance, balanceTrend } = calculatedData;
  const { defaultPeriod, periodOptions } = dateRangeData;

  useEffect(() => {
    setSelectedPeriod(defaultPeriod);
  }, [defaultPeriod]);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <AmtSummaryCard
          type="Received"
          count={transactionTotals.moneyInCount}
          amount={transactionTotals.moneyInAmount}
          mode={MoneyMode.MoneyIn}
          Icon={ArrowDownCircle}
        />
        <AmtSummaryCard
          type="Sent"
          count={transactionTotals.moneyOutCount}
          amount={transactionTotals.moneyOutAmount}
          mode={MoneyMode.MoneyOut}
          Icon={ArrowUpCircle}
        />
        <BalanceTrendCard latestBalance={balance} data={balanceTrend} />
      </div>

      <div className="py-4">
        <PeriodicTransactionsChart
          defaultPeriod={selectedPeriod || defaultPeriod}
          onPeriodChange={setSelectedPeriod}
          periodOptions={periodOptions}
          transactions={transactions}
        />
      </div>

      <TopGroups />
    </>
  );
}

export default DashboardPage;
