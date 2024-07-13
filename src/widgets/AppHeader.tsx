import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function AppHeader() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Container>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Калькулятор пеней ЖКХ
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}

