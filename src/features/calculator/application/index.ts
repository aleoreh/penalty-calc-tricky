import { CalculatorStoreRepo } from "../domain"
import { createAddDebtUseCase } from "./addDebtUseCase"
import { createInitialiseCalculatorUseCase } from "./initialiseCalculatorUseCase"
import { createGetCalculatorUseCase } from "./getCalculatorUseCase"
import { createApplyUserSettingsUseCase } from "./applyUserSettingsUseCase"
import { createSetCalculationDateUseCase } from "./setCalculationDateUseCase"
import { createUpdateDebtUseCase } from "./updateDebtUseCase"

export function createCalculatorUseCases(
    calculatorStoreRepo: CalculatorStoreRepo
) {
    return {
        createCalculatorFromConstants: createInitialiseCalculatorUseCase(),
        getCalculator: createGetCalculatorUseCase(calculatorStoreRepo),
        addDebt: createAddDebtUseCase(calculatorStoreRepo),
        applyUserSettings: createApplyUserSettingsUseCase(calculatorStoreRepo),
        setCalculationDate:
            createSetCalculationDateUseCase(calculatorStoreRepo),
        updateCalculatorDebt: createUpdateDebtUseCase(calculatorStoreRepo),
    }
}

