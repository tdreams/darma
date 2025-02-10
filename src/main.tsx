import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc"; // Your trpc client configuration
import "./index.css";
import "../globals.css";
import App from "./App.tsx";
import { getPublishableKey } from "./utils/clerkConf.ts";

// Create tRPC and React Query clients
const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

// Get Clerk publishable key
const PUBLISHABLE_KEY = getPublishableKey();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClerkProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
