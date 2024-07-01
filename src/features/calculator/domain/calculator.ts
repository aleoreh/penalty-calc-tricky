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
