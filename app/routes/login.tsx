import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import api from "~/utils/api";
import SubmitButton, { links as submitButtonLinks } from "~/components/SubmitButton"
import Input from "~/components/Input";

export const links: LinksFunction = () => [
	...submitButtonLinks()
];

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		refetch();
	};

	const loginUser = () => {
		console.log("logging in...");
		// console.log(api);
		// api.post("/auth/login", {
		// 	username,
		// 	password
		// }).then(response => response.data);
	}

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["user"],
		queryFn: loginUser,
		enabled: false
	});

	useEffect(() => {
		console.log(data, isLoading, error);
	}, [data, isLoading, error]);

	return (
		<div className="md:max-w-screen-md w-full p-4 md:p-0">
			<form
				className="
					flex flex-col items-center gap-16 
					min-w-full
					bg-white bg-white/[0.02]
					border border-solid border-black-secondary rounded-2xl
					text-white
					px-10 py-12
					md:px-20 md:py-24
				"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-2 mb-4">
						<img src="/images/logo.png" alt="logo" /><p className="h6 font-semibold">Turbo <span className="text-purple">Dash</span></p>
					</div>
					<h1 className="h3">Acesse sua conta</h1>
				</div>
				<div className="flex flex-col items-center gap-6 w-full">
					<Input
						type="text"
						placeholder="Usuário"
						autocomplete="username"
						value={username}
						onChange={handleUsernameChange}
					/>
					<Input
						type="password"
						placeholder="Senha"
						autocomplete="current-password"
						value={password}
						onChange={handlePasswordChange}
					/>
					<SubmitButton label="Acessar" />
				</div>
				<div className="flex">
					<p>Ainda não tem uma conta?&nbsp;</p><Link to="/login">Registre aqui</Link>
				</div>
				{!!error && (<p>Algo deu errado</p>)}
			</form>
		</div>
	);
};