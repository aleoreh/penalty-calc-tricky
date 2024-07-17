import { Delete, Edit } from "@mui/icons-material"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import { kopekFromRuble, kopekToRuble } from "@/lib/kopek"
import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { ModalForm } from "@/ui/components/ModalForm"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useModalForm } from "@/ui/components/useModalForm"
import { useRegularText } from "@/ui/components/useRegularText"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import {
    useArbitraryInput,
    useValidatedInput,
} from "@/ui/components/useValidatedInput"
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
    const paymentItemFormat = usePaymentFormat(payment)

    const text = useRegularText()

    const confirmDeleteDialog = useConfirmDialog()

    const editModalForm = useModalForm()

    // ~~~~~~~~~~~~~~~~ форма ~~~~~~~~~~~~~~~~ //

    const paymentAmountInput = useValidatedInput(
        String(kopekToRuble(payment.amount)),
        validationDecoders.decimal
    )
    const paymentDateInput = useArbitraryInput(dayjs(payment.date))
    const paymentPeriodInput = useArbitraryInput(
        payment.period !== undefined ? dayjs(payment.period) : undefined
    )
    const editPaymentValidatedForm = useValidatedForm([
        paymentAmountInput,
        paymentDateInput,
        paymentPeriodInput,
    ])

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const submitEditPayment = () => {
        if (
            paymentDateInput.validatedValue === null ||
            paymentAmountInput.validatedValue === undefined
        ) {
            return
        }

        updatePayment({
            date: paymentDateInput.validatedValue.toDate(),
            amount: kopekFromRuble(paymentAmountInput.validatedValue),
            period: paymentPeriodInput.validatedValue
                ? billingPeriodFromDate(
                      paymentPeriodInput.validatedValue.toDate()
                  )
                : undefined,
        })
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
                        <Typography {...text}>
                            {paymentItemFormat.period}
                        </Typography>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton onClick={editModalForm.open}>
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
                        value={paymentDateInput.validatedValue}
                        onChange={paymentDateInput.input.onChange}
                    />
                    <DatePicker
                        label={"Период"}
                        value={paymentPeriodInput.validatedValue}
                        onChange={paymentPeriodInput.input.onChange}
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

