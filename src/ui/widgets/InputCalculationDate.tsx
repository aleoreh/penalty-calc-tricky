import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs, { Dayjs } from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useCalculator } from "../hooks/useCalculator"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function InputCalculationDate() {
    const { calculator, setCalculationDate } = useCalculator()

    const calculationDate = dayjs(calculator.calculationDate)

    const handleChange = (value: Dayjs | null) => {
        value !== null && setCalculationDate(value.toDate())
    }

    return (
        <DatePicker
            label="Дата расчета"
            value={calculationDate}
            onChange={handleChange}
            sx={{ alignSelf: "flex-start" }}
        />
    )
}
