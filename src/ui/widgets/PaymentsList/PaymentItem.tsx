import { Delete, Edit } from "@mui/icons-material"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Dayjs } from "dayjs"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import { kopekFromRuble } from "@/lib/kopek"
import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { ModalForm } from "@/ui/components/ModalForm"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useModalForm } from "@/ui/components/useModalForm"
import { useRegularText } from "@/ui/components/useRegularText"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import { useValidatedInput } from "@/ui/components/useValidatedInput"
import { Payment, usePaymentFormat } from "@/ui/hooks/usePaymentFormat"
import { validationDecoders } from "@/ui/validation/validationDecoders"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type PaymentItemProps = {
    payment: Payment
    deletePayment: () => void
    updatePayment: (params: Partial<Payment>) => void
}

export function PaymentItem({
    payment,
    deletePayment,
    updatePayment,
}: PaymentItemProps) {
    const [inputPaymentDate, setInputPaymentDate] = useState<Dayjs | null>(null)
    const [inputPaymentPeriod, setInputPaymentPeriod] = useState<Dayjs | null>(
        null
    )

    const paymentItemFormat = usePaymentFormat(payment)

    const text = useRegularText()

    const confirmDeleteDialog = useConfirmDialog()

    const editModalForm = useModalForm()

    const paymentAmountInput = useValidatedInput("", validationDecoders.decimal)
    const editPaymentValidatedForm = useValidatedForm([paymentAmountInput])

    const submitEditPayment = () => {
        if (
            inputPaymentDate === null ||
            paymentAmountInput.validatedValue === undefined
        ) {
            return
        }

        updatePayment({
            date: inputPaymentDate.toDate(),
            amount: kopekFromRuble(paymentAmountInput.validatedValue),
            period: inputPaymentPeriod
                ? billingPeriodFromDate(inputPaymentPeriod.toDate())
                : undefined,
        })

        setInputPaymentDate(null)
        setInputPaymentPeriod(null)
    }

    const handleInputPaymentPeriodChange = () => {
        throw new Error("handleInputPaymentChange not implemented")
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack direction="row">
                        <Typography {...text}>
                            {paymentItemFormat.date}
                        </Typography>
                        <Typography {...text}>
                            {paymentItemFormat.amount}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton
                        onClick={() => {
                            editPaymentValidatedForm.reset()
                            editModalForm.open()
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton onClick={confirmDeleteDialog.open}>
                        <Delete />
                    </IconButton>
                </CardActions>
            </Card>
            <ModalConfirmDialog
                {...confirmDeleteDialog}
                title="Удалить оплату?"
                submit={deletePayment}
                submitMessage="Да, удалить!"
            />
            <ModalForm
                title="Изменение оплаты"
                {...editModalForm}
                {...editPaymentValidatedForm}
                submit={submitEditPayment}
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
                        onChange={handleInputPaymentPeriodChange}
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
