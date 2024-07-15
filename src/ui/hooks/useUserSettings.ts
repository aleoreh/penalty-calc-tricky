// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { getKeyRate } from "../../features/calculator/domain/calculator"
import {
    DistributionMethod,
    isDistributionMethod,
} from "../../features/calculator/domain/distributionMethod"
import {
    isLegalEntity,
    LegalEntity,
} from "../../features/calculator/domain/legalEntity"
import { useCalculator } from "./useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function useUserSettings() {
    const { calculator, dispatch, applyUserSettings } = useCalculator()

    const viewDistributionMethod = (distributionMethod: DistributionMethod) =>
        distributionMethod === "fifo"
            ? "Первым - ранее возникший"
            : "Первым - период оплаты"

    const viewLegalEntity = (legalEntity: LegalEntity) =>
        legalEntity === "natural" ? "Физические лица" : "Юридические лица"

    const keyRate = getKeyRate(calculator, calculator.calculationDate)

    const viewKeyRate = new Intl.NumberFormat("ru-RU", {
        style: "percent",
        minimumFractionDigits: 2,
    }).format(keyRate)

    const setSettings = (...params: Parameters<typeof applyUserSettings>) => {
        dispatch(() => applyUserSettings(...params))
    }

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
        setSettings,
        isLegalEntity,
        isDistributionMethod,
    }
}

