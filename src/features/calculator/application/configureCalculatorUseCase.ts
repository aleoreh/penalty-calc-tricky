import domain, {
    CalculatorStoreRepo,
    ConfigureCalculatorUseCase,
    TheStateConstantsRepo,
} from "../domain"
import calculatorShed, { DistributionMethod } from "../domain/calculator"

export function createConfigureCalculatorUseCase(
    theStateConstantsRepo: TheStateConstantsRepo,
    calculatorStoreRepo: CalculatorStoreRepo
): ConfigureCalculatorUseCase {
    return async (
        calculationDate,
        legalEntity,
        distributionMethod: DistributionMethod
    ) => {
        const theStateConstants =
            await theStateConstantsRepo.getTheStateConstants()

        const calculatorConfig = domain.fromTheStateConstants(
            calculationDate,
            legalEntity,
            theStateConstants
        )

        const calculator = calculatorShed.init(
            calculationDate,
            calculatorConfig,
            distributionMethod
        )

        await calculatorStoreRepo.setCalculator(calculator)
    }
}
