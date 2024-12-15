import { Box, Container, Stack, Typography } from "@mui/material"

export function AppFooter() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                backgroundColor: "secondary.main",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <Container>
                <Stack>
                    <Typography
                        variant="caption"
                        fontFamily="monospace"
                        align="right"
                    >
                        Motie Alex, 2024
                    </Typography>
                </Stack>
            </Container>
        </Box>
    )
}
