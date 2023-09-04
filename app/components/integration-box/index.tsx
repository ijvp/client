import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { storeIndexAtom, storesAtom } from "~/utils/atoms";
import IntegrationButton from "../integration-button";

export function InfoButton({ accountId }) {
    const [openModal, setOpenModal] = useState(false);
    
    const handleInfoClicked = () => {
        setOpenModal(!openModal);
    };
    
    const handleCloseModal = (event: MouseEvent<HTMLElement>) => {
        if (event.target.id !== 'info-modal' && event.target.id !== 'info-button') {
            setOpenModal(false);
        }
    };

    useEffect(() => {
		document.body.addEventListener("click", handleCloseModal);
		return () => {
			document.body.removeEventListener("click", handleCloseModal);
		};
	}, [openModal]);

    return (
        <div className="relative">
            {openModal && (
                <div
                    className="
                    absolute top-0 right-0 -translate-y-[125%] translate-x-[72px]
                    w-max
                    max-w-[100vw]
                    bg-white 
                    text-black text-center 
                    rounded-md
                ">
                    <p className="w-full p-2 text-sm" id="info-modal">{ accountId }</p>
                </div>
            )}
            <img onClick={() => handleInfoClicked()} id="info-button" src="/icons/info.svg" alt="Informação de conta"/>
        </div>
    )
};

export default function IntegrationBox({ name, validation, id, locked, connected, platform, connectionId, connectionName, service }: { name: string, validation: string, id: string, locked: boolean, connected: boolean }) {
    const [stores] = useAtom(storesAtom);
    const [selectedIndex] = useAtom(storeIndexAtom);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
		const handleInfoClicked = (event: MouseEvent<HTMLElement>) => {
			if (event.currentTarget.id === "info-button") {
				setOpenModal(!openModal);
			}
		};
		document.getElementById("info-button")?.addEventListener("click", handleInfoClicked);

		const handleCloseModal = (event: MouseEvent<HTMLElement>) => {
			const infoButtonElement = document.getElementById("info-button");
			if (
				infoButtonElement &&
				infoButtonElement.contains(event.target)
			) {
				// Do nothing if the click event is within the info button
				return;
			}

			setOpenModal(false);
		};

		document.body.addEventListener("click", handleCloseModal);
		return () => {
			document.getElementById("info-button")?.removeEventListener("click", handleInfoClicked);
			document.body.removeEventListener("click", handleCloseModal);
		};
	}, [openModal]);

    return (
        <div className="flex flex-col gap-2 items-start bg-black-bg border border-solid border-black-secondary rounded p-5 md:px-6 md:py-10 max-w-min text-white min-w-full">
            <div className="flex flex-row gap-2 w-full items-center justify-between">
                <div className="relative flex flex-row gap-2 md:gap-4 justify-center items-center">
                    <div className={`w-2 md:w-4 h-2 md:h-4 aspect-square ${connected ? 'bg-green-light' : 'bg-red-light'} rounded-full`}></div>
                    <div className="flex h-10 justify-center items-center">
                        <img className="w-auto md:min-w-[40px] md:min-h-[40px] h-6 md:h-10" src={`/images/${id}-icon.png`} alt={`${id} icon`} />
                    </div>
                    <span className="w-fit text-md md:text-xl font-normal leading-[24px] md:leading-[30px]">{name}</span>
                </div>
                <div className="flex gap-4 items-center">
                    {connectionId && (
                        <InfoButton accountId={`${id === "facebook-ads" ? connectionId.slice(4) : connectionId} / ${connectionName}`}/>
                    )}
                    <IntegrationButton
                        connected={connected}
                        locked={locked}
                        storeName={stores[selectedIndex].myshopify_domain}
                        storeIntegrationId={id}
                        service={service}
                        platform={platform}
                    />
                </div>
            </div>
        </div>
    )
}