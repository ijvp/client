import { V2_MetaFunction, LinksFunction, LoaderArgs, ActionArgs, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
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

const validatePassword = (password: string) => {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	const valid = regex.test(password);
	if (!valid) {
		return "Sua senha deve conter pelo menos 8 caracteres, letras maiúsculas, letras minúsculas, caracteres especiais, e números"
	};
};

const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
	if (password === passwordConfirm) {
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
		newPassword: validatePassword(newPassword),
		passwordConfirm: validatePasswordConfirm(newPassword, newPasswordConfirm)
	};
	if (Object.values(fieldErrors).some(Boolean)) {
		return json({ fieldErrors, fields }, 400);
	};

	return redirect("/settings");
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
		});
};

export default function Settings() {
	const user = useLoaderData();
	const actionData = useActionData();

	console.log(actionData?.fieldErrors);
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
						<span className="text-red-500">
							{actionData.fieldErrors.username}
						</span>
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
						<span className="text-red-500">
							{actionData.fieldErrors.newPassword}
						</span>
					)}
					<Input
						type="password"
						name="new-password-confirm"
						placeholder="Confirmar nova senha"
						ariaInvalid={Boolean(actionData?.fieldErrors?.passwordConfirm)}
						ariaErrorMessage={actionData?.fieldErrors?.passwordConfirm}
					/>
					{!!actionData?.fieldErrors?.passwordConfirm && (
						<span className="text-red-500">
							{actionData.fieldErrors.passwordConfirm}
						</span>
					)}
				</div>
				<div className="w-1/2 self-start">
					<SubmitButton label="Salvar alterações" />
				</div>
			</form >
		</>
	)
}