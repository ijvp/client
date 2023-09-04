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
			fixed right-0 top-0
			h-screen
			p-8
			text-lg
			flex flex-col gap-5
			border border-black-border bg-black rounded-2xl w-full max-w-lg z-[3] overflow-y-scroll
		">
			<div className="flex justify-between items-center gap-4">
				<p className="font-bold text-2xl">
					Detalhes
				</p>
				<Link to={`/produtos?store=${stores[selectedIndex].myshopify_domain}`} className="p-4 w-fit bg-black-bg border border-black-secondary rounded flex justify-center items-center hover:border-purple">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M17.4801 6.26987L6.51992 17.23M17.4801 17.23L13.4142 13.1642M6.51992 6.26987L10.5858 10.3357" stroke="#EFEFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</Link>
			</div>
			<div className="relative bg-white rounded-lg w-full pb-[100%]">
				<img
					className="absolute object-contain w-full h-full"
					src={product.featuredImage?.url ?? product.image?.src}
					alt={product.featuredImage?.altText ?? product.image?.alt}
				/>
			</div>

			<h2 className="font-bold text-2xl pb-4 border-b border-black-border">{product.title}</h2>
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
				border-box font-bold
				flex items-center justify-center gap-2
				bg-transparent
				border hover:border-2 border-solid border-purple--dark rounded-lg 
				text-purple--dark text-center p-3
			">
				<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
					<g clip-path="url(#clip0_945_2141)">
						<path d="M11.6977 6.45969H10.7796C10.5894 6.45969 10.4353 6.61385 10.4353 6.80399V10.9901C10.4353 11.2123 10.2545 11.3931 10.0323 11.3931H2.0096C1.78746 11.3931 1.60676 11.2123 1.60676 10.9901V2.96759C1.60676 2.74536 1.78746 2.56453 2.0096 2.56453H6.41007C6.60022 2.56453 6.75437 2.41037 6.75437 2.22022V1.30207C6.75437 1.11192 6.60022 0.957764 6.41007 0.957764H2.0096C0.901486 0.957764 0 1.85939 0 2.96759V10.9902C0 12.0984 0.901532 12.9999 2.0096 12.9999H10.0322C11.1404 12.9999 12.042 12.0983 12.042 10.9902V6.80404C12.042 6.61385 11.8879 6.45969 11.6977 6.45969Z" fill="#5B4EEE"/>
						<path d="M12.6557 0H9.00361C8.81346 0 8.6593 0.154157 8.6593 0.344306V1.26246C8.6593 1.45261 8.81346 1.60676 9.00361 1.60676H10.2571L5.5403 6.32344C5.40584 6.4579 5.40584 6.67587 5.5403 6.81038L6.18952 7.45965C6.25412 7.52424 6.34166 7.56051 6.43302 7.56051C6.52433 7.56051 6.61192 7.52424 6.67647 7.45965L11.3932 2.74288V3.9963C11.3932 4.18644 11.5474 4.3406 11.7375 4.3406H12.6557C12.8458 4.3406 13 4.18644 13 3.9963V0.344306C13 0.154157 12.8458 0 12.6557 0Z" fill="#5B4EEE"/>
					</g>
					<defs>
						<clipPath id="clip0_945_2141">
							<rect width="13" height="13" fill="white"/>
						</clipPath>
					</defs>
				</svg>
				Visualizar
			</a>
		</div>
	)
}