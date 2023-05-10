import type { FormEvent } from "react";
import type { LinksFunction, ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import SubmitButton, { links as submitButtonLinks } from "~/components/submit-button"
import Input from "~/components/input";
import api from "~/api";
import { checkAuth } from "~/api/helpers";

export const links: LinksFunction = () => [
	...submitButtonLinks()
];

export const action = async ({ request }: ActionArgs) => {
	const form = await request.formData();
	const username = form.get("username");
	const password = form.get("password");

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
		} else {
			throw new Error(response.data.message);
		}
	} catch (error) {
		console.log(error);
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
	// useLoaderData();
	// const [username, setUsername] = useState("");
	// const [password, setPassword] = useState("");

	// const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	setUsername(event.target.value);
	// };

	// const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	setPassword(event.target.value);
	// };

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// refetch();
	};

	const loginUser = () => {
		console.log("logging in...");
		// console.log(api);
		// api.post("/auth/login", {
		// 	username,
		// 	password
		// }).then(response => response.data);
	}

	// const { data, isLoading, error, refetch } = useQuery({
	// 	queryKey: ["user"],
	// 	queryFn: loginUser,
	// 	enabled: false
	// });

	// useEffect(() => {
	// 	console.log(data, isLoading, error);
	// }, [data, isLoading, error]);

	return (
		<div className="md:max-w-screen-md h-screen w-full p-4 md:p-0 m-auto flex items-center justify-center">
			<form
				method="post"
				className="
					relative
					flex flex-col items-center gap-16 
					min-w-full
					bg-white bg-white/[0.02]
					border border-solid border-black-secondary rounded-2xl
					text-white
					px-10 py-12
					md:px-20 md:py-24
				"
			// onSubmit={handleSubmit}
			>
				<div className="
					absolute
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
					<h1 className="h3">Acesse sua conta</h1>
				</div>
				<div className="flex flex-col items-center gap-6 w-full">
					<Input
						type="text"
						name="username"
						placeholder="Usuário"
						autocomplete="username"
					// value={username}
					// onChange={handleUsernameChange}
					/>
					<Input
						type="password"
						name="password"
						placeholder="Senha"
						autocomplete="current-password"
					// value={password}
					// onChange={handlePasswordChange}
					/>
					<SubmitButton label="Acessar" />
				</div>
				<div className="flex">
					<p>Ainda não tem uma conta?&nbsp;</p><Link to="/login">Registre aqui</Link>
				</div>
				{/* {!!error && (<p>Algo deu errado</p>)} */}
			</form>
		</div>
	);
};