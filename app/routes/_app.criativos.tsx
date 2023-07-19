import PageTitle from "~/components/page-title";

export function ErrorBoundary() {
	return (
		<>
			<PageTitle>Erro ao carregar criativos</PageTitle>
			<p className="subtitle">Algo deu errado, verifique se ja adicionou alguma loja ou então tente novamente mais tarde</p>
		</>
	)
};

export default function CreativesPage() {
	return (
		<>
			<PageTitle>Criativos</PageTitle>
		</>
	)
};
