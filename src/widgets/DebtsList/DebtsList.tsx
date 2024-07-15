import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { billingPeriodFromDate } from "@/lib/billing-period"
import kopekShed from "@/lib/kopek"
import { useSectionTitle } from "../../components/useSectionTitle"
import { useDebts } from "../../hooks/useDebts"
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
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography {...title}>Долги</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {debts.map((x, i) => (
                    <DebtItem key={i} debt={x} />
                ))}
            </AccordionDetails>
        </Accordion>
    )
}
