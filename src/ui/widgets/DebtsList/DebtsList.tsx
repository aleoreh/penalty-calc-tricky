import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DateValidationError } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs, { Dayjs } from "dayjs"
import { useMemo, useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import {
    BillingPeriod,
    billingPeriodFromDate,
    billingPeriodsEqual,
} from "@/lib/billing-period"
import { kopekFromRuble } from "@/lib/kopek"
import { ModalForm } from "@/ui/components/ModalForm"
import { useModalForm } from "@/ui/components/useModalForm"
import { useSectionTitle } from "@/ui/components/useSectionTitle"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import {
    useArbitraryInput,
    useValidatedInput,
} from "@/ui/components/useValidatedInput"
import { useCalculatorConfig } from "@/ui/hooks/useCalculatorConfig"
import { useDebt } from "@/ui/hooks/useDebt"
import { useDebts } from "@/ui/hooks/useDebts"
import { validationDecoders } from "@/ui/validation/validationDecoders"
import { DebtItem } from "./DebtItem"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function periodIsIn(periods: BillingPeriod[]) {
    return (period: Dayjs) =>
        periods.filter((x) =>
            billingPeriodsEqual(x, billingPeriodFromDate(period.toDate()))
        ).length > 0
}

export function DebtsList() {
    const { debts, addDebt, deleteDebt, updateDebt } = useDebts()

    const { getDefaultDueDate } = useDebt()
    const { config } = useCalculatorConfig()

    const [inputDebtPeriodError, setInputDebtPeriodError] =
        useState<DateValidationError | null>(null)

    // ~~~~~~~~~~~~~~~~ форма ~~~~~~~~~~~~~~~~ //

    const debtPeriodInput = useArbitraryInput<Dayjs | null>(null)
    const dueDateInput = useArbitraryInput<Dayjs | null>(null)
    const debtAmountInput = useValidatedInput("", validationDecoders.decimal)

    const validatedForm = useValidatedForm(
        [debtAmountInput],
        inputDebtPeriodError !== null
    )

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const modalForm = useModalForm()

    const periodErrorMessage = useMemo(() => {
        switch (inputDebtPeriodError) {
            case "shouldDisableMonth":
                return "Такой период уже есть в списке"
            default:
                return ""
        }
    }, [inputDebtPeriodError])

    const title = useSectionTitle()

    const handleInputDebtPeriodChange = (value: Dayjs | null) => {
        debtPeriodInput.input.onChange?.(value)
        if (value !== null) {
            dueDateInput.input.onChange?.(
                dayjs(
                    getDefaultDueDate(
                        billingPeriodFromDate(value.toDate()),
                        config.daysToPay
                    )
                )
            )
        }
    }

    const submitAddDebt = () => {
        if (
            debtPeriodInput.validatedValue === null ||
            dueDateInput.validatedValue === null ||
            debtAmountInput.validatedValue === undefined
        ) {
            return
        }

        addDebt(
            billingPeriodFromDate(debtPeriodInput.validatedValue.toDate()),
            dueDateInput.validatedValue.toDate(),
            kopekFromRuble(debtAmountInput.validatedValue)
        )

        // setInputDebtPeriod(null)
        setInputDebtPeriodError(null)
        // setInputDueDate(null)
    }

    const submitAddDebtAndContinue = () => {
        submitAddDebt()
        modalForm.open()
        handleInputDebtPeriodChange(
            debtPeriodInput.validatedValue?.add(1, "month") || null
        )
    }

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography {...title}>Долги</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        {debts.map((debt, i) => (
                            <DebtItem
                                key={i}
                                debt={debt}
                                deleteDebt={() => deleteDebt(debt.period)}
                                updateDebt={(dueDate, amountRub) =>
                                    updateDebt(
                                        {
                                            dueDate,
                                            amount: kopekFromRuble(amountRub),
                                        },
                                        debt
                                    )
                                }
                            />
                        ))}
                    </Stack>
                </AccordionDetails>
                <AccordionActions>
                    <Button type="button" onClick={modalForm.open}>
                        Добавить
                    </Button>
                    <Button>Добавить несколько</Button>
                </AccordionActions>
            </Accordion>
            <ModalForm
                title="Добавить долг"
                {...modalForm}
                {...validatedForm}
                submit={submitAddDebt}
                submitAndContinue={submitAddDebtAndContinue}
            >
                <Stack>
                    <DatePicker
                        label={"Период"}
                        value={debtPeriodInput.validatedValue}
                        onChange={handleInputDebtPeriodChange}
                        views={["year", "month"]}
                        openTo="year"
                        shouldDisableMonth={periodIsIn(
                            debts.map((x) => x.period)
                        )}
                        onError={setInputDebtPeriodError}
                        slotProps={{
                            textField: {
                                helperText: periodErrorMessage,
                            },
                        }}
                    />
                    <DatePicker
                        label={"Начало просрочки"}
                        value={dueDateInput.validatedValue}
                        onChange={dueDateInput.input.onChange}
                    />
                    <TextField
                        {...debtAmountInput.input}
                        label="Сумма"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

