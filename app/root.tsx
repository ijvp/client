import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PolarisVizProvider } from "@shopify/polaris-viz";
import globalStyles from "~/styles/global.css";
import tailwind from "~/styles/tailwind.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import polarisVizStyles from "@shopify/polaris-viz/build/esm/styles.css";
import polarisOverwriteStyles from "~/styles/polaris.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: polarisVizStyles },
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: polarisOverwriteStyles }
];

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PolarisVizProvider themes={{
        Default: {
          seriesColors: {
            single: ["#5B4EEE"]
          },
          chartContainer: {
            backgroundColor: "#FF000000",
          }
        }
      }}>
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body className="min-h-screen min-w-screen text-white">
            <div className="w-full flex items-stretch">
              <Outlet />
            </div>
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </PolarisVizProvider>
    </QueryClientProvider >
  );
}
