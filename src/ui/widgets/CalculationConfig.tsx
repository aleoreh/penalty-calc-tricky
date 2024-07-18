import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useRegularText } from "@/ui/components/useRegularText"
import { useCalculatorConfig } from "@/ui/hooks/useCalculatorConfig"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function CalculationConfig() {
    const text = useRegularText()
    const { view } = useCalculatorConfig()
    return (
        <Accordion sx={{ flex: 1 }}>
            <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ExpandMore />}
            >
                <Typography>Константы</Typography>
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

