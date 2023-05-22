import type { LinksFunction, ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import SubmitButton, { links as submitButtonLinks } from "~/components/submit-button"
import Input from "~/components/input-2";
import api from "~/api";
import { checkAuth } from "~/api/helpers";

export const links: LinksFunction = () => [
	...submitButtonLinks()
];

export const action = async ({ request }: ActionArgs) => {
	const form = await request.formData();
	const username = form.get("username");
	const password = form.get("password");

	const fields = { username, password };
	if (!Object.values(fields).some(Boolean)) {
		return json({ success: false, message: "Por favor preencha todos os campos" });
	};

	try {
		const response = await api.post("/auth/login",
			{
				username,
				password
			},
			{
				withCredentials: true
			}
		);

		if (response.data.success) {
			return redirect("/analysis", {
				headers: response.headers
			});
		}
	} catch (error) {
		return json({ success: false, message: "Algo deu errado, verifique sua senha" });
	}

	return null;
};

export const loader = async ({ request }: LoaderArgs) => {
	const authenticated = await checkAuth(request);
	if (authenticated) {
		return redirect("/analysis");
	};

	return null;
};

export default function Login() {
	const actionData = useActionData();

	return (
		<div className="md:max-w-screen-md h-screen w-full p-4 md:p-0 m-auto flex items-center justify-center">
			<form
				id="login-form"
				method="post"
				className="
					animated-form
					relative
					flex flex-col items-center gap-16 
					min-w-full
					bg-white/[0.02]
					border border-solid border-black-secondary rounded-2xl
					text-white
					px-10 py-12
					md:px-20 md:py-24
				"
			>
				<div className="
					absolute
					z-0
					top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
					w-[350px]
					aspect-square
					bg-purple
					blur-[331px]
					rounded-full
				" />
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-2 mb-4">
						<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
					</div>
					<h2 className="h3 font-bold">Acesse sua conta</h2>
				</div>
				<div className="flex flex-col items-center gap-6 w-full relative z-10">
					<Input
						type="text"
						name="username"
						placeholder="Usuário"
						autocomplete="username"
					/>
					<Input
						type="password"
						name="password"
						placeholder="Senha"
						autocomplete="current-password"
					/>
					<div className="w-full relative">
						<SubmitButton
							label="Acessar"
							disabled={false}
						/>
						{actionData?.success ? null : (
							<p className="absolute top-full left-1/2 -translate-x-1/2 text-red-500 my-4">
								{actionData?.message}
							</p>)}
					</div>
				</div>
				<div className="flex">
					<p>Ainda não tem uma conta?&nbsp;</p><Link to="/login">Registre aqui</Link>
				</div>

			</form>
		</div>
	);
};