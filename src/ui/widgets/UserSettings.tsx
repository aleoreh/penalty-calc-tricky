import { Edit } from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ModalForm } from "../components/ModalForm"
import { useModalForm } from "../components/useModalForm"
import { useRegularText } from "../components/useRegularText"
import { useSectionTitle } from "../components/useSectionTitle"
import { useSimpleField } from "../components/useSimpleField"
import { useValidatedTextField } from "../components/useValidatedTextField"
import { useCalculationSettings } from "../hooks/useCalculationSettings"
import { useCalculationSettingsFormat } from "../hooks/useCalculationSettingsFormat"
import { useAppForm } from "../validation/useAppForm"
import { validationDecoders } from "../validation/validationDecoders"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export function UserSettings() {
    const userSettingsInfo = useRegularText()
    const userSettingsTitle = useSectionTitle()

    const settings = useCalculationSettings()
    const { isLegalEntity, isDistributionMethod, setUserSettings } = settings

    const view = useCalculationSettingsFormat(settings)

    // ~~~~~~~~~~~~~~ alt форма ~~~~~~~~~~~~~~ //

    const legalEntityInput = useSimpleField({
        name: "legal-entity",
        initialValue: settings.legalEntity,
    })

    const distributionMethodInput = useSimpleField({
        name: "distribution-method",
        initialValue: settings.distributionMethod,
    })

    const keyRateInput = useValidatedTextField({
        name: "key-rate",
        decoder: validationDecoders.decimal.transform((x) => x / 100),
        initialValue:
            settings.calculationKeyRate === undefined
                ? undefined
                : JSON.stringify(settings.calculationKeyRate * 100),
    })

    const userSettingsForm = useAppForm([
        legalEntityInput,
        distributionMethodInput,
        keyRateInput,
    ])

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

    const modalForm = useModalForm()

    const submit = () => {
        setUserSettings({
            legalEntity: legalEntityInput.value,
            distributionMethod: distributionMethodInput.value,
            calculationKeyRate: keyRateInput.validatedValue,
        })
    }

    const handleLegalEntityChange = (event: SelectChangeEvent) => {
        isLegalEntity(event.target.value) &&
            legalEntityInput.setValue(event.target.value)
    }

    const handleDistributionMethodChange = (event: SelectChangeEvent) => {
        isDistributionMethod(event.target.value) &&
            distributionMethodInput.setValue(event.target.value)
    }

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
                <IconButton onClick={modalForm.open}>
                    <Edit />
                </IconButton>
            </Stack>
            <ModalForm
                title="Настройки"
                {...modalForm}
                {...userSettingsForm}
                submit={submit}
            >
                <Stack>
                    <FormControl>
                        <InputLabel id="legal-entity-input-label">
                            Порядок расчёта
                        </InputLabel>
                        <Select
                            {...legalEntityInput.input}
                            labelId="legal-entity-input-label"
                            id="legal-entity-input"
                            label="Порядок расчёта"
                            value={legalEntityInput.value}
                            onChange={handleLegalEntityChange}
                        >
                            <MenuItem value="natural">Физические лица</MenuItem>
                            <MenuItem value="artificial">
                                Юридические лица
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="distribution-method-input-label">
                            Метод распределения
                        </InputLabel>
                        <Select
                            {...distributionMethodInput.input}
                            labelId="distribution-method-input-label"
                            id="distribution-method-input"
                            label="Метод распределения"
                            value={distributionMethodInput.value}
                            onChange={handleDistributionMethodChange}
                        >
                            <MenuItem value="fifo">
                                {view.distributionMethods["fifo"]}
                            </MenuItem>
                            <MenuItem value="byPaymentPeriod">
                                {view.distributionMethods["byPaymentPeriod"]}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        {...keyRateInput.input}
                        label="Ключевая ставка, %"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

