import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { storeIndexAtom, storesAtom } from "~/utils/atoms";
import IntegrationButton from "../integration-button";

export default function IntegrationBox({ name, validation, id, locked }: { name: string, validation:string, id: string, locked: boolean }) {
    const [isConnected, setIsConnected] = useState(false)
    const [stores, setStores] = useAtom(storesAtom);
    const [selectedIndex, setSelectedIndex] = useAtom(storeIndexAtom);

    const handleConnectionChange = (connectionState: boolean) => {
        setIsConnected(connectionState)
    }

    useEffect(() => {
        setIsConnected(!!stores[selectedIndex]?.[validation])
	}, [selectedIndex, validation, stores]);

    return (
        <div className="flex flex-row bg-black-bg border border-solid border-black-secondary rounded px-6 py-10 max-w-min text-white justify-between min-w-full">
            <div className="flex flex-row gap-4 justify-center items-center">
                <div className="flex h-10 justify-center items-center">
                    <img className="min-w-[40px] min-h-[40px] h-10" src={`/images/${id}-icon.png`} alt={`${id} icon`} />
                </div>
                <span className="text-xl font-normal leading-[30px] h-[30px]">{name}</span>
                <div className={`w-4 h-4 ${isConnected === true ? 'bg-green-light' : 'bg-red-light'} rounded-full`}></div>
            </div>
            <IntegrationButton
                connected={isConnected}
                locked={locked}
                onConnectionChange={handleConnectionChange}
                storeName={stores[selectedIndex]?.name}
                storeintegrationId={id}
            />
        </div>
    )
}