import PageTitle from "~/components/page-title";
import FAQItem from "~/components/faq-item";


export default function FAQ() {

	const faq = [
		{
			question: 'Vocês garantem resultado?',
			answer: 'Só faríamos isso se fôssemos desonestos. Na verdade, nós garantimos a você um serviço de alta qualidade. O resultado é consequência. Essa é a mesma resposta que nós demos para empreendedores parceiros em que nós ajudamos a escalar em mais de 10x o faturamento.'  
		  },
		  {
			question: 'Quanto custa?',
			answer: 'O investimento no serviço depende do escopo do projeto. Os valores se iniciam em R$1997. Você pode receber uma proposta personalizada para o seu negócio preenchendo o formulário agora.'  
		  },
		  {
			question: 'Quais serviços vocês prestam?',
			answer: 'O nosso carro chefe é a aceleração de negócios a partir dos anúncios online. Nós temos um time completo de especialistas no digital, como copywriters, UI/UX Designers, Designers Gráficos , Gestores de Performance e Desenvolvedores, prontos para escalar suas vendas a partir da internet. Nesse sentido, nós confeccionamos para você criativos sob medida, otimizamos suas campanhas, trabalhamos estratégias de remarketing e também construímos sites do zero.'  
		  },
		  {
			question: 'Posso cancelar a qualquer momento?',
			answer: 'Se, por qualquer motivo, você não estiver 100% satisfeito com o nosso serviço, basta solicitar o cancelamento do contrato em 30 dias'  
		  },
		  {
			question: 'Quanto devo investir em tráfego?',
			answer: 'Nós recomendamos aos nossos clientes um investimento mínimo de R$35 por dia. Este valor é mais do que suficiente para os testes iniciais. À medida que você for obtendo seus primeiros resultados, você pode aumentar o seu investimento mensal.'  
		  }
	];
	
	return (
		<div className="w-full flex flex-col">
            <PageTitle>
				<div className="flex w-fit items-center gap-4">
					<img src="/icons/help.svg" className="h-6 md:h-12"/>
					Dúvidas frequentes
				</div>
			</PageTitle>
			<div className="flex flex-col pt-6">
				{faq.map((item, index) => (
					<FAQItem answer={item.answer} question={item.question} key={index}/>
				))}
			</div>
		</div>
	)
}