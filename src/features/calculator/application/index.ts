import { CalculatorStoreRepo } from "../domain"
import { createAddDebtUseCase as createAddCalculatorDebtUseCase } from "./addDebtUseCase"
import { createInitialiseCalculatorUseCase } from "./initialiseCalculatorUseCase"
import { createGetCalculatorUseCase } from "./getCalculatorUseCase"
import { createApplyUserSettingsUseCase } from "./applyUserSettingsUseCase"
import { createSetCalculationDateUseCase } from "./setCalculationDateUseCase"
import { createUpdateDebtUseCase } from "./updateDebtUseCase"
import { createGetDebtUseCase } from "./getDebtUseCase"
import { createDeleteDebtUseCase } from "./deleteDebtUseCase"
import { createAddPaymentUseCase } from "./addPaymentUseCase"
import { createUpdatePaymentUseCase } from "./updatePaymentUseCase"
import { createClearDebtsUseCase } from "./clearDebtsUseCase"
import { createClearPaymentsUseCase } from "./clearPaymentsUseCase"
import { createDeletePaymentUseCase } from "./deletePaymentUseCase"
import { createSetCalculationKeyRateUseCase } from "./setCalculationKeyRateUseCase"
import { createRunCalculationUseCase } from "./runCalculationUseCase"

export function createCalculatorUseCases(
    calculatorStoreRepo: CalculatorStoreRepo
) {
    return {
        createCalculatorFromConstants: createInitialiseCalculatorUseCase(),
        getCalculator: createGetCalculatorUseCase(calculatorStoreRepo),
        getCalculatorDebt: createGetDebtUseCase(calculatorStoreRepo),
        addCalculatorDebt: createAddCalculatorDebtUseCase(calculatorStoreRepo),
        applyUserSettings: createApplyUserSettingsUseCase(calculatorStoreRepo),
        setCalculationDate:
            createSetCalculationDateUseCase(calculatorStoreRepo),
        setCalculationKeyRate:
            createSetCalculationKeyRateUseCase(calculatorStoreRepo),
        updateCalculatorDebt: createUpdateDebtUseCase(calculatorStoreRepo),
        deleteCalculatorDebt: createDeleteDebtUseCase(calculatorStoreRepo),
        clearCalculatorDebts: createClearDebtsUseCase(calculatorStoreRepo),
        addCalculatorPayment: createAddPaymentUseCase(calculatorStoreRepo),
        updateCalculatorPayment:
            createUpdatePaymentUseCase(calculatorStoreRepo),
        deleteCalculatorPayment:
            createDeletePaymentUseCase(calculatorStoreRepo),
        clearCalculatorPayments:
            createClearPaymentsUseCase(calculatorStoreRepo),
        runCalculation: createRunCalculationUseCase(calculatorStoreRepo),
    }
}

