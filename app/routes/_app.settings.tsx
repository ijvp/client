import type { V2_MetaFunction, LinksFunction, LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import api from "~/api";
import { checkAuth } from "~/api/helpers";
import { fetchUserStores } from "~/api/user";
import Input from "~/components/input";
import PageTitle from "~/components/page-title";
import SubmitButton, { links as submitButtonLinks } from "~/components/submit-button";
import { formatStoreName } from "~/utils/store";

export const meta: V2_MetaFunction = () => {
	return [{ title: "Turbo Dash | Configurações" }];
};

export const links: LinksFunction = () => [
	...submitButtonLinks()
];

const validateUsername = (username: string) => {
	if (username.length < 3) {
		return "Seu nome de usuário precisa ter pelo menos 3 caracteres";
	};
};

const validatePasswordUpdate = (password: string, newPassword: string) => {
	if (password === newPassword) {
		return "Sua senha nova não pode ser igual a atual"
	}

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	const valid = regex.test(newPassword);
	if (!valid) {
		return "Sua senha deve conter pelo menos 8 caracteres, letras maiúsculas, letras minúsculas, caracteres especiais, e números"
	};
};

const validatePasswordComparision = (password: string, passwordConfirm: string) => {
	if (password !== passwordConfirm) {
		return "Senhas não são iguais";
	};
};

export const action = async ({ request }: ActionArgs) => {
	const body = await request.formData();
	const username = String(body.get("username"));
	const password = String(body.get("password"));
	const newPassword = String(body.get("new-password"));
	const newPasswordConfirm = String(body.get("new-password-confirm"));

	const fields = { username, password, newPassword };
	const fieldErrors = {
		username: validateUsername(username),
		newPassword: validatePasswordUpdate(password, newPassword),
		passwordConfirm: validatePasswordComparision(newPassword, newPasswordConfirm)
	};

	if (Object.values(fieldErrors).some(Boolean)) {
		return json({ fieldErrors, fields }, 400);
	};

	try {
		const cookie = request.headers.get("Cookie");
		const response = await api.post("/auth/update", {
			...fields
		},
			{
				headers: { Cookie: cookie }
			}
		);
		return json({ ...response.data });
	} catch (error) {
		return json(error.response?.data);
	};
};

export const loader = async ({ request }: LoaderArgs) => {
	try {
		const user = await checkAuth(request);
		const accounts = await fetchUserStores(request);
		return json({ user, accounts })
	} catch (error) {
		console.log(error);
		return redirect("/login");
	}
};

export default function Settings() {
	const { user, accounts } = useLoaderData();
	const actionData = useActionData();

	const handleDeleteStore = async (index: number) => {
		try {
			const data = new FormData();
			data.append("store", accounts[index]);
			const response = await fetch("/settings/delete", {
				method: "POST",
				body: data
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					return data.message;
				} else {
					return data.error;
				}
			}
		} catch (error) {
			console.log(error);
			return null;
		}
	};


	return (
		<>
			<PageTitle>
				Olá, {user.username}
			</PageTitle>
			<div className="w-full flex gap-8 items-start justify-center">
				<form
					method="post"
					className="
					w-full max-w-xl 
					my-14
					flex flex-col items-start justify-center gap-8
				">
					<div className="w-full flex flex-col items-start justify-center gap-4">
						<h2 className="subtitle">Alterar nome de usuário:</h2>
						<Input
							type="text"
							name="username"
							defaultValue={actionData?.fields?.username || user.username}
							ariaInvalid={Boolean(actionData?.fieldErrors?.username)}
							ariaErrorMessage={actionData?.fieldErrors?.username}
							autocomplete="username"
							icon="edit-icon.svg"
						/>
						{!!actionData?.fieldErrors?.username && (
							<p className="text-red-500">
								{actionData.fieldErrors.username}
							</p>
						)}
					</div>

					<div className="w-full flex flex-col items-start justify-center gap-4">
						<h2 className="subtitle">Alterar senha:</h2>
						<Input
							type="password"
							name="password"
							placeholder="Insira a senha atual"
						/>
						<Input
							type="password"
							name="new-password"
							placeholder="Nova senha"
							ariaInvalid={Boolean(actionData?.fieldErrors?.password)}
							ariaErrorMessage={actionData?.fieldErrors?.password}
						/>
						{!!actionData?.fieldErrors?.newPassword && (
							<p className="text-red-500">
								{actionData.fieldErrors.newPassword}
							</p>
						)}
						<Input
							type="password"
							name="new-password-confirm"
							placeholder="Confirmar nova senha"
							ariaInvalid={Boolean(actionData?.fieldErrors?.passwordConfirm)}
							ariaErrorMessage={actionData?.fieldErrors?.passwordConfirm}
						/>
						{!!actionData?.fieldErrors?.passwordConfirm && (
							<p className="text-red-500">
								{actionData.fieldErrors.passwordConfirm}
							</p>
						)}
					</div>
					<div className="w-2/3 self-start">
						<SubmitButton label="Salvar alterações" />
						{actionData?.success ?
							(
								<p className="text-green-500 my-4">
									Informações salvas com sucesso
								</p>) : (
								<p className="text-red-500 my-4">
									{actionData?.message}
								</p>
							)}
					</div>
				</form>
				<div className="
					w-full max-w-xl 
					my-14
					flex flex-col items-start justify-start gap-8
					">
					{!accounts.length ?
						(<h2 className="subtitle">Nenhuma loja conectada</h2>)
						: (<>
							<h2 className="subtitle">Lojas conectadas:</h2>
							{accounts.map((account: string, index: number) => {
								return (
									<div key={index} className="w-full">
										<div className="w-full flex items-center justify-between">
											<p>{formatStoreName(account)}</p>
											<button onClick={() => handleDeleteStore(index)}>deletar</button>
										</div>
									</div>)
							})}</>)
					}

				</div>
			</div>
		</>
	)
}