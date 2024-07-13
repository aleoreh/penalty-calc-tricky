import { CssBaseline } from "@mui/material"
import { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import styles from "./App.module.css"
import { ApplicationProvider } from "./contexts/applicationContext"
import { createInitialiseCalculatorUseCase } from "./features/calculator/application/initialiseCalculatorUseCase"
import { Calculator } from "./features/calculator/domain/calculator"
import { createCalculatorStoreSimpleRepo } from "./features/calculator/infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "./features/calculator/infrastructure/theStateConstantsStaticRepo"
import { ErrorPage } from "./pages/ErrorPage"
import { Home } from "./pages/Home"
import { AppHeader } from "./widgets/AppHeader"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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
                <>
                    <CssBaseline />
                    <AppHeader />
                    <main className={styles.app}>
                        <RouterProvider router={router} />
                    </main>
                </>
            </ApplicationProvider>
        )
    )
}

export default App

