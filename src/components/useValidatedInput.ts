import { TextFieldProps } from "@mui/material/TextField"
import { Decoder } from "decoders"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type ValidatedInput<T> = {
    input: TextFieldProps
    validatedValue: T | undefined
    hasError: boolean
    isInitial: boolean
    reset: () => void
}

export function useValidatedInput<T>(decoder: Decoder<T>): ValidatedInput<T> {
    const [isInitial, setIsInitial] = useState(true)
    const [validatedValue, setValidatedValue] = useState<T | undefined>(
        undefined
    )
    const [helperText, setHelperText] = useState<string | undefined>(undefined)
    const [error, setError] = useState(false)

    return {
        input: {
            onChange: (evt) => {
                if (evt.target.value === undefined || evt.target.value === null)
                    return
                setIsInitial(false)
                const res = decoder.decode(evt.target.value)
                if (res.ok) {
                    setValidatedValue(res.value)
                    setHelperText(undefined)
                    setError(false)
                } else {
                    setValidatedValue(undefined)
                    setHelperText(
                        res.error.text ||
                            `Некорректное значение поля: ${evt.target.value}`
                    )
                    setError(true)
                }
            },
            error,
            helperText,
        },
        validatedValue,
        hasError: error,
        isInitial,
        reset: () => {
            setValidatedValue(undefined)
            setHelperText(undefined)
            setError(false)
            setIsInitial(true)
        },
    }
}
