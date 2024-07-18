import { Delete, Edit } from "@mui/icons-material"
import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import { kopekFromRuble, kopekToRuble } from "@/lib/kopek"
import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { ModalForm } from "@/ui/components/ModalForm"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useModalForm } from "@/ui/components/useModalForm"
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

    const confirmDeleteDialog = useConfirmDialog()

    const editModalForm = useModalForm()

    // ~~~~~~~~~~~~~~~~ форма ~~~~~~~~~~~~~~~~ //

    const paymentAmountInput = useValidatedInput(
        String(kopekToRuble(payment.amount)),
        validationDecoders.decimal
    )
    const paymentDateInput = useArbitraryInput(dayjs(payment.date))
    const paymentPeriodInput = useArbitraryInput(
        payment.period !== undefined ? dayjs(payment.period) : null
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
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Stack direction="row" flexGrow={1}>
                            <Typography>{paymentItemFormat.date}</Typography>
                            <Typography>{paymentItemFormat.period}</Typography>
                        </Stack>
                        <Typography variant="h6">
                            {paymentItemFormat.amount}
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

