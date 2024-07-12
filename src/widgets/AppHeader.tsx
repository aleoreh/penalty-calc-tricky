import { Icon } from "@iconify/react"
import { clsx } from "clsx"
import { Dialog } from "../components/Dialog"
import styles from "./AppHeader.module.css"
import { useState } from "react"

export function AppHeader() {
    const [isOpened, setIsOpened] = useState(false)

    const handleClick = () => {
        setIsOpened(true)
    }

    return (
        <div className={styles.appHeader}>
            <div className={clsx("container", styles.container)}>
                <h1>Калькулятор пеней ЖКХ</h1>
                <button title="Настройки" onClick={handleClick}>
                    <Icon icon="mdi-light:settings" />
                </button>
            </div>
            <Dialog isOpened={isOpened} close={() => setIsOpened(false)}>
                <h3>Children</h3>
            </Dialog>
        </div>
    )
}
