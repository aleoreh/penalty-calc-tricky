import { Edit } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { AppDialog } from "../components/AppDialog"
import { useAppDialog } from "../components/useAppDialog"
import { useRegularText } from "../components/useRegularText"
import { useSectionTitle } from "../components/useSectionTitle"
import { useUserSettings } from "../hooks/useUserSettings"
import { useInput, useValidatedForm } from "../components/useValidatedForm"
import { string } from "decoders"
import TextField from "@mui/material/TextField"
import { ValidatedForm } from "../components/ValidatedForm"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const userSettingsTitle = useSectionTitle()
    const { view } = useUserSettings()
    const field = useInput(string)
    const form = useValidatedForm([field])
    const editDialog = useAppDialog({
        reset: form.reset,
    })

    return (
        <>
            <Typography {...userSettingsTitle}>Настройки расчёта</Typography>
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
                <IconButton onClick={editDialog.open}>
                    <Edit />
                </IconButton>
            </Stack>
            <AppDialog {...editDialog} title="Диалог">
                <ValidatedForm {...form}>
                    <TextField {...field.input} />
                    <Typography>{field.validatedValue}</Typography>
                </ValidatedForm>
            </AppDialog>
        </>
    )
}
