import { useApplication } from "./useApplication"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useCalculatorConfig() {
    const { calculator } = useApplication()

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

