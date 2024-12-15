import { getKeyRate } from "@/features/calculator/domain/calculator"
import { isDistributionMethod } from "@/features/calculator/domain/distributionMethod"
import { isLegalEntity } from "@/features/calculator/domain/legalEntity"
import { useApplication } from "./useApplication"

export function useCalculationSettings() {
    const { calculator, dispatch, applyUserSettings } = useApplication()

    const setUserSettings = (
        ...params: Parameters<typeof applyUserSettings>
    ) => {
        dispatch(() => applyUserSettings(...params))
    }

    return {
        setUserSettings,
        legalEntity: calculator.config.legalEntity,
        distributionMethod: calculator.userSettings.distributionMethod,
        calculationKeyRate: getKeyRate(calculator, calculator.calculationDate),
        isLegalEntity,
        isDistributionMethod,
    }
}
