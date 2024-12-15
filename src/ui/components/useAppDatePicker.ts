import { DatePickerProps } from "@mui/x-date-pickers"
import { Dayjs } from "dayjs"
import { useState } from "react"

type AppDatePickerParams = {
    name: string
    initialValue?: Dayjs | null | undefined
}

type AppDatePicker = {
    input: DatePickerProps<Dayjs>
    value: Dayjs | null | undefined
    isInitial: boolean
    reset: () => void
    clear: () => void
}

export function useAppDatePicker({
    name,
    initialValue,
}: AppDatePickerParams): AppDatePicker {
    const [value, setValue] = useState(initialValue)
    const [isInitial, setIsInitial] = useState(true)

    const onChange = (value: Dayjs | null) => {
        setValue(value)
        setIsInitial(false)
    }

    const reset = () => {
        setValue(initialValue)
        setIsInitial(true)
    }

    const clear = () => {
        setValue(null)
        setIsInitial(true)
    }

    return {
        input: {
            name,
            onChange,
            value,
        },
        value: value,
        isInitial,
        reset,
        clear,
    }
}
