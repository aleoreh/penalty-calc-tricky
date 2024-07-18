import { BillingPeriod } from "@/lib/billing-period"
import { Kopek } from "@/lib/kopek"
import { Calculator } from "./calculator"
import { fromTheStateConstants } from "./calculator-config"
import { Debt, getDefaultDueDate } from "./debt"
import { Payment, PaymentId } from "./payment"
import { KeyRate, TheStateConstants } from "./types"
import { UserSettings } from "./userSettings"
import { CalculationResult } from "./calculation-result"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

export type CreateInitialiseCalculatorUseCase = (
    theStateConstants: TheStateConstants
) => Calculator

export type GetCalculatorUseCase = () => Calculator

export type SetKeyRateUseCase = (keyRate: KeyRate) => void

export type ApplyUserSettingsUseCase = (
    userSettings: Partial<UserSettings>
) => void

export type SetCalculationDateUseCase = (calculationDate: Date) => void

export type GetDebtUseCase = (
    debtPeriod: BillingPeriod
) => Debt | undefined

export type AddDebtUseCase = (
    debtPeriod: BillingPeriod,
    dueDate: Date,
    debtAmount: Kopek
) => void

export type UpdateDebtUseCase = (
    params: {
        dueDate?: Date
        amount?: Kopek
    },
    debt: Debt
) => void

export type DeleteDebtUseCase = (debtPeriod: BillingPeriod) => void

export type ClearDebtsUseCase = () => void

export type GetPaymentUseCase = (id: PaymentId) => Payment | undefined

export type AddPaymentUseCase = (
    date: Date,
    amount: Kopek,
    period?: BillingPeriod
) => void

export type UpdatePaymentUseCase = (
    params: {
        date?: Date
        amount?: Kopek
        period?: BillingPeriod
    },
    payment: Payment
) => void

export type DeletePaymentUseCase = (id: PaymentId) => void

export type ClearPaymentsUseCase = () => void

export type RunCalculationUseCase = () => CalculationResult[]

// ~~~~~~~~~~~~~ repositories ~~~~~~~~~~~~ //

export type TheStateConstantsRepo = {
    getTheStateConstants: () => Promise<TheStateConstants>
}

export type CalculatorStoreRepo = {
    setCalculator: (calculator: Calculator) => void
    getCalculator: () => Calculator
}

// ~~~~~~~~~~~~~~ functions ~~~~~~~~~~~~~~ //

export const domain = {
    fromTheStateConstants,
    getDefaultDueDate,
}

export default domain

