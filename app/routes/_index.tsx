import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { checkAuth } from "~/api/helpers";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const hmac = url.searchParams.get("hmac");
  const timestamp = url.searchParams.get("timestamp");

  if (shop && hmac && timestamp) {
    return redirect(`${process.env.API_URL}/shopify/auth?shop=${shop}&hmac=${hmac}&timestamp=${timestamp}`);
  };

  const authenticated = await checkAuth(request);
  if (authenticated) {
    return redirect("/analise");
  } else {
    return redirect("/login")
  }
};
