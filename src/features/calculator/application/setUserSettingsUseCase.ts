import { CalculatorStoreRepo, SetUserSettingsUseCase } from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetUserSettingsUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetUserSettingsUseCase {
    return async (userSettings, calculator) => {
        const newCalculator =
            calculatorShed.setUserSettings(userSettings)(calculator)

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
