import { CalculatorConfig } from "./calculator-config"
import { Debt, Payment } from "./types"

type DistributionMethod = "fifo" | "byPaymentPeriod"

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
    distributionMethod: DistributionMethod
}
function setCalculatorConfig(config: CalculatorConfig) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            config,
        })
}

export const calculatorShed = {
    setConfig: setCalculatorConfig,
}

export default calculatorShed
