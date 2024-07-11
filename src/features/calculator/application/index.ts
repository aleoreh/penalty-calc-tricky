import { CalculatorStoreRepo } from "../domain"
import { createAddDebtUseCase } from "./addDebtUseCase"
import { createInitialiseCalculatorUseCase } from "./initialiseCalculatorUseCase"
import { createGetCalculatorUseCase } from "./getCalculatorUseCase"
import { createApplyUserSettingsUseCase } from "./applyUserSettingsUseCase"
import { createSetCalculationDateUseCase } from "./setCalculationDateUseCase"
import { createUpdateDebtUseCase } from "./updateDebtUseCase"
import { createGetCalculatorDebtUseCase } from "./getCalculatorDebtUseCase"
import { createDeleteDebtUseCase } from "./deleteDebtUseCase"
import { createAddPaymentUseCase } from "./addPaymentUseCase"
import { createUpdatePaymentUseCase } from "./updatePaymentUseCase"
import { createDeletePaymentUseCase } from "../deletePaymentUseCase"
import { createClearDebtsUseCase } from "./clearDebtsUseCase"
import { createClearPaymentsUseCase } from "./clearPaymentsUseCase"

export function createCalculatorUseCases(
    calculatorStoreRepo: CalculatorStoreRepo
) {
    return {
        createCalculatorFromConstants: createInitialiseCalculatorUseCase(),
        getCalculator: createGetCalculatorUseCase(calculatorStoreRepo),
        getDebt: createGetCalculatorDebtUseCase(calculatorStoreRepo),
        addDebt: createAddDebtUseCase(calculatorStoreRepo),
        applyUserSettings: createApplyUserSettingsUseCase(calculatorStoreRepo),
        setCalculationDate:
            createSetCalculationDateUseCase(calculatorStoreRepo),
        updateCalculatorDebt: createUpdateDebtUseCase(calculatorStoreRepo),
        deleteCalculatorDebt: createDeleteDebtUseCase(calculatorStoreRepo),
        clearCalculatorDebts: createClearDebtsUseCase(calculatorStoreRepo),
        addPayment: createAddPaymentUseCase(calculatorStoreRepo),
        updatePayment: createUpdatePaymentUseCase(calculatorStoreRepo),
        deleteCalculatorPayment:
            createDeletePaymentUseCase(calculatorStoreRepo),
        clearCalculatorPayments:
            createClearPaymentsUseCase(calculatorStoreRepo),
    }
}

