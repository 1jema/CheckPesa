import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AIContextProvider } from "./AIContext";
import { ThemeProvider } from "./ThemeProvider";
import { RepositoryProvider } from "./RepositoryContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RepositoryProvider>
          <AIContextProvider>{children}</AIContextProvider>
        </RepositoryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
