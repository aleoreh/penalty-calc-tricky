import { pipe } from "@mobily/ts-belt"
import domain, {
    CalculatorStoreRepo,
    SetCalculationDateUseCase,
} from "../domain"
import calculatorShed from "../domain/calculator"

export function createSetCalculationDateUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): SetCalculationDateUseCase {
    return async (calculationDate, calculator) => {
        const calculatorConfig = domain.fromTheStateConstants(
            calculationDate,
            calculator.userSettings.legalEntity,
            calculator.config.theStateConstants
        )

        const newCalculator = pipe(
            calculator,
            calculatorShed.setConfig(calculatorConfig),
            calculatorShed.setCalculationDate(calculationDate)
        )

        await calculatorStoreRepo.setCalculator(newCalculator)
    }
}
