import type { V2_MetaFunction, LinksFunction, LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import api from "~/api";
import { checkAuth } from "~/api/helpers";
import Input from "~/components/input";
import PageTitle from "~/components/page-title";
import SubmitButton, { links as submitButtonLinks } from "~/components/submit-button";

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

export const loader = ({ request }: LoaderArgs) => {
	return checkAuth(request)
		.then(user => {
			if (!user) {
				return redirect("/login");
			} else {
				return user;
			}
		})
		.catch(error => {
			console.log(error);
			return null;
		});
};

export default function Settings() {
	const user = useLoaderData();
	const actionData = useActionData();

	return (
		<>
			<PageTitle>
				Olá, {user.username}
			</PageTitle>
			<form
				method="post"
				className="
				max-w-xl 
				my-14
				flex flex-col items-center justify-center gap-8
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
				<div className="w-1/2 self-start">
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
			</form >
		</>
	)
}