import { useAtom } from "jotai";
import IntegrationBox from "../integration-box";
import { connectionsAtom, storesAtom } from "~/utils/atoms";

export default function IntegrationContainer() {
  const [stores] = useAtom(storesAtom);
  const [connections] = useAtom(connectionsAtom);

  interface IIntegrationsId {
    id: string;
    name: string;
    platform: string,
    type: string;
    active: boolean;
    validation: string;
    locked: boolean;
    connected?: boolean,
    connectionId?: string,
    connectionName?: string
  };

  const integrationsIds: IIntegrationsId[] = [
    {
      id: "google-ads",
      name: "Google Ads",
      platform: "google",
      service: "google-ads",
      type: "anuncios",
      active: true,
      validation: 'google_client',
      locked: false,
      connected: !!connections?.google_ads,
      connectionId: connections?.google_ads?.id,
      connectionName: connections?.google_ads?.name
    },
    {
      id: "facebook-ads",
      name: "Facebook Ads",
      platform: "facebook",
      type: "anuncios",
      validation: 'facebook_business',
      active: true,
      locked: false,
      connected: connections?.facebook_ads,
      connectionId: connections?.facebook_ads?.id,
      connectionName: connections?.facebook_ads?.name
    },
    {
      id: "tiktok-ads",
      name: "Tiktok Ads",
      platform: "tiktok",
      type: "anuncios",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      platform: "google",
      service: "google-analytics",
      type: "analise",
      active: true,
      validation: 'google_client',
      locked: false,
      connected: !!connections?.google_analytics,
      connectionId: connections?.google_analytics?.id,
      connectionName: connections?.google_analytics?.name
    },
    {
      id: "pinterest-ads",
      name: "Pinterest Ads",
      platform: "pinterest",
      type: "anuncios",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "activeCampaign",
      name: "Active Campaign",
      platform: "active-campaign",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "getResponse",
      name: "Get Response",
      platform: "getresponse",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "reportana",
      name: "Reportana",
      platform: "reportana",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "mailChimp",
      name: "MailChimp",
      platform: "mailchimp",
      type: "eMailMarketing",
      validation: '',
      active: false,
      locked: true
    },
    {
      id: "arquivoCSV",
      name: "Arquivo CSV",
      platform: "arquivo-csv",
      type: "planilhas",
      validation: '',
      active: true,
      locked: true
    },
    {
      id: "googleSheets",
      name: "Google Sheets",
      platform: "google-sheets",
      type: "planilhas",
      validation: '',
      active: true,
      locked: true
    }
  ];

  const activeIntegrationsIds = integrationsIds.filter(integration => integration.active === true);
  const anunciosIntegrations = activeIntegrationsIds.filter(integration => integration.type === "anuncios");
  const analiseIntegrations = activeIntegrationsIds.filter(integration => integration.type === "analise");
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
                    platform={integration.platform}
                    locked={integration.locked}
                    validation={integration.validation}
                    connected={!!integration?.connected}
                    connectionId={integration.connectionId}
                    connectionName={integration.connectionName}
                    service={integration.service}
                  />
                ))}
              </div>
            </div>
            <div className="mt-[60px]">
              <h2 id="analise" className="h5 pb-8">Análise:</h2>
              <div className="grid grid-cols-2 gap-6">
                {analiseIntegrations.map((integration, index) => (
                  <IntegrationBox
                    key={index}
                    id={integration.id}
                    name={integration.name}
                    platform={integration.platform}
                    locked={integration.locked}
                    validation={integration.validation}
                    connected={!!integration?.connected}
                    connectionId={integration.connectionId}
                    connectionName={integration.connectionName}
                    service={integration.service}
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
                    platform={integration.platform}
                    locked={integration.locked}
                    validation={integration.validation}
                    connected={!!integration?.connected}
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
                    platform={integration.platform}
                    locked={integration.locked}
                    validation={integration.validation}
                    connected={!!integration?.connected}
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