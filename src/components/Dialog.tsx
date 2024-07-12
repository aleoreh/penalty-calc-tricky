import { Icon } from "@iconify/react/dist/iconify.js"
import { useRef } from "react"
import { useEscape } from "../hooks/useEscape"
import { useModalClose } from "../hooks/useModalClose"
import styles from "./Dialog.module.css"
import clsx from "clsx"

type DialogProps = {
    isOpened: boolean
    close: () => void
    children?: React.ReactNode
}

export function Dialog({ isOpened, close, children }: DialogProps) {
    const containerRef = useRef<HTMLDialogElement | null>(null)

    useEscape({ handleEscape: close })

    useModalClose({
        isOpened,
        setClosed: close,
        containerRef,
    })

    return (
        <div
            className={clsx(
                styles.dialogContainer,
                isOpened && styles.dialogContainerOpened,
                styles.dialogContainerAnimated,
            )}
        >
            <dialog
                ref={containerRef}
                className={styles.dialog}
                open={isOpened}
            >
                <button
                    className={styles.closeButton}
                    type="button"
                    onClick={close}
                >
                    <Icon
                        className={styles.icon}
                        icon="material-symbols-light:close"
                    />
                </button>
                <div>{children}</div>
            </dialog>
        </div>
    )
}
