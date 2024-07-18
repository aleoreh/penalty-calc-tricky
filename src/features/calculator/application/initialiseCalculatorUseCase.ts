import { CreateInitialiseCalculatorUseCase } from "../domain"
import { initCalculator } from "../domain/calculator"
import calculatorConfigShed from "../domain/calculator-config"
import { UserSettings } from "../domain/userSettings"

const defaultUserSettings: UserSettings = {
    legalEntity: "natural",
    distributionMethod: "fifo",
}

export function createInitialiseCalculatorUseCase(): CreateInitialiseCalculatorUseCase {
    return (theStateConstants) => {
        const calculatorConfig = calculatorConfigShed.fromTheStateConstants(
            defaultUserSettings.legalEntity,
            theStateConstants
        )

        const calculator = initCalculator(
            new Date(),
            calculatorConfig,
            defaultUserSettings.distributionMethod
        )

        return calculator
    }
}

