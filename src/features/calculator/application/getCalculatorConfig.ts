import { TheStateConstantsRepo } from "../domain"
import calculatorConfigShed, { LegalEntity } from "../domain/calculator-config"

export { type CalculatorConfig } from "../domain/calculator-config"

export function createGetCalculatorConfigUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
) {
    return async (date: Date, legalEntity: LegalEntity) => {
        const theStateConstants = await theStateConstantsRepo.getTheStateConstants()

        return calculatorConfigShed.fromTheStateConstants(
            date,
            legalEntity,
            theStateConstants
        )
    }
}
