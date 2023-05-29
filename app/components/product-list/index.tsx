import { Link } from "@remix-run/react";

export default function Products({ products }) {
	return (
		<div className="flex flex-col flex-grow min-w-[50%] text-gray">
			<div
				className="
				w-full h-[55px]
				text-lg
				mb-4 last:mb-0
				flex items-stretch justify-between 
				border-b border-solid border-black-border
				overflow-clip
			">
				<div className="pl-2 content-box w-[115px] flex items-center">
					Posição
				</div>
				<div className="pl-2 text-start flex-grow flex items-center">
					Nome do produto
				</div>
			</div>

			{products.map((product, index) => {
				const productId = product.id.split("/").slice(-1);

				return (
					<div
						key={index}
						className="
						w-full h-[55px] 
						text-white
						flex items-stretch justify-between 
						rounded-lg overflow-clip mb-4 last:mb-0
					">
						<div className="bg-black-secondary py-3 px-6 content-box w-[115px] flex items-center justify-center">{index + 1}</div>
						<div className="bg-black-border py-3 pl-6 text-start flex-grow flex items-center">{product.title}</div>
						<Link to={`/products/${productId}`}
							className="bg-purple py-3 px-12 text-center flex items-center font-semibold text-white">Ver detalhes</Link>
					</div>)
			})}
		</div>
	);
};