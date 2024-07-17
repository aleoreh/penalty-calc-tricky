import { TextFieldProps } from "@mui/material/TextField"
import { Decoder } from "decoders"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type CommonInput = {
    hasError: boolean
    isInitial: boolean
    reset: () => void
}

type ValidatedInput<T> = {
    tag: "ValidatedInput"
    validatedValue: T | undefined
    input: Pick<TextFieldProps, "onChange" | "value" | "error" | "helperText">
} & CommonInput

type ArbitraryInput<T> = {
    tag: "ArbitratyInput"
    validatedValue: T
    input: Pick<TextFieldProps, "value" | "error" | "helperText"> & {
        onChange?: (value: T | null | undefined) => void
    }
} & CommonInput

export function useArbitraryInput<T>(initialValue: T): ArbitraryInput<T> {
    const validatedInitial = initialValue

    const [isInitial, setIsInitial] = useState(
        initialValue === undefined ? true : false
    )
    const [validatedValue, setValidatedValue] = useState(validatedInitial)
    const [value, setValue] = useState(initialValue)

    return {
        tag: "ArbitratyInput",
        input: {
            value,
            onChange: (x: T | null | undefined) => {
                if (x === null || x === undefined) return

                setIsInitial(false)
                setValue(x)
                setValidatedValue(x)
            },
        },
        hasError: false,
        validatedValue,
        isInitial,
        reset: () => {
            setValidatedValue(validatedInitial)
            setIsInitial(initialValue === undefined ? true : false)
            initialValue !== undefined && setValue(initialValue)
        },
    }
}

export function useValidatedInput<T>(
    initialValue: string | number | undefined,
    decoder: Decoder<T>
): ValidatedInput<T> {
    const validatedInitial = decoder.decode(initialValue).value ?? undefined

    const [isInitial, setIsInitial] = useState(
        initialValue === undefined ? true : false
    )
    const [validatedValue, setValidatedValue] = useState<T | undefined>(
        validatedInitial
    )
    const [helperText, setHelperText] = useState<string | undefined>(undefined)
    const [error, setError] = useState(false)
    const [value, setValue] = useState(initialValue ?? "")

    return {
        tag: "ValidatedInput",
        input: {
            onChange: (evt) => {
                if (evt.target.value === undefined || evt.target.value === null)
                    return
                setIsInitial(false)
                setValue(evt.target.value)
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
            value,
        },
        validatedValue,
        hasError: error,
        isInitial,
        reset: () => {
            setValidatedValue(validatedInitial)
            setHelperText(undefined)
            setError(false)
            setIsInitial(initialValue === undefined ? true : false)
            initialValue !== undefined && setValue(initialValue)
        },
    }
}

