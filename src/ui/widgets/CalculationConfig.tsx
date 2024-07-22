import { ExpandMore } from "@mui/icons-material"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Stack,
    Typography,
} from "@mui/material"
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useCalculatorConfig } from "@/ui/hooks/useCalculatorConfig"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function CalculationConfig() {
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
                <Stack>
                    <Divider />
                    <Typography>{view.daysToPay}</Typography>
                    <Typography>{view.deferredDaysCount}</Typography>
                    <Stack direction="row">
                        <Typography>Действующие моратории:</Typography>
                        <Stack>
                            {view.moratoriums.map((moratorium, i) => (
                                <Typography key={i}>{moratorium}</Typography>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

