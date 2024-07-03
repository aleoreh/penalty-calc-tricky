import { TheStateConfigRepo } from "../domain"
import calculatorConfigShed from "../domain/calculator-config"

export { type CalculatorConfig } from "../domain/calculator-config"

export function createGetCalculatorConfigUseCase(
    theStateConfigRepo: TheStateConfigRepo
) {
    return async (date: Date) => {
        const theStateConfig = await theStateConfigRepo.getTheStateConfig()

        return calculatorConfigShed.fromTheStateConfig(date, theStateConfig)
    }
}
