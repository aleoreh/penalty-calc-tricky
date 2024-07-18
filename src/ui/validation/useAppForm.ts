interface Field {
    hasError?: boolean
    isInitial: boolean
    reset: () => void
    clear: () => void
}

type AppForm = {
    isValid: boolean
    isInitial: boolean
    reset: () => void
    clear: () => void
}

export function useAppForm(fields: Field[], forcedInvalid?: boolean): AppForm {
    return {
        isValid:
            forcedInvalid === true
                ? false
                : fields.every((x) =>
                      x.hasError !== undefined ? !x.hasError : true
                  ),
        isInitial: fields.every((x) => x.isInitial),
        reset: () => fields.forEach((x) => x.reset()),
        clear: () => fields.forEach((x) => x.clear()),
    }
}
