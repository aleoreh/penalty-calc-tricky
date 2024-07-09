import { ApplyUserSettingsUseCase, CalculatorStoreRepo } from "../domain"
import calculatorShed from "../domain/calculator"

export function createApplyUserSettingsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): ApplyUserSettingsUseCase {
    return (partialSettings) => {
        const calculator = calculatorStoreRepo.getCalculator()
        const newCalculator = calculatorShed.setUserSettings({
            ...calculator.userSettings,
            ...partialSettings,
        })(calculator)
        calculatorStoreRepo.setCalculator(newCalculator)
    }
}
