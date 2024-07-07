import { CalculatorStoreRepo } from "../domain"
import { Calculator } from "../domain/calculator"

export function createCalculatorStoreSimpleRepo(
    calculator: Calculator
): CalculatorStoreRepo {
    let value = calculator

    async function setCalculator(calculator: Calculator) {
        value = calculator
    }

    async function getCalculator() {
        return value
    }

    return {
        setCalculator,
        getCalculator,
    }
}

