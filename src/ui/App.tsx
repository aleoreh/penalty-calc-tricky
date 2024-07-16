import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { ruRU } from "@mui/x-date-pickers/locales"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import isBetween from "dayjs/plugin/isBetween"
import localizedFormat from "dayjs/plugin/localizedFormat"
import { useEffect, useState } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

dayjs.locale("ru")
dayjs.extend(isBetween)
dayjs.extend(localizedFormat)

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { createInitialiseCalculatorUseCase } from "../features/calculator/application/initialiseCalculatorUseCase"
import { Calculator } from "../features/calculator/domain/calculator"
import createCalculatorStoreRepo from "../features/calculator/infrastructure/calculatorStoreReduxRepo"
import theStateConstantsRepo from "../features/calculator/infrastructure/theStateConstantsStaticRepo"
import { ApplicationProvider } from "./contexts/applicationContext"
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
        calculatorStoreRepo: createCalculatorStoreRepo(calculator),
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
            <ApplicationProvider
                dependencies={createDependencies(calculator)}
                calculator={calculator}
                setCalculator={setCalculator}
            >
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

