import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { fetchShopifyProductById } from "~/api/shopify";
import { checkAuth } from "~/api/helpers";
import { toLocalCurrency } from "~/utils/numbers";

export const loader = async ({ request, params }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	}
	const product = await fetchShopifyProductById(request, user, params.productId);
	return json(product);
}

export default function SelectedProduct() {
	const product = useLoaderData();

	const pricesAreDifferent = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;

	return (
		<div
			className="
			relative
			p-4
			text-lg
			flex flex-col gap-4
			flex-grow max-w-md
			border border-solid border-black-border rounded-lg
		">
			<Link to="/products" className="absolute top-4 right-4 w-[42px] aspect-square bg-black-bg border border-solid border-black-secondary rounded-[4px] flex justify-center items-center hover:border-purple">
				<img src="/x.svg" alt="sair" />
			</Link>
			<h2 className="h5 self-start">{product.title}</h2>
			<div className="bg-white rounded-lg overflow-clip">
				<img src={product.featuredImage.url} alt={product.featuredImage.altText} />
			</div>

			<p className="font-semibold">{product.description}</p>
			{pricesAreDifferent ?
				(
					<>
						<p className="text-gray"><span className="font-semibold text-white">Preço mínimo: </span>{toLocalCurrency(product.priceRange.minVariantPrice.amount)}</p>
						<p className="text-gray"><span className="font-semibold text-white">Preço máximo: </span>{toLocalCurrency(product.priceRange.maxVariantPrice.amount)}</p>
					</>
				) : (
					<p className="text-gray"><span className="font-semibold text-white">Preço: </span>{toLocalCurrency(product.priceRange.minVariantPrice.amount)}</p>
				)
			}
			<a
				target="_blank"
				rel="noreferrer"
				href={product.onlineStoreUrl}
				className="
				w-full h-[45px]
				border-box 
				flex items-center justify-center gap-2
				bg-transparent
				border hover:border-2 border-solid border-purple--dark rounded-lg 
				text-purple--dark text-center p-3
			">
				<img src="/icons/exit-top-right.svg" alt="exit icon" />
				Ver produto</a>
		</div>
	)
}