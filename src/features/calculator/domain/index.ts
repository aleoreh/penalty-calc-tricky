import { BillingPeriod } from "@/lib/billing-period"
import { Kopek } from "@/lib/kopek"
import { Calculator, DistributionMethod } from "./calculator"
import {
    CalculatorConfig,
    LegalEntity,
    fromTheStateConstants,
} from "./calculator-config"
import { Debt, getDefaultDueDate } from "./debt"
import { TheStateConstants } from "./types"
import { UserSettings } from "./userSettings"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

export type CreateInitialiseCalculatorUseCase = (
    theStateConstants: TheStateConstants
) => Calculator

export type GetCalculatorUseCase = () => Calculator

export type ApplyUserSettingsUseCase = (
    userSettings: Partial<UserSettings>
) => void

export type SetCalculationDateUseCase = (calculationDate: Date) => void

export type AddDebtUseCase = (
    debtPeriod: BillingPeriod,
    dueDate: Date,
    debtAmount: Kopek
) => Promise<void>

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export type DeleteDebtUseCase = (
    debtPeriod: BillingPeriod
) => Promise<Calculator>

export type UpdateDebtUseCase = (
    params: {
        dueDate?: Date
        amount?: Kopek
    },
    debt: Debt
) => Promise<Calculator>

export type ConfigureCalculatorUseCase = (
    calculationDate: Date,
    legalEntity: LegalEntity,
    distributionMethod: DistributionMethod
) => Promise<void>

export type GetCalculatorConfigUseCase = (
    date: Date,
    legalEntity: LegalEntity
) => Promise<CalculatorConfig>

export type SetCalculatorConfigUseCase = (
    calculatorConfig: CalculatorConfig,
    calculator: Calculator
) => Promise<void>

export type SetUserSettingsUseCase = (
    userSettings: UserSettings,
    calculator: Calculator
) => Promise<void>

export type ClearDebtsUseCase = (calculator: Calculator) => Promise<void>

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

