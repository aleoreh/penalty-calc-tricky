import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { useAppTitle } from "../components/useAppTitle"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function AppHeader() {
    const title = useAppTitle()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Container>
                    <Toolbar>
                        <Typography {...title} sx={{ flexGrow: 1 }}>
                            Калькулятор пеней ЖКХ
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}

