import Box from "@mui/material/Box"
import Container from "@mui/material/Container"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { UserSettings } from "../widgets/UserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function Home() {
    return (
        <Box>
            <Container>
                <UserSettings />
            </Container>
        </Box>
    )
}

