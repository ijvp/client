import { Outlet } from "@remix-run/react";

export default function Static() {
	return (
		<div className="
		relative
		flex flex-col flex-grow
		mx-5
		my-auto
		md:m-auto
		max-h-[85vh]
		border 
		border-black-secondary
		rounded-2xl
		md:rounded-[36px]
		max-w-7xl
		overflow-hidden
		after:content-['']
		after:absolute
		after:bottom-0
		after:w-full
		after:bg-gradient-to-t
		after:from-black
		after:to-transparent
		after:h-[20%]
		after:z-10
		">
			<div
				className="
				absolute
				z-0
				top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
				w-1/6
				aspect-square
				bg-purple
				blur-[115px]
				rounded-full
			"
			/>
			<div className="overflow-scroll h-full">
				<div className="p-6 mb-32 md:p-10 lg:p-16 xl:p-20 w-full text-lg relative">
					<Outlet />
				</div>
			</div>
		</div>
	)
}