import { TextFieldProps } from "@mui/material/TextField"
import { Decoder } from "decoders"
import { ChangeEvent, useState } from "react"

type ValidatedTextFieldParams<T> = {
    name: string
    decoder: Decoder<T>
    initialValue?: string
}

type ValidatedTextField<T> = {
    input: TextFieldProps
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

    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setRawValue(evt.target.value)
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
