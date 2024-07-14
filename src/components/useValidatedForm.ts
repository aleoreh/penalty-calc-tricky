import { TextFieldProps } from "@mui/material"
import { Decoder } from "decoders"
import { useState } from "react"

type ValidatedInput<T> = {
    input: TextFieldProps
    validatedValue: T | undefined
    validationError: string | undefined
    reset: () => void
}

export function useInput<T>(decoder: Decoder<T>): ValidatedInput<T> {
    const [validatedValue, setValidatedValue] = useState<T | undefined>(
        undefined
    )
    const [validationError, setValidationError] = useState<string | undefined>(
        undefined
    )
    const [error, setError] = useState(false)

    return {
        input: {
            onChange: (evt) => {
                if (evt.target.value === undefined || evt.target.value === null)
                    return
                const res = decoder.decode(evt.target.value)
                if (res.ok) {
                    setValidatedValue(res.value)
                    setValidationError(undefined)
                    setError(false)
                } else {
                    setValidatedValue(undefined)
                    setValidationError(
                        res.error.text ||
                            `Некорректное значение поля: ${evt.target.value}`
                    )
                    setError(true)
                }
            },
            error,
        },
        validatedValue,
        validationError,
        reset: () => {
            setValidatedValue(undefined)
            setValidationError(undefined)
            setError(false)
        },
    }
}

export function useValidatedForm(validatedInputs: { reset: () => void }[]) {
    return {
        reset: () => validatedInputs.forEach((x) => x.reset()),
    }
}
