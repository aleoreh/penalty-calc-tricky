import { TheStateConstantsRepo } from "../domain"

export function createGetTheStateConstantsUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
) {
    return async () => {
        return await theStateConstantsRepo.getTheStateConstants()
    }
}
