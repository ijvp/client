import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { fetchShopifyProductById, fetchProductSessionsById, fetchProductOrders } from "~/api/shopify";
import { checkAuth } from "~/api/helpers";
import { toLocalCurrency } from "~/utils/numbers";
import { useAtom } from "jotai";
import { storesAtom, storeIndexAtom } from "~/utils/atoms";

export const loader = async ({ request, params }: LoaderArgs) => {
	const user = await checkAuth(request);
	if (!user) {
		return redirect("/login");
	}
	const product = await fetchShopifyProductById(request, user, params.productId);
	const productSessions = await fetchProductSessionsById(request, user, params.productId);
	const productOrders = await fetchProductOrders(request, user, params.productId);
	console.log(productOrders);
	return json({ product, productSessions, productOrders });
}

export default function SelectedProduct() {
	const { product, productSessions } = useLoaderData();
	const [stores] = useAtom(storesAtom);
	const [selectedIndex] = useAtom(storeIndexAtom);

	const pricesAreDifferent = product.priceRangeV2?.minVariantPrice?.amount !== product.priceRangeV2?.maxVariantPrice?.amount;

	return (
		<div
			className="
			relative
			h-fit
			p-4
			text-lg
			flex flex-col gap-4
			flex-grow max-w-sm
			border border-solid border-black-border rounded-lg
		">
			<Link to={`/produtos?store=${stores[selectedIndex].myshopify_domain}`} className="absolute top-4 right-4 w-[42px] aspect-square bg-black-bg border border-solid border-black-secondary rounded-[4px] flex justify-center items-center hover:border-purple">
				<img src="/icons/x.svg" alt="sair" />
			</Link>
			<h2 className="h5 self-start">{product.title}</h2>
			<div className="bg-white rounded-lg overflow-clip">
				<img
					src={product.featuredImage?.url ?? product.image?.src}
					alt={product.featuredImage?.altText ?? product.image?.alt}
				/>
			</div>

			<p className="font-semibold">{product.description}</p>
			{pricesAreDifferent ?
				(
					<>
						<p className="text-gray"><span className="font-semibold text-white">Preço mínimo: </span>{toLocalCurrency(product.priceRangeV2?.minVariantPrice.amount)}</p>
						<p className="text-gray"><span className="font-semibold text-white">Preço máximo: </span>{toLocalCurrency(product.priceRangeV2?.maxVariantPrice.amount)}</p>
					</>
				) : (
					<p className="text-gray"><span className="font-semibold text-white">Preço: </span>{toLocalCurrency(product.priceRangeV2?.minVariantPrice?.amount)}</p>
				)
			}
			<p className="text-gray"><span className="font-semibold text-white">Sessões:</span> {productSessions?.sessions ?? 0}</p>
			<a
				target="_blank"
				rel="noreferrer"
				href={`https://${stores[selectedIndex].myshopify_domain}/products/${product.handle}`}

				className="
				w-full h-[45px]
				border-box 
				flex items-center justify-center gap-2
				bg-transparent
				border hover:border-2 border-solid border-purple--dark rounded-lg 
				text-purple--dark text-center p-3
			">
				<img src="/icons/exit-top-right.svg" alt="exit icon" />
				Visualizar
			</a>
		</div>
	)
}