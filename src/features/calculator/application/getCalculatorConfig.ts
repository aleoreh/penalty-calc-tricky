import { TheStateConfigRepo } from "../domain"
import calculatorConfigShed, { LegalEntity } from "../domain/calculator-config"

export { type CalculatorConfig } from "../domain/calculator-config"

export function createGetCalculatorConfigUseCase(
    theStateConfigRepo: TheStateConfigRepo
) {
    return async (date: Date, legalEntity: LegalEntity) => {
        const theStateConfig = await theStateConfigRepo.getTheStateConfig()

        return calculatorConfigShed.fromTheStateConfig(
            date,
            legalEntity,
            theStateConfig
        )
    }
}
