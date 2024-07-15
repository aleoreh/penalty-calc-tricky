import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useApplication } from "../contexts/applicationContextHook"
import { getKeyRate } from "../features/calculator/domain/calculator"
import { isLegalEntity } from "../features/calculator/domain/legalEntity"
import { isDistributionMethod } from "../features/calculator/domain/distributionMethod"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useUserSettings() {
    const { useCases } = useApplication()
    type Params = Parameters<typeof useCases.applyUserSettings>
    const [calculator, setCalculator] = useState(useCases.getCalculator())

    const viewDistributionMethod =
        calculator.userSettings.distributionMethod === "fifo"
            ? "FIFO"
            : "Первым - период оплаты"

    const viewLegalEntity =
        calculator.userSettings.legalEntity === "natural"
            ? "Физические лица"
            : "Юридические лица"

    const keyRate = getKeyRate(calculator, calculator.calculationDate)

    const viewKeyRate = new Intl.NumberFormat("ru-RU", {
        style: "percent",
        minimumFractionDigits: 2,
    }).format(keyRate)

    return {
        settings: {
            ...calculator.userSettings,
            keyRate,
        },
        view: {
            distributionMethod: viewDistributionMethod,
            legalEntity: viewLegalEntity,
            keyRate: viewKeyRate,
        },
        setSettings: ([settings]: Params) => {
            useCases.applyUserSettings(settings)
            setCalculator(useCases.getCalculator())
        },
        isLegalEntity,
        isDistributionMethod,
    }
}

