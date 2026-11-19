import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  isAfter,
  endOfDay,
  isBefore,
} from "date-fns";
import useTransactionStore from "@/stores/transactions.store";
import { Filter, FilterMode } from "@/types/Filters";
import { useTransactionRepository } from "@/context/RepositoryContext";
import { ExtractedTransaction, Transaction } from "@/types/Transaction";

/**
 * Generate the ideal date range filters based on transaction dates
 */
const getDateRangeData = (trs: Transaction[]): Filter[] => {
  const earliestTrDate = trs.length ? new Date(trs[0].date) : new Date();
  const latestTrDate = trs.length
    ? new Date(trs[trs.length - 1].date)
    : new Date();

  const startDate = startOfMonth(latestTrDate);
  const endDate = endOfMonth(latestTrDate);
  const start = isBefore(startDate, earliestTrDate)
    ? earliestTrDate
    : startDate;
  const end = isAfter(endDate, new Date()) ? endOfDay(new Date()) : endDate;

  return [
    {
      field: "date",
      operator: ">=",
      value: start.getTime(),
      mode: FilterMode.AND,
    },
    {
      field: "date",
      operator: "<=",
      value: end.getTime(),
      mode: FilterMode.AND,
    },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDemoTransaction = (demoTr: any) => {
  // Format category with subcategory if available
  const category = demoTr.subcategory
    ? `${demoTr.category}: ${demoTr.subcategory}`
    : demoTr.category;

  return {
    code: demoTr.mpesaCode,
    date: demoTr.date * 1000, // timestamp in milliseconds
    description: demoTr.transactionDescription,
    status: demoTr.status,
    amount: demoTr.amount,
    account: demoTr.account,
    balance: demoTr.balance,
    type: demoTr.transactionType,
    category,
  } as ExtractedTransaction;
};

export const getDemoData = async () => {
  const demoData = await import("@/assets/demo-data.json");

  const originalTransactions = demoData.transactions.map(mapDemoTransaction);
  let allTransactions = [...originalTransactions];
  // Add transactions for each year until current year
  const currentYear = new Date().getFullYear();
  const yearsToAdd = currentYear - 2023;

  for (let yearOffset = 1; yearOffset <= yearsToAdd; yearOffset++) {
    // Clone each original transaction and update its date for the new year
    const yearTransactions = originalTransactions
      .map((origTr) => {
        // Create a new transaction object (to avoid modifying the original)
        const newTr = { ...origTr };

        // Create new date based on original date but with updated year
        const origDate = new Date(origTr.date);
        const newDate = new Date(origDate);
        newDate.setFullYear(2023 + yearOffset);

        // Only include if date is before current date
        if (newDate.getTime() < Date.now()) {
          // Update the date and generate a new unique ID
          newTr.date = newDate.getTime();
          newTr.code = `${newTr.code}-${yearOffset}`; // Ensure unique ID/code
          return newTr;
        }
        return null;
      })
      .filter((tr) => tr !== null); // Remove null transactions (future dates)

    // Add new year's transactions to the collection
    allTransactions = [...allTransactions, ...yearTransactions];
  }

  return allTransactions;
};

export function useLoadTransactions() {
  const transactionRepository = useTransactionRepository();
  const navigate = useNavigate();

  const setAllTransactions = useTransactionStore(
    (state) => state.setAllTransactions,
  );

  const setCurrentFilters = useTransactionStore(
    (state) => state.setCurrentFilters,
  );

  const setError = useTransactionStore((state) => state.setError);

  const loadTransactions = useCallback(async () => {
    const allTransactions = await transactionRepository.getTransactions();
    setAllTransactions(allTransactions);
  }, [setAllTransactions, transactionRepository]);

  /**
   * Loads initial transactions or demo data if in demo mode
   */
  const loadInitialTransactions = useCallback(async () => {
    try {
      const trs = await transactionRepository.getTransactions();

      if (trs.length > 0) {
        // If transactions exist, use them
        setAllTransactions(trs);
        setCurrentFilters(getDateRangeData(trs));
        return;
      }

      navigate("/");
    } catch {
      setError("Failed to fetch transactions");
    }
  }, [
    navigate,
    setAllTransactions,
    setCurrentFilters,
    setError,
    transactionRepository,
  ]);

  return { loadInitialTransactions, loadTransactions };
}
