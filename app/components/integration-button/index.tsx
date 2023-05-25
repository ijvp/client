import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import styles from "./styles.css";
import { Form } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

interface IIntegrationButton {
  connected: boolean;
  locked: boolean;
  onConnectionChange: (connectionState: boolean) => void;
  storeName: string;
  storeintegrationId: string;
}

export default function IntegrationButton({ connected, locked, onConnectionChange, storeintegrationId, storeName }: IIntegrationButton) {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = async () => {
    setIsConnected(true)
    onConnectionChange(true)
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
    onConnectionChange(false)
  }

  const action = isConnected === false ? 'disconnect' : 'authorize';

  useEffect(() => {
    setIsConnected(connected)
  }, [connected]);

  return (
    <Form method="post" action="/integrations">
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="store" value={storeName} />
      <input type="hidden" name="platform" value={storeintegrationId} />
      <button disabled={locked} onClick={isConnected === false ? handleConnect : handleDisconnect} className={`flex justify-center min-w-[145px] items-center h-[60px] p-4 rounded-lg ${isConnected === false ? 'bg-purple text-white border-0' : 'bg-transparent hover:bg-black-secondary text-purple border border-purple box-border'} hover:transition-colors ease-in-out duration-300 ${isConnected === false && locked === false ? 'hover:bg-dark-purple' : ''}`}>
        {locked === false ?
          <span className="h text-base font-bold">
            {isConnected === true ? "Desconectar" : "Conectar"}
          </span>
          :
          <img src="/images/block.png" alt="blocked" />
        }
      </button>
    </Form>
  )
}