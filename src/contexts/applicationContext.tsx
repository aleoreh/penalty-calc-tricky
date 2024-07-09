import { ReactNode, createContext } from "react"
import { createCalculatorUseCases } from "../features/calculator/application"
import { CalculatorStoreRepo } from "../features/calculator/domain"

type ApplicationContextType = {
    useCases: ReturnType<typeof createCalculatorUseCases>
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
                useCases:
                    createCalculatorUseCases(calculatorStoreRepo),
            }}
        >
            {children}
        </ApplicationContext.Provider>
    )
}
