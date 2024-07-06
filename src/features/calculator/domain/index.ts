import { Calculator, DistributionMethod } from "./calculator"
import {
    CalculatorConfig,
    LegalEntity,
    fromTheStateConstants,
} from "./calculator-config"
import { Debt } from "./debt"
import { TheStateConstants } from "./types"
import { UserSettings } from "./userSettings"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

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

export type SetCalculationDateUseCase = (
    calculationDate: Date,
    calculator: Calculator
) => Promise<void>

export type AddDebtUseCase = (
    debt: Debt,
    calculator: Calculator
) => Promise<void>

// ~~~~~~~~~~~~~ repositories ~~~~~~~~~~~~ //

export type TheStateConstantsRepo = {
    getTheStateConstants: () => Promise<TheStateConstants>
}

export type CalculatorStoreRepo = {
    setCalculator: (calculator: Calculator) => Promise<void>
    getCalculator: () => Promise<Calculator | undefined>
}

// ~~~~~~~~~~~~~~ functions ~~~~~~~~~~~~~~ //

export const domain = {
    fromTheStateConstants,
}

export default domain

