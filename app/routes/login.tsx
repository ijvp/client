import type { LinksFunction } from "@remix-run/node";
import SubmitButton, { links as submitButtonLinks } from "~/components/SubmitButton"
import Input from "~/components/Input";
export const links: LinksFunction = () => [
	...submitButtonLinks()
];

export default function Login() {
	return (
		<div className="md:max-w-screen-md w-full p-4 md:p-0">
			<form className="
				flex flex-col items-center gap-16 
				min-w-full
				bg-white bg-white/[0.02]
				border border-solid border-black-secondary rounded-2xl
				text-white
				px-10 py-12
				md:px-20 md:py-24
			">
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-2 h6">
						<img src="/images/logo.png" alt="logo" /><p>Turbo <span className="text-purple">Dash</span></p>
					</div>
					<h1 className="h3">Log in to your account</h1>
				</div>
				<div className="flex flex-col items-center gap-6 w-full">
					<Input type="text" placeholder="Username" autocomplete="username" />
					<Input type="password" placeholder="Password" autocomplete="current-password" />
					<SubmitButton label="Sign in" />
				</div>
				<div>
					<p>Ainda não tem uma conta? <a href="/login">Registre aqui</a></p>
				</div>
			</form>
		</div>
	)
}