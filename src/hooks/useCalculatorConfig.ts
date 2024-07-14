import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "../contexts/applicationContextHook"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useCalculatorConfig() {
    const { useCases } = useApplication()
    const [calculator] = useState(useCases.getCalculator())

    const daysToPay = `Дней на оплату: ${calculator.config.daysToPay}`

    const deferredDaysCount = `Дней отсрочки: ${calculator.config.deferredDaysCount}`

    const moratoriums = calculator.config.moratoriums.map(
        ([from, to]) =>
            `с ${new Intl.DateTimeFormat("ru-RU").format(
                from
            )} по ${new Intl.DateTimeFormat("ru-RU").format(to)}`
    )

    return {
        config: {
            ...calculator.config,
        },
        view: {
            daysToPay,
            deferredDaysCount,
            moratoriums,
        },
    }
}
