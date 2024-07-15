import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useRegularText } from "../../components/useRegularText"
import {
    Debt,
    Payoff,
    useDebtItemFormat,
    usePayoffItemFormat,
} from "../../hooks/useDebtFormat"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type PayoffItemProps = {
    payoff: Payoff
}

function PayoffItem({ payoff }: PayoffItemProps) {
    const payoffItemFormat = usePayoffItemFormat(payoff)
    const regularText = useRegularText()
    return (
        <Stack direction="row" justifyContent="flex-end">
            <Typography {...regularText}>
                {payoffItemFormat.paymentDate}
            </Typography>
            <Typography {...regularText}>
                {payoffItemFormat.repaymentAmount}
            </Typography>
        </Stack>
    )
}

type DebtItemProps = {
    debt: Debt
}

export function DebtItem({ debt }: DebtItemProps) {
    const text = useRegularText()
    const debtItemView = useDebtItemFormat(debt)

    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between">
                    <Typography {...text}>{debtItemView.period}</Typography>
                    <Typography {...text}>{debtItemView.amount}</Typography>
                </Stack>
                <Typography {...text} align="right">
                    {debtItemView.dueDate}
                </Typography>
                {debt.payoffs.map((payoff, i) => (
                    <PayoffItem key={i} payoff={payoff} />
                ))}
                <Divider />
                <Typography {...text} align="right">
                    {debtItemView.remainder}
                </Typography>
            </CardContent>
            <CardActions></CardActions>
        </Card>
    )
}

