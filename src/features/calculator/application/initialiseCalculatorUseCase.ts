import { InitialiseCalculatorUseCase, TheStateConstantsRepo } from "../domain"
import { initCalculator } from "../domain/calculator"
import calculatorConfigShed from "../domain/calculator-config"
import { UserSettings } from "../domain/userSettings"

const defaultUserSettings: UserSettings = {
    legalEntity: "natural",
    distributionMethod: "fifo",
}

export function createInitialiseCalculatorsUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
): InitialiseCalculatorUseCase {
    return async () => {
        const constants = await theStateConstantsRepo.getTheStateConstants()

        const calculatorConfig = calculatorConfigShed.fromTheStateConstants(
            defaultUserSettings.legalEntity,
            constants
        )

        const calculator = initCalculator(
            new Date(),
            calculatorConfig,
            defaultUserSettings.distributionMethod
        )

        return calculator
    }
}
