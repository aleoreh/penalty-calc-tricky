import { CalculatorStoreRepo, GetCalculatorUseCase } from "../domain"

export function createGetCalculatorUseCase(
    calculatorStoreRepo: CalculatorStoreRepo
): GetCalculatorUseCase {
    return calculatorStoreRepo.getCalculator
}
