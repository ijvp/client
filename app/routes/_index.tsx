import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { checkAuth } from "~/api/helpers";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await checkAuth(request);
  if (authenticated) {
    return redirect("/analysis");
  } else {
    return redirect("/login")
  }
};
