import styles from "./ErrorPage.module.css"

export function ErrorPage() {
    return (
        <div className={styles.errorPage}>
            <div className="container">
                <p>Такой страницы, к сожалению, нет</p>
                <a href="/">На главную</a>
            </div>
        </div>
    )
}
