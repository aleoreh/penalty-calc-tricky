import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { ruRU } from "@mui/x-date-pickers/locales"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import "dayjs/locale/ru"
import { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ApplicationProvider } from "./contexts/applicationContext"
import { createInitialiseCalculatorUseCase } from "./features/calculator/application/initialiseCalculatorUseCase"
import { Calculator } from "./features/calculator/domain/calculator"
import { createCalculatorStoreSimpleRepo } from "./features/calculator/infrastructure/calculatorStoreSimpeRepo"
import { theStateConstantsStaticRepo as theStateConstantsRepo } from "./features/calculator/infrastructure/theStateConstantsStaticRepo"
import { ErrorPage } from "./pages/ErrorPage"
import { Home } from "./pages/Home"
import { AppHeader } from "./widgets/AppHeader"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const theme = createTheme(
    {
        palette: {
            primary: { main: "#1976d2" },
        },
        components: {
            MuiContainer: {
                defaultProps: {
                    maxWidth: "md",
                },
            },
            MuiStack: {
                defaultProps: {
                    useFlexGap: true,
                    gap: 2,
                },
            },
            MuiAccordion: {
                defaultProps: {
                    variant: "outlined",
                },
            },
        },
    },
    ruRU
)

theme.spacing(2)

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
                <ThemeProvider theme={theme}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ru"
                    >
                        <>
                            <CssBaseline />
                            <AppHeader />
                            <Box component="main">
                                <RouterProvider router={router} />
                            </Box>
                        </>
                    </LocalizationProvider>
                </ThemeProvider>
            </ApplicationProvider>
        )
    )
}

export default App

