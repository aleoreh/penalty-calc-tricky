import { useEffect, useState } from "react"
import { ApplicationProvider } from "./contexts/applicationContext"
import { createInitialiseCalculatorUseCase } from "./features/calculator/application/initialiseCalculatorUseCase"
import { Calculator } from "./features/calculator/domain/calculator"
import { createCalculatorStoreSimpleRepo } from "./features/calculator/infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "./features/calculator/infrastructure/theStateConstantsStaticRepo"
import { Home } from "./pages/Home"
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
])

function createDependencies(calculator: Calculator) {
    return {
        calculatorStoreRepo: createCalculatorStoreSimpleRepo(calculator),
    }
}

function App() {
    const [calculator, setCalculator] = useState<Calculator | undefined>(
        undefined
    )

    useEffect(() => {
        theStateConstantsRepo
            .getTheStateConstants()
            .then(createInitialiseCalculatorUseCase())
            .then(setCalculator)
    }, [])

    return (
        calculator && (
            <ApplicationProvider dependencies={createDependencies(calculator)}>
                <div className={styles.app}>
                    <RouterProvider router={router} />
                </div>
            </ApplicationProvider>
        )
    )
}

export default App

