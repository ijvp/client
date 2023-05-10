import { useEffect, useState } from "react";
import IntegrationButton from "../integration-button";
import styles from "./styles.css";

interface IIcon {
    url: string,
    alt: string
}

export default function IntegrationBox({ name, connected, icon }: { name: string, connected: boolean, icon: IIcon}) {
    const [isConnected, setIsConnected] = useState(false)

    const handleConnectionChange = (connectionState: boolean) => {
        setIsConnected(connectionState)
    }

    return (
        <div className="flex flex-row bg-black-bg border border-solid border-black-secondary rounded px-6 py-10 max-w-min text-white justify-between min-w-full">
            <div className="flex flex-row gap-4 justify-center items-center">
                <div className="flex w-[44.57px] h-[40px] justify-center items-center">
                    <img className="" src={icon.url === "" ? "https://img.icons8.com/?size=512&id=13718&format=png" : icon.url} alt={icon.alt} />
                </div>
                <span className="text-xl font-normal leading-[30px] h-[30px]">{ name }</span>
                <div className={`w-4 h-4 ${isConnected === true ? 'bg-green' : 'bg-red'} rounded-full`}></div>
            </div>
            <IntegrationButton 
                connected={connected}
                onConnectionChange={handleConnectionChange}
            />
        </div>
    )
}