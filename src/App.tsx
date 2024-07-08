import { useEffect, useState } from "react"
import { ApplicationProvider } from "./contexts/applicationContext"
import { createCreateCalculatorFromConstantsUseCase } from "./features/calculator/application/createCalculatorUseCase"
import { Calculator } from "./features/calculator/domain/calculator"
import { createCalculatorStoreSimpleRepo } from "./features/calculator/infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "./features/calculator/infrastructure/theStateConstantsStaticRepo"
import { Home } from "./widgets/Home"

function createDependencies(calculator: Calculator) {
    return {
        calculatorStoreRepo: createCalculatorStoreSimpleRepo(calculator),
    }
}

const createCalculatorFromConstants =
    createCreateCalculatorFromConstantsUseCase()

function App() {
    const [calculator, setCalculator] = useState<Calculator | undefined>(
        undefined
    )

    useEffect(() => {
        theStateConstantsRepo
            .getTheStateConstants()
            .then(createCalculatorFromConstants)
            .then(setCalculator)
    }, [])

    return (
        calculator && (
            <ApplicationProvider dependencies={createDependencies(calculator)}>
                <Home />
            </ApplicationProvider>
        )
    )
}

export default App

