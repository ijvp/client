import { useState } from "react";
import IntegrationButton from "../integration-button";

export default function IntegrationBox({ name, connected, id }: { name: string, id: string,connected: boolean }) {
    const [isConnected, setIsConnected] = useState(false)

    const handleConnectionChange = (connectionState: boolean) => {
        setIsConnected(connectionState)
    }

    return (
        <div className="flex flex-row bg-black-bg border border-solid border-black-secondary rounded px-6 py-10 max-w-min text-white justify-between min-w-full">
            <div className="flex flex-row gap-4 justify-center items-center">
                <div className="flex h-10 justify-center items-center">
                    <img className="min-w-[40px] min-h-[40px] h-10" src={ `/images/${id}-icon.png` } alt={`${id} icon`} />
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