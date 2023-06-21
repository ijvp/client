import { useAtom } from "jotai";
import IntegrationBox from "../integration-box";
import { storesAtom } from "~/utils/atoms";
import { useEffect, useMemo } from "react";

export default function IntegrationContainer({ connections }) {
  const [stores, setStores] = useAtom(storesAtom);

  interface IIntegrationsId {
    id: string;
    name: string;
    type: string;
    active: boolean;
    validation: string;
    locked: boolean;
    connected?: boolean
  }

  const integrationsIds: IIntegrationsId[] = [
    {
      id: "google",
      name: "Google Ads",
      type: "anuncios",
      active: true,
      validation: 'google_client',
      locked: false,
      connected: !!connections?.google_ads
    },
    {
      id: "facebook",
      name: "Facebook Ads",
      type: "anuncios",
      validation: 'facebook_business',
      active: true,
      locked: false,
      connected: connections?.facebook_ads
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
      id: "activeCampaign",
      name: "Active Campaign",
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

  useEffect(() => {
    console.log("CONNECTION PROPS", connections);
    console.log(connections.google_ads);
    console.log(integrationsIds[0].connected);
  }, [connections, integrationsIds]);

  const activeIntegrationsIds = integrationsIds.filter(integration => integration.active === true);
  // const ecommerceIntegrations = activeIntegrationsIds.filter(integration => integration.type === "ecommerce");
  const anunciosIntegrations = useMemo(() => activeIntegrationsIds.filter(integration => integration.type === "anuncios"), [activeIntegrationsIds, connections]);
  const emailIntegrations = activeIntegrationsIds.filter(integration => integration.type === "eMailMarketing");
  const planilhasIntegrations = activeIntegrationsIds.filter(integration => integration.type === "planilhas");

  return (
    <>
      {stores.length > 0 ?
        <div>
          <div>
            <div className="mt-[60px]">
              <h2 id="anuncios" className="h5 pb-8">Anúncios:</h2>
              <div className="grid grid-cols-2 gap-6">
                {anunciosIntegrations.map((integration, index) => (
                  <IntegrationBox
                    key={index}
                    id={integration.id}
                    name={integration.name}
                    locked={integration.locked}
                    validation={integration.validation}
                    connected={integration.connected}
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
                    connected={integration.connected}
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