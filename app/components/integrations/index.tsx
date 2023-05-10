import IntegrationBox from "../integration-box";
import styles from "./styles.css";

export default function Integration() {
    interface IIntegrationsId {
        id: string,
        name: string,
        type: string,
        icon: {
            url: string,
            alt: string
        },
        active: boolean
    }

    const integrationsIds: IIntegrationsId[] = [
		{
			id: "shopify",
			name: "Shopify",
            type: "ecommerce",
            icon: {
                url: "https://img.icons8.com/?size=512&id=uSHYbs6PJfMT&format=png",
                alt: "shpify icon"
            },
            active: true
		},
        {
			id: "lojaIntegrada",
			name: "Loja Integrada",
            type: "ecommerce",
            icon: {
                url: "",
                alt: "loja integrada icon"
            },
            active: true
		},
        {
			id: "woocommerce",
			name: "Woocommerce",
            type: "ecommerce",
            icon: {
                url: "https://img.icons8.com/?size=512&id=115298&format=png",
                alt: "woocommerce icon"
            },
            active: true
		},
        {
			id: "tray",
			name: "Tray",
            type: "ecommerce",
            icon: {
                url: "",
                alt: "tray icon"
            },
            active: true
		},
        {
			id: "googleAds",
			name: "Google Ads",
            type: "anuncios",
            icon: {
                url: "https://img.icons8.com/?size=512&id=ui4CTPMMDCFh&format=png",
                alt: "google ads icon"
            },
            active: true
		},
        {
			id: "facebookAds",
			name: "Facebook Ads",
            type: "anuncios",
            icon: {
                url: "https://img.icons8.com/?size=512&id=118497&format=png",
                alt: "facebook ads icon"
            },
            active: true
		},
        {
			id: "tiktokAds",
			name: "Tiktok Ads",
            type: "anuncios",
            icon: {
                url: "https://img.icons8.com/?size=512&id=118640&format=png",
                alt: "tiktok ads icon"
            },
            active: true
		},
        {
			id: "pinterestAds",
			name: "Pinterest Ads",
            type: "anuncios",
            icon: {
                url: "https://img.icons8.com/?size=512&id=63676&format=png",
                alt: "pinterest ads icon"
            },
            active: true
		},
        {
			id: "activeCampaing",
			name: "Active Campaing",
            type: "eMailMarketing",
            icon: {
                url: "",
                alt: "active campaing"
            },
            active: true
		},
        {
			id: "getResponse",
			name: "Get Response",
            type: "eMailMarketing",
            icon: {
                url: "",
                alt: "get response icon"
            },
            active: true
		},
        {
			id: "reportena",
			name: "Reportena",
            type: "eMailMarketing",
            icon: {
                url: "https://img.icons8.com/?size=512&id=uSHYbs6PJfMT&format=png",
                alt: "reportena icon"
            },
            active: true
		},
        {
			id: "mailChimp",
			name: "MailChimp",
            type: "eMailMarketing",
            icon: {
                url: "",
                alt: "mailChimp icon"
            },
            active: true
		},
        {
			id: "arquivoCSV",
			name: "Arquivo CSV",
            type: "planilhas",
            icon: {
                url: "",
                alt: "arquivo CSV icon"
            },
            active: true
		},
        {
			id: "googleSheets",
			name: "Google Sheets",
            type: "planilhas",
            icon: {
                url: "https://img.icons8.com/?size=512&id=30461&format=png",
                alt: "google sheets icon"
            },
            active: true
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
                                icon={integration.icon}
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
                                icon={integration.icon}
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
                                icon={integration.icon}
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
                                icon={integration.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}