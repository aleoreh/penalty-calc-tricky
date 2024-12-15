import Snackbar from "@mui/material/Snackbar"
import Typography from "@mui/material/Typography"
import dayjs from "dayjs"
import * as D from "decoders"
import { useEffect, useState } from "react"
import DataGrid from "react-data-grid"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { ModalForm } from "@/ui/components/ModalForm"
import { useModalForm } from "@/ui/components/useModalForm"
import { validationDecoders } from "@/ui/validation/validationDecoders"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type TableRowData = {
    period: Date
    amount: number
}

const columns = [
    { key: "period", name: "Период*", editable: false },
    { key: "amount", name: "Сумма*", editable: false },
]

const clipboardToRows = (clipboard: string): D.DecodeResult<TableRowData[]> => {
    const rowDecoder = D.tuple(
        D.either(
            validationDecoders.fullMonth_year,
            validationDecoders.fullMonth_year,
            validationDecoders.date
        ),
        validationDecoders.decimal
    )

    const lines = clipboard
        .trim()
        .split("\n")
        .map((x) => x.trim())
        .map((line) => line.split("\t"))

    return D.array(rowDecoder)
        .transform((xs) =>
            xs.map(([period, amount]) => ({
                period,
                amount,
            }))
        )
        .decode(lines)
}

type DebtsClipboardLoaderProps = {
    isOpened: boolean
    closeForm: () => void
    submit: (rows: TableRowData[]) => void
}

export const DebtsClipboardLoader = ({
    isOpened,
    closeForm,
    submit,
}: DebtsClipboardLoaderProps) => {
    const [pasteError, setPasteError] = useState<string | null>(null)

    const [rows, setRows] = useState<TableRowData[]>([])

    useEffect(() => {
        document.addEventListener("paste", handlePaste)
        return () => {
            document.removeEventListener("paste", handlePaste)
        }
    }, [])

    const handlePaste = (evt: ClipboardEvent) => {
        evt.preventDefault()

        const clipboard = evt.clipboardData?.getData("text/plain")

        if (!clipboard) return

        const res = clipboardToRows(clipboard)

        if (res.ok) {
            setPasteError(null)
            setRows(res.value)
        } else {
            setPasteError("Не удалось вставить данные из буфера обмена")
            console.error(JSON.stringify(res.error, undefined, 2))
            setRows([])
        }
    }

    const modalForm = useModalForm()

    const handleSubmit = () => {
        submit(rows)
    }

    return (
        <ModalForm
            title="Загрузить долги"
            {...modalForm}
            submit={handleSubmit}
            isOpened={isOpened}
            close={closeForm}
            cancel={closeForm}
            isValid
        >
            <Typography component="p" variant="caption">
                Вставьте таблицу (без заголовков) из буфера обмена (Ctrl + V |
                Cmd ⌘ + V)
            </Typography>
            <Typography component="p" variant="caption">
                Период должен быть в формате 'Январь 2001' или '2001 Январь'
            </Typography>
            <DataGrid
                columns={columns}
                rows={rows.map((row) => ({
                    ...row,
                    period: dayjs(row.period).format("MMMM YYYY"),
                }))}
            />
            <Typography variant="caption">* - обязательные поля</Typography>
            <Snackbar
                open={pasteError !== null}
                autoHideDuration={6000}
                message={pasteError}
                onClick={() => setPasteError(null)}
                onClose={() => setPasteError(null)}
            />
        </ModalForm>
    )
}

