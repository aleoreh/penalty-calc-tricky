import domain, {
    type GetCalculatorConfigUseCase,
    type TheStateConstantsRepo,
} from "../domain"

export function createGetCalculatorConfigUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
): GetCalculatorConfigUseCase {
    return async (date, legalEntity) => {
        const theStateConstants =
            await theStateConstantsRepo.getTheStateConstants()

        return domain.fromTheStateConstants(
            date,
            legalEntity,
            theStateConstants
        )
    }
}
