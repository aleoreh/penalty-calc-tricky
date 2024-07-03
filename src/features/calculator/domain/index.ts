import { CalculatorConfig, LegalEntity } from "./calculator-config"
import { TheStateConstants } from "./types"

// ~~~~~~~~~~~~~~ use cases ~~~~~~~~~~~~~~ //

export type GetCalculatorConfigUseCase = (
    date: Date,
    legalEntity: LegalEntity
) => Promise<CalculatorConfig>

export { fromTheStateConstants } from "./calculator-config"

// ~~~~~~~~~~~~~ repositories ~~~~~~~~~~~~ //

export type TheStateConstantsRepo = {
    getTheStateConstants: () => Promise<TheStateConstants>
}

