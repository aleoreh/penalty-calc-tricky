import calculatorConfigShed from "../domain/calculator-config"
import { CalculatorConfig } from "../domain/types"
import { theStateConfigStaticRepo as theStateConfigRepo } from "../infrastructure/calculatorConfigStaticRepo"

export { type CalculatorConfig } from "../domain/types"

export async function getCalculatorConfig(
    date: Date
): Promise<CalculatorConfig> {
    const theStateConfig = await theStateConfigRepo.getTheStateConfig()

    return calculatorConfigShed.fromTheStateConfig(date, theStateConfig)
}
