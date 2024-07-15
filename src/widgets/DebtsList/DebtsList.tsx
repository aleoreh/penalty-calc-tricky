import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import kopekShed from "@/lib/kopek"
import { ModalForm } from "../../components/ModalForm"
import { useModalForm } from "../../components/useModalForm"
import { useSectionTitle } from "../../components/useSectionTitle"
import { useValidatedForm } from "../../components/useValidatedForm"
import { useValidatedInput } from "../../components/useValidatedInput"
import { useDebts } from "../../hooks/useDebts"
import { validationDecoders } from "../../validation/validationDecoders"
import { DebtItem } from "./DebtItem"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function DebtsList() {
    // const { debts } = useDebts()
    const debts: ReturnType<typeof useDebts>["debts"] = [
        {
            amount: kopekShed.asKopek(100000),
            dueDate: new Date(),
            payoffs: [],
            period: billingPeriodFromDate(new Date()),
        },
    ]
    const title = useSectionTitle()

    const debtAmountInput = useValidatedInput(
        undefined,
        validationDecoders.decimal
    )

    const modalForm = useModalForm()
    const validatedForm = useValidatedForm([debtAmountInput])

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography {...title}>Долги</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {debts.map((x, i) => (
                        <DebtItem key={i} debt={x} />
                    ))}
                </AccordionDetails>
                <AccordionActions>
                    <Button type="button" onClick={modalForm.open}>
                        Добавить
                    </Button>
                    <Button>Добавить несколько</Button>
                </AccordionActions>
            </Accordion>
            <ModalForm title="Добавить долг" {...modalForm} {...validatedForm}>
                <Stack>
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
