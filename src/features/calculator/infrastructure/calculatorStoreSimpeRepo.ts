import { CalculatorStoreRepo } from "../domain"
import { Calculator } from "../domain/calculator"

let store: Calculator | undefined

async function setCalculator(calculator: Calculator) {
    store = calculator
}

async function getCalculator() {
    return store
}

export const calculatorStoreSimpeRepo: CalculatorStoreRepo = {
    setCalculator,
    getCalculator,
}
