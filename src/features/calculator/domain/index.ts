import { Calculator } from "./calculator"
import {
    CalculatorConfig,
    LegalEntity,
    fromTheStateConstants,
} from "./calculator-config"
import { TheStateConstants } from "./types"
import { UserSettings } from "./userSettings"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

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

