import { Edit } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { useRegularText } from "../components/useRegularText"
import { useUserSettings } from "../hooks/useUserSettings"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const { view } = useUserSettings()

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
        >
            <Typography {...userSettingsInfo}>
                {`${[
                    view.legalEntity,
                    view.distributionMethod,
                    view.keyRate,
                ].join("; ")}`}
            </Typography>
            <IconButton>
                <Edit />
            </IconButton>
        </Stack>
    )
}
