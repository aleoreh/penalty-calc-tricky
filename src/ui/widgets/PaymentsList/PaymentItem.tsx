import Card from "@mui/material/Card"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { Payment, usePaymentFormat } from "@/ui/hooks/usePaymentFormat"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useRegularText } from "../../components/useRegularText"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type PaymentItemProps = {
    payment: Payment
}

export function PaymentItem({ payment }: PaymentItemProps) {
    const paymentItemFormat = usePaymentFormat(payment)

    const text = useRegularText()

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
                <CardActions></CardActions>
            </Card>
        </>
    )
}
