/**
 * Массив validatedInputs сформируйте через хук `useValidatedInput`
 */
export function useValidatedForm(
    validatedInputs: {
        hasError: boolean
        isInitial: boolean
        reset: () => void
    }[],
    forcedInvalid?: boolean
) {
    return {
        isValid: forcedInvalid === true
            ? false
            : validatedInputs.every((x) => !x.hasError),
        isInitial: validatedInputs.every((x) => x.isInitial),
        reset: () => validatedInputs.forEach((x) => x.reset()),
    }
}

