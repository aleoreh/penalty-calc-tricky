import { useApplicationContext } from "../contexts/applicationContextHook"
import domain from "../features/calculator/domain"
import { billingPeriodFromDate } from "../lib/billing-period"
import { kopekFromRuble } from "../lib/kopek"

export function Home() {
    const { app } = useApplicationContext()
    const calculator = app.getCalculator()

    const clickHandler = () => {
        console.log("click")
        const debtPeriod = billingPeriodFromDate(new Date("2024-01-01"))
        const dueDate = domain.getDefaultDueDate(debtPeriod, 10)
        app.addDebt(debtPeriod, dueDate, kopekFromRuble(1000))
    }

    return (
        <div onClick={clickHandler}>
            <pre>{JSON.stringify(calculator, undefined, 4)}</pre>
        </div>
    )
}
