import { clsx } from "clsx"
import styles from "./AppHeader.module.css"
import { Icon } from "@iconify/react"

export function AppHeader() {
    return (
        <div className={styles.appHeader}>
            <div className={clsx("container", styles.container)}>
                <h1>Калькулятор пеней ЖКХ</h1>
                <button title="Настройки">
                    <Icon icon="mdi-light:settings"/>
                </button>
            </div>
        </div>
    )
}
