import { ReactNode, createContext } from "react"
import { createCalculatorUseCases } from "../../features/calculator/application"
import { CalculatorStoreRepo } from "../../features/calculator/domain"
import { Calculator } from "../../features/calculator/domain/calculator"

type ApplicationContextType = {
    useCases: ReturnType<typeof createCalculatorUseCases>
    calculator: Calculator,
    setCalculator: (calculator: Calculator) => void
}

export const ApplicationContext = createContext<ApplicationContextType>(
    {} as ApplicationContextType
)

type ApplicationContextProviderProps = {
    dependencies: {
        calculatorStoreRepo: CalculatorStoreRepo
    }
    calculator: Calculator
    setCalculator: (calculator: Calculator) => void
    children: ReactNode
}

export function ApplicationProvider({
    dependencies,
    calculator,
    setCalculator,
    children,
}: ApplicationContextProviderProps) {
    const { calculatorStoreRepo } = dependencies
    return (
        <ApplicationContext.Provider
            value={{
                useCases: createCalculatorUseCases(calculatorStoreRepo),
                calculator,
                setCalculator
            }}
        >
            {children}
        </ApplicationContext.Provider>
    )
}

