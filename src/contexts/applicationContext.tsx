import { ReactNode, createContext } from "react"
import { createCalculatorApplication } from "../features/calculator/application"
import { CalculatorStoreRepo } from "../features/calculator/domain"

type ApplicationContextType = {
    calculatorApplication: ReturnType<typeof createCalculatorApplication>
}

export const ApplicationContext = createContext<ApplicationContextType>(
    {} as ApplicationContextType
)

type ApplicationContextProviderProps = {
    dependencies: {
        calculatorStoreRepo: CalculatorStoreRepo
    }
    children: ReactNode
}

export function ApplicationProvider({
    dependencies,
    children,
}: ApplicationContextProviderProps) {
    const { calculatorStoreRepo } = dependencies
    return (
        <ApplicationContext.Provider
            value={{
                calculatorApplication:
                    createCalculatorApplication(calculatorStoreRepo),
            }}
        >
            {children}
        </ApplicationContext.Provider>
    )
}
