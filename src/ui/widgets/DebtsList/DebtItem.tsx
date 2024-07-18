import { Delete, Edit } from "@mui/icons-material"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { kopekToRuble } from "@/lib/kopek"
import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { ModalForm } from "@/ui/components/ModalForm"
import { useAppDatePicker } from "@/ui/components/useAppDatePicker"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useModalForm } from "@/ui/components/useModalForm"
import { useRegularText } from "@/ui/components/useRegularText"
import { useValidatedTextField } from "@/ui/components/useValidatedTextField"
import {
    Debt,
    Payoff,
    useDebtItemFormat,
    usePayoffItemFormat,
} from "@/ui/hooks/useDebtFormat"
import { useAppForm } from "@/ui/validation/useAppForm"
import { validationDecoders } from "@/ui/validation/validationDecoders"

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
    deleteDebt: () => void
    updateDebt: (dueDate: Date, amountRub: number) => void
}

export function DebtItem({ debt, deleteDebt, updateDebt }: DebtItemProps) {
    const debtItemView = useDebtItemFormat(debt)

    const confirmDeleteDialog = useConfirmDialog()

    // ~~~~~~~~~~~~~~~~ форма ~~~~~~~~~~~~~~~~ //

    const dueDateInput = useAppDatePicker({
        name: "due-date",
        initialValue: dayjs(debt.dueDate),
    })
    const debtAmountInput = useValidatedTextField({
        name: "debt-amount",
        decoder: validationDecoders.decimal,
        initialValue: JSON.stringify(kopekToRuble(debt.amount)),
    })
    const editDebtForm = useAppForm([dueDateInput, debtAmountInput])

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const editModalForm = useModalForm()

    const handleEditSubmit = () => {
        if (!dueDateInput.value || debtAmountInput.validatedValue === undefined)
            return

        updateDebt(dueDateInput.value.toDate(), debtAmountInput.validatedValue)
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack gap={1}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>{debtItemView.period}</Typography>
                            <Typography variant="h6">
                                {debtItemView.amount}
                            </Typography>
                        </Stack>
                        <Typography align="left">
                            {debtItemView.dueDate}
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            {debt.payoffs.length > 0 && (
                                <>
                                    <Typography>Оплачено:</Typography>
                                    <Stack>
                                        {debt.payoffs.map((payoff, i) => (
                                            <PayoffItem
                                                key={i}
                                                payoff={payoff}
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Stack>
                        <Divider />
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <Typography>Остаток долга:</Typography>
                            <Typography
                                align="right"
                                variant="h6"
                                fontWeight="700"
                            >
                                {debtItemView.remainder}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton
                        onClick={() => {
                            editDebtForm.reset()
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
                title="Удалить долг?"
                submit={deleteDebt}
                submitMessage="Да, удалить!"
            />
            <ModalForm
                {...editModalForm}
                {...editDebtForm}
                title="Изменение долга"
                submit={handleEditSubmit}
            >
                <Stack>
                    <DatePicker
                        {...dueDateInput.input}
                        label={"Начало просрочки"}
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

