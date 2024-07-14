import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { CalculationConfig } from "../widgets/CalculationConfig"
import { UserSettings } from "../widgets/UserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function Home() {
    return (
        <Box>
            <Container>
                <UserSettings />
                <CalculationConfig />
            </Container>
        </Box>
    )
}

