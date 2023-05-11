import type { LinksFunction } from "@remix-run/node";
import { useState } from "react";
import styles from "./styles.css";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: styles }]
}

export default function IntegrationButton({ connected, onConnectionChange }: { connected: boolean, onConnectionChange: (connectionState: boolean) => void }) {
    const [isConnected, setIsConnected] = useState(false)

    const doConnection = () => {
        setIsConnected(true)
        onConnectionChange(true)
    }

    const doDisconnection = () => {
        setIsConnected(false)
        onConnectionChange(false)
    }

    return (
        <button onClick={isConnected === false ? doConnection : doDisconnection} className={`w-[200px] h-[60px] py-[18px] rounded-lg ${isConnected === false ? 'bg-purple hover:bg-dark-purple text-white border-0' : 'bg-transparent hover:bg-black-secondary text-purple border border-purple box-border'} hover:transition-colors ease-in-out duration-300`}>
            <span className="h text-base font-bold">{isConnected === true ? "Desconectar" : "Conectar"}</span>
        </button>
    )
}