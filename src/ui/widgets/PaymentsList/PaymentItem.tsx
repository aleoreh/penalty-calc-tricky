import { Delete } from "@mui/icons-material"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useRegularText } from "@/ui/components/useRegularText"
import { Payment, usePaymentFormat } from "@/ui/hooks/usePaymentFormat"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type PaymentItemProps = {
    payment: Payment
    deletePayment: () => void
}

export function PaymentItem({ payment, deletePayment }: PaymentItemProps) {
    const paymentItemFormat = usePaymentFormat(payment)

    const text = useRegularText()

    const confirmDeleteDialog = useConfirmDialog()

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
        </>
    )
}
