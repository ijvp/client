import IntegrationBox from "../integration-box";
import styles from "./styles.css";

export default function Integration() {
    const integrationsIds = [
		{
			id: "shopify",
			name: "Shopify",
            type: "ecommerce",
            active: true
		},
        {
			id: "lojaIntegrada",
			name: "Loja Integrada",
            type: "ecommerce",
            active: false
		},
        {
			id: "woocommerce",
			name: "Woocommerce",
            type: "ecommerce",
            active: false
		},
        {
			id: "tray",
			name: "Tray",
            type: "ecommerce",
            active: false
		},
        {
			id: "googleAds",
			name: "Google Ads",
            type: "anuncios",
            active: true
		},
        {
			id: "facebookAds",
			name: "Facebook Ads",
            type: "anuncios",
            active: true
		},
        {
			id: "tiktokAds",
			name: "Tiktok Ads",
            type: "anuncios",
            active: false
		},
        {
			id: "pinterestAds",
			name: "Pinterest Ads",
            type: "anuncios",
            active: false
		},
        {
			id: "activeCampaing",
			name: "Active Campaing",
            type: "eMailMarketing",
            active: false
		},
        {
			id: "getResponse",
			name: "Get Response",
            type: "eMailMarketing",
            active: false
		},
        {
			id: "reportena",
			name: "Reportena",
            type: "eMailMarketing",
            active: false
		},
        {
			id: "mailChimp",
			name: "MailChimp",
            type: "eMailMarketing",
            active: false
		},
        {
			id: "arquivoCSV",
			name: "Arquivo CSV",
            type: "planilhas",
            active: false
		},
        {
			id: "googleSheets",
			name: "Google Sheets",
            type: "planilhas",
            active: false
		}
	]

    const activeIntegrationsIds = integrationsIds.filter(integration => integration.active === true);
    const ecommerceIntegrations = activeIntegrationsIds.filter(integration => integration.type === "ecommerce");
    const anunciosIntegrations = activeIntegrationsIds.filter(integration => integration.type === "anuncios");
    const emailIntegrations = activeIntegrationsIds.filter(integration => integration.type === "eMailMarketing");
    const planilhasIntegrations = activeIntegrationsIds.filter(integration => integration.type === "planilhas");


    return (
        
        <div>
            <h1 className="h2 border-b border-solid border-black-secondary pb-[27px] mb-[27px]">Integrações</h1>
            <div>
                <div className="mt-[60px]">
                    <h2 id="ecommerce" className="h5 pb-8">E-Commerce:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {ecommerceIntegrations.map(integration => (
                            <IntegrationBox 
                                key={integration.id} 
                                name={integration.name} 
                                connected={false}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-[60px]">
                    <h2 id="anuncios" className="h5 pb-8">Anúncios:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {anunciosIntegrations.map(integration => (
                            <IntegrationBox 
                                key={integration.id} 
                                name={integration.name} 
                                connected={false}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-[60px]">
                    <h2 id="eMailMarketing" className="h5 pb-8">E-Mail Marketing:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {emailIntegrations.map(integration => (
                            <IntegrationBox 
                                key={integration.id} 
                                name={integration.name} 
                                connected={false}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-[60px]">
                    <h2 id="planilhas" className="h5 pb-8">Planilhas:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {planilhasIntegrations.map(integration => (
                            <IntegrationBox 
                                key={integration.id} 
                                name={integration.name} 
                                connected={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}