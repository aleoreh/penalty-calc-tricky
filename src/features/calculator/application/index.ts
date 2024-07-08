import { CalculatorStoreRepo } from "../domain"
import { createAddDebtUseCase } from "./addDebtUseCase"
import { createCreateCalculatorFromConstantsUseCase } from "./createCalculatorUseCase"
import { createGetCalculatorUseCase } from "./getCalculatorUseCase"

export function createCalculatorApplication(
    calculatorStoreRepo: CalculatorStoreRepo
) {
    return {
        createCalculatorFromConstants:
            createCreateCalculatorFromConstantsUseCase(),
        getCalculator: createGetCalculatorUseCase(calculatorStoreRepo),
        addDebt: createAddDebtUseCase(calculatorStoreRepo),
    }
}
