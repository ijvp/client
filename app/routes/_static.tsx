import { Outlet } from "@remix-run/react";

export default function Static() {
	return (
		<div className="
		relative
		flex flex-col flex-grow
		m-auto
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
		after:h-[25%]
		after:z-10
		">
			<div className="overflow-scroll h-full">
				<Outlet />
			</div>
		</div>
	)
}