import {
    CalculatorConfig,
    LegalEntity,
    fromTheStateConstants,
} from "./calculator-config"
import { TheStateConstants } from "./types"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

export type GetCalculatorConfigUseCase = (
    date: Date,
    legalEntity: LegalEntity
) => Promise<CalculatorConfig>

// ~~~~~~~~~~~~~ repositories ~~~~~~~~~~~~ //

export type TheStateConstantsRepo = {
    getTheStateConstants: () => Promise<TheStateConstants>
}

// ~~~~~~~~~~~~~~ functions ~~~~~~~~~~~~~~ //

export const domain = {
    fromTheStateConstants,
}

export default domain

