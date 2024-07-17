import { Decoder } from "decoders"
import { useState } from "react"

type ValidatedTextFieldParams<T> = {
    name: string
    decoder: Decoder<T>
    initialValue?: string
}

type ValidatedTextFieldInputProps = {
    name?: string
    value?: string
    onChange?: (evt: { target: { value: unknown } }) => void
    error?: boolean
    helperText?: string
}

type ValidatedTextField<T> = {
    input: ValidatedTextFieldInputProps
    validatedValue: T | undefined
    isInitial: boolean
    hasError: boolean
    reset: () => void
    clear: () => void
}

export function useValidatedTextField<T>({
    name,
    initialValue,
    decoder,
}: ValidatedTextFieldParams<T>): ValidatedTextField<T> {
    const [rawValue, setRawValue] = useState(initialValue)
    const [isInitial, setIsInitial] = useState(true)

    const decodedRawValue = decoder.decode(rawValue)

    const onChange = (evt: { target: { value: unknown } }) => {
        setRawValue(JSON.stringify(evt.target.value))
        setIsInitial(false)
    }

    const reset = () => {
        setRawValue(initialValue)
        setIsInitial(true)
    }

    const clear = () => {
        setRawValue(undefined)
        setIsInitial(true)
    }

    return {
        input: {
            name,
            value: rawValue,
            onChange,
            error: !decodedRawValue.ok,
            helperText: decodedRawValue.error
                ? decodedRawValue.error?.text ??
                  `Некорректное значение поля: ${name}`
                : "",
        },
        validatedValue: decodedRawValue.value ?? undefined,
        isInitial,
        hasError: !decodedRawValue.ok,
        reset,
        clear,
    }
}
