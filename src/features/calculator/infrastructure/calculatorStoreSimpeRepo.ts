import { CalculatorStoreRepo } from "../domain"
import { Calculator } from "../domain/calculator"

export function createCalculatorStoreSimpleRepo(
    calculator: Calculator
): CalculatorStoreRepo {
    let value = calculator

    function setCalculator(calculator: Calculator) {
        value = calculator
    }

    function getCalculator() {
        return value
    }

    return {
        setCalculator,
        getCalculator,
    }
}

