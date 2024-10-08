import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Dayjs } from "dayjs"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import { kopekFromRuble } from "@/lib/kopek"
import { ModalForm } from "@/ui/components/ModalForm"
import { useModalForm } from "@/ui/components/useModalForm"
import { useSectionTitle } from "@/ui/components/useSectionTitle"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import { useValidatedInput } from "@/ui/components/useValidatedInput"
import { usePayments } from "@/ui/hooks/usePayments"
import { validationDecoders } from "@/ui/validation/validationDecoders"
import { PaymentItem } from "./PaymentItem"
import { PaymentsClipboardLoader } from "../PaymentsClipboardLoader"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function PaymentsList() {
    const [inputPaymentDate, setInputPaymentDate] = useState<Dayjs | null>(null)
    const [inputPaymentPeriod, setInputPaymentPeriod] = useState<Dayjs | null>(
        null
    )
    const [isLoadFormOpened, setIsLoadFormOpened] = useState(false)

    const {
        payments,
        addPayment,
        addPayments,
        deletePayment,
        updatePayment,
        clearPayments,
    } = usePayments()

    const sectionTitle = useSectionTitle()

    const modalForm = useModalForm()

    const paymentAmountInput = useValidatedInput("", validationDecoders.decimal)
    const addPaymentValidatedForm = useValidatedForm([paymentAmountInput])

    const submitAddPayment = () => {
        if (
            inputPaymentDate === null ||
            paymentAmountInput.validatedValue === undefined
        ) {
            return
        }

        addPayment(
            inputPaymentDate.toDate(),
            kopekFromRuble(paymentAmountInput.validatedValue),
            inputPaymentPeriod
                ? billingPeriodFromDate(inputPaymentPeriod.toDate())
                : undefined
        )

        setInputPaymentDate(null)
        setInputPaymentPeriod(null)
    }

    const submitAddPayments = (
        paymentsData: Array<{
            date: Date
            amount: number
            period?: Date
        }>
    ) => {
        clearPayments(),
            addPayments(
                paymentsData.map((x) => ({
                    date: x.date,
                    amount: kopekFromRuble(x.amount),
                    period:
                        x.period !== undefined
                            ? billingPeriodFromDate(x.period)
                            : undefined,
                }))
            )
    }

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography {...sectionTitle}>Оплата</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        {payments.map((payment) => (
                            <PaymentItem
                                key={payment.id}
                                payment={payment}
                                deletePayment={() => deletePayment(payment.id)}
                                updatePayment={(params) => {
                                    updatePayment(params, payment)
                                }}
                            />
                        ))}
                    </Stack>
                </AccordionDetails>
                <AccordionActions>
                    <Button type="button" onClick={modalForm.open}>
                        Добавить
                    </Button>
                    <Button onClick={() => setIsLoadFormOpened(true)}>
                        Загрузить несколько
                    </Button>
                </AccordionActions>
            </Accordion>
            <PaymentsClipboardLoader
                submit={submitAddPayments}
                isOpened={isLoadFormOpened}
                closeForm={() => setIsLoadFormOpened(false)}
            />
            <ModalForm
                title="Добавить оплату"
                {...modalForm}
                {...addPaymentValidatedForm}
                submit={submitAddPayment}
            >
                <Stack>
                    <DatePicker
                        label={"Дата платежа"}
                        value={inputPaymentDate}
                        onChange={setInputPaymentDate}
                    />
                    <DatePicker
                        label={"Период"}
                        value={inputPaymentPeriod}
                        onChange={setInputPaymentPeriod}
                        views={["year", "month"]}
                        openTo="year"
                    />
                    <TextField
                        {...paymentAmountInput.input}
                        label="Сумма"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

