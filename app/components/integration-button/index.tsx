import styles from "./styles.css";

export default function IntegrationButton({ connected }: { connected: boolean }) {
        return (
        <button className="w-[200px] py-[18px] bg-purple rounded-lg">
            <span className="h text-base font-bold">{connected === true ? "Desconectar" : "Conectar"}</span>
        </button>
    )
}