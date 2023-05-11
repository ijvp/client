import IntegrationBox from "../integration-box";
import styles from "./styles.css";

export default function Integration() {
    interface IIntegrationsId {
        id: string,
        name: string,
        type: string,
        active: boolean
    }

    const integrationsIds: IIntegrationsId[] = [
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
            active: true
        },
        {
            id: "woocommerce",
            name: "Woocommerce",
            type: "ecommerce",
            active: true
        },
        {
            id: "tray",
            name: "Tray",
            type: "ecommerce",
            active: true
        },
        {
            id: "google",
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
            active: true
        },
        {
            id: "pinterestAds",
            name: "Pinterest Ads",
            type: "anuncios",
            active: true
        },
        {
            id: "activeCampaing",
            name: "Active Campaing",
            type: "eMailMarketing",
            active: true
        },
        {
            id: "getResponse",
            name: "Get Response",
            type: "eMailMarketing",
            active: true
        },
        {
            id: "reportana",
            name: "Reportana",
            type: "eMailMarketing",
            active: true
        },
        {
            id: "mailChimp",
            name: "MailChimp",
            type: "eMailMarketing",
            active: true
        },
        {
            id: "arquivoCSV",
            name: "Arquivo CSV",
            type: "planilhas",
            active: true
        },
        {
            id: "googleSheets",
            name: "Google Sheets",
            type: "planilhas",
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
            {/* <h1 className="h2 border-b border-solid border-black-secondary pb-[27px] mb-[27px]">Integrações</h1> */}
            <div>
                <div className="mt-[60px]">
                    <h2 id="ecommerce" className="h5 pb-8">E-Commerce:</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {ecommerceIntegrations.map(integration => (
                            <IntegrationBox
                                key={integration.id}
                                id={integration.id}
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
                                id={integration.id}
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
                                id={integration.id}
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
                                id={integration.id}
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