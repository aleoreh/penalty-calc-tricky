import {
    type GetCalculatorConfigUseCase,
    type TheStateConstantsRepo,
    fromTheStateConstants,
} from "../domain"

export function createGetCalculatorConfigUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
): GetCalculatorConfigUseCase {
    return async (date, legalEntity) => {
        const theStateConstants =
            await theStateConstantsRepo.getTheStateConstants()

        return fromTheStateConstants(date, legalEntity, theStateConstants)
    }
}
