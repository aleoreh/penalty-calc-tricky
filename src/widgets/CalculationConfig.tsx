import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Typography from "@mui/material/Typography"
import { useSectionTitle } from "../components/useSectionTitle"
import { useCalculatorConfig } from "../hooks/useCalculatorConfig"
import { useRegularText } from "../components/useRegularText"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function CalculationConfig() {
    const title = useSectionTitle()
    const text = useRegularText()
    const { view } = useCalculatorConfig()
    return (
        <Accordion>
            <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ExpandMore />}
            >
                <Typography {...title}>Константы</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography {...text}>{view.daysToPay}</Typography>
                <Typography {...text}>{view.deferredDaysCount}</Typography>
                {view.moratoriums.map((moratorium, i) => (
                    <Typography key={i} {...text}>
                        {moratorium}
                    </Typography>
                ))}
            </AccordionDetails>
        </Accordion>
    )
}
