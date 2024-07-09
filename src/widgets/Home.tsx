import { useState } from "react"
import { useApplication as useApplicationUseCases } from "../contexts/applicationContextHook"
import domain from "../features/calculator/domain"
import { billingPeriodFromDate } from "../lib/billing-period"
import { kopekFromRuble } from "../lib/kopek"

function useCalculator() {
    const { useCases } = useApplicationUseCases()
    const [calculator, setCalculator] = useState(useCases.getCalculator())

    const dispatch = (callback: () => void) => {
        callback()
        setCalculator(useCases.getCalculator())
    }

    return {
        calculator,
        dispatch,
        ...useCases,
    }
}

export function Home() {
    const { calculator, dispatch, addDebt } = useCalculator()

    const clickHandler = () => {
        const debtPeriod = billingPeriodFromDate(new Date("2024-01-01"))
        const dueDate = domain.getDefaultDueDate(debtPeriod, 10)

        dispatch(() => addDebt(debtPeriod, dueDate, kopekFromRuble(1000)))
    }

    return (
        <div onClick={clickHandler}>
            <pre>{JSON.stringify(calculator, undefined, 4)}</pre>
        </div>
    )
}

