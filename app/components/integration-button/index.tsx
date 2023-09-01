import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import styles from "./styles.css";
import { Form, useSearchParams } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

interface IIntegrationButton {
  connected: boolean;
  locked: boolean;
  storeName: string;
  storeIntegrationId: string;
}

export default function IntegrationButton({ connected, locked, platform, storeIntegrationId, storeName, service }: IIntegrationButton) {
  const [isConnected, setIsConnected] = useState(false)
  const [searchParams] = useSearchParams();
  const store = searchParams.get("store");

  const action = isConnected ? 'disconnect' : 'authorize';

  const actionEndpoint = store ? `/integracoes?store=${searchParams.get("store")}` : "/integracoes";

  useEffect(() => {
    setIsConnected(connected)
  }, [connected]);

  return (
    <Form
      method="post"
      action={actionEndpoint}
    >
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="store" value={storeName} />
      <input type="hidden" name="platform" value={platform} />
      {service && <input type="hidden" name="service" value={service} />}
      <button
        disabled={locked}
        type="submit"
        // onClick={isConnected === false ? handleConnect : handleDisconnect}
        className={`flex items-center p-1.5 w-14 h-8 rounded-full menu-transition ${locked === true ? 'justify-center' : (isConnected ? 'bg-purple justify-end' : 'bg-gray justify-start')}`}>
        {locked === true ?
          <img src="/images/block.png" alt="blocked" />
          :
          <div className="w-5 h-5 bg-white rounded-full">
            
          </div>
        }
      </button>
    </Form >
  )
}