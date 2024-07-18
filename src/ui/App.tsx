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
            primary: {
                main: "#353535",
            },
            secondary: {
                main: "#c1c1c1",
            },
        },
        typography: {
            fontFamily: '"Noto Sans", "Helvetica", "Arial", sans-serif',
        },
        shape: {
            borderRadius: 0,
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
                    disableGutters: true,
                },
            },
            MuiButton: {
                defaultProps: {
                    variant: "outlined",
                },
            },
            MuiCard: {
                defaultProps: {
                    variant: "outlined",
                },
                styleOverrides: {
                    root: {
                        borderColor: "#eee",
                    },
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

function App() {
    const [calculator, setCalculator] = useState<Calculator | undefined>(
        undefined
    )
    const [dependencies, setDependencies] = useState<
        ReturnType<typeof createDependencies> | undefined
    >(undefined)

    useEffect(() => {
        theStateConstantsRepo
            .getTheStateConstants()
            .then(createInitialiseCalculatorUseCase())
            .then(setCalculator)
    }, [])

    useEffect(() => {
        if (dependencies !== undefined || calculator === undefined) return

        setDependencies(createDependencies(calculator))
    }, [calculator, dependencies])

    const createDependencies = (calculator: Calculator) => {
        return {
            calculatorStoreRepo: createCalculatorStoreRepo(calculator),
        }
    }

    return (
        calculator &&
        dependencies && (
            <ApplicationProvider
                dependencies={dependencies}
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

