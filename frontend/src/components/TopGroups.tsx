import { GroupByField } from "@/lib/groupByField";
import useTransactionStore from "@/stores/transactions.store";
import TopTrsGroupedByField from "./TopTrsGroupedByField";

function TopGroups() {
  const calculatedData = useTransactionStore((state) => state.calculatedData);
  const {
    topAccountsSentToByAmt,
    topAccountsReceivedFromByAmt,
    topCategoriesMoneyInByAmt,
    topCategoriesMoneyOutByAmt,
    topAccountsSentToByCount,
    topAccountsReceivedFromByCount,
    topCategoriesMoneyInByCount,
    topCategoriesMoneyOutByCount,
  } = calculatedData;

  return (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <TopTrsGroupedByField
        groupedBy={GroupByField.Account}
        moneyInSummaryByAmt={topAccountsReceivedFromByAmt.slice(0, 5)}
        moneyOutSummaryByAmt={topAccountsSentToByAmt.slice(0, 5)}
        moneyInSummaryByCount={topAccountsReceivedFromByCount.slice(0, 5)}
        moneyOutSummaryByCount={topAccountsSentToByCount.slice(0, 5)}
      />
      <TopTrsGroupedByField
        groupedBy={GroupByField.Category}
        moneyInSummaryByAmt={topCategoriesMoneyInByAmt.slice(0, 5)}
        moneyOutSummaryByAmt={topCategoriesMoneyOutByAmt.slice(0, 5)}
        moneyInSummaryByCount={topCategoriesMoneyInByCount.slice(0, 5)}
        moneyOutSummaryByCount={topCategoriesMoneyOutByCount.slice(0, 5)}
      />
    </div>
  );
}

export default TopGroups;
