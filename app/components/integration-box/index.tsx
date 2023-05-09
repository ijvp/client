import { useEffect, useState } from "react";
import IntegrationButton from "../integration-button";
import styles from "./styles.css";

export default function IntegrationBox({ connected }: { connected: boolean }) {

    return (
        <div className="flex flex-row bg-black-bg border border-solid border-black-secondary rounded px-6 py-10 max-w-min text-white justify-between min-w-full">
            <div className="flex flex-row gap-4 justify-center items-center">
                <div className="flex w-[44.57px] h-[40px] justify-center items-center">
                    <span>@</span>
                </div>
                <span className="text-xl font-normal leading-[30px] h-[30px]">Integração</span>
                <div className={`w-4 h-4 ${connected === true ? 'bg-green' : 'bg-red'} rounded-full`}></div>
            </div>
            <IntegrationButton 
                connected={connected}
            />
        </div>
    )
}