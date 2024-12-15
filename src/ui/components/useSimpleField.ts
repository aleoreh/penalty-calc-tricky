import { useState } from "react"

type SimpleFieldParams<T> = {
    name: string
    initialValue?: T
}

type SimpleFieldInputProps = {
    name?: string
}

type SimpleField<T> = {
    input: SimpleFieldInputProps
    value: T | undefined
    isInitial: boolean
    reset: () => void
    clear: () => void
    setValue: (value: T | undefined) => void
}

export function useSimpleField<T>({
    name,
    initialValue,
}: SimpleFieldParams<T>): SimpleField<T> {
    const [innerValue, setInnerValue] = useState(initialValue)
    const [isInitial, setIsInitial] = useState(true)

    const reset = () => {
        setValue(initialValue)
        setIsInitial(true)
    }

    const clear = () => {
        setValue(undefined)
        setIsInitial(true)
    }

    const setValue = (value: T | undefined) => {
        setInnerValue(value)
        setIsInitial(false)
    }

    return {
        input: {
            name,
        },
        value: innerValue,
        isInitial,
        reset,
        clear,
        setValue,
    }
}
