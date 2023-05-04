import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import globalStyles from "~/styles/global.css";
import tailwind from "~/styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: globalStyles }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen min-w-screen flex items-center justify-center">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
