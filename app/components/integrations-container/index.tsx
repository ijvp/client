import { useAtom } from "jotai";
import IntegrationBox from "../integration-box";
import { storesAtom } from "~/utils/atoms";

export default function IntegrationContainer() {
  const [stores, setStores] = useAtom(storesAtom);

  interface IIntegrationsId {
    id: string;
    name: string;
    type: string;
    active: boolean;
    validation: string;
    locked: boolean;
  }

  const integrationsIds: IIntegrationsId[] = [
    {
      id: "google",
      name: "Google Ads",
      type: "anuncios",
      active: true,
      validation: 'google_client',
      locked: false
    },
    {
      id: "facebook",
      name: "Facebook Ads",
      type: "anuncios",
      validation: 'facebook_business',
      active: true,
      locked: false
    },
    {
      id: "tiktok",
      name: "Tiktok Ads",
      type: "anuncios",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "pinterest",
      name: "Pinterest Ads",
      type: "anuncios",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "activeCampaing",
      name: "Active Campaing",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "getResponse",
      name: "Get Response",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "reportana",
      name: "Reportana",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "mailChimp",
      name: "MailChimp",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "arquivoCSV",
      name: "Arquivo CSV",
      type: "planilhas",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "googleSheets",
      name: "Google Sheets",
      type: "planilhas",
      validation: '',
      active: true,
      locked: true
    }
  ]

  const activeIntegrationsIds = integrationsIds.filter(integration => integration.active === true);
  // const ecommerceIntegrations = activeIntegrationsIds.filter(integration => integration.type === "ecommerce");
  const anunciosIntegrations = activeIntegrationsIds.filter(integration => integration.type === "anuncios");
  const emailIntegrations = activeIntegrationsIds.filter(integration => integration.type === "eMailMarketing");
  const planilhasIntegrations = activeIntegrationsIds.filter(integration => integration.type === "planilhas");

  return (
    <>
      {stores.length > 0 ?
        <div>
          <div>
            {/* <div className="mt-[60px]">
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
                        </div> */}
            <div className="mt-[60px]">
              <h2 id="anuncios" className="h5 pb-8">Anúncios:</h2>
              <div className="grid grid-cols-2 gap-6">
                {anunciosIntegrations.map(integration => (
                  <IntegrationBox
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    locked={integration.locked}
                    validation={integration.validation}
                  />
                ))}
              </div>
            </div>
            {emailIntegrations.length > 0 && <div className="mt-[60px]">
              <h2 id="eMailMarketing" className="h5 pb-8">E-Mail Marketing:</h2>
              <div className="grid grid-cols-2 gap-6">
                {emailIntegrations.map(integration => (
                  <IntegrationBox
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    locked={integration.locked}
                    validation={integration.validation}
                  />
                ))}
              </div>
            </div>}
            <div className="mt-[60px]">
              <h2 id="planilhas" className="h5 pb-8">Planilhas:</h2>
              <div className="grid grid-cols-2 gap-6">
                {planilhasIntegrations.map(integration => (
                  <IntegrationBox
                    key={integration.id}
                    id={integration.id}
                    name={integration.name}
                    locked={integration.locked}
                    validation={integration.validation}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        : null}
    </>
  )
}