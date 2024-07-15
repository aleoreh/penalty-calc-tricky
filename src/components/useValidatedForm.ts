export function useValidatedForm(
    validatedInputs: {
        hasError: boolean
        isInitial: boolean
        reset: () => void
    }[]
) {
    return {
        isValid: validatedInputs.every((x) => !x.hasError),
        isInitial: validatedInputs.every((x) => x.isInitial),
        reset: () => validatedInputs.forEach((x) => x.reset()),
    }
}

