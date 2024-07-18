import Snackbar from "@mui/material/Snackbar"
import Typography from "@mui/material/Typography"
import dayjs from "dayjs"
import * as D from "decoders"
import { useEffect, useState } from "react"
import DataGrid from "react-data-grid"
import { validationDecoders } from "../validation/validationDecoders"
import { ModalForm } from "../components/ModalForm"
import { useModalForm } from "../components/useModalForm"

type TableRowData = {
    date: Date
    amount: number
    period?: Date
}

const columns = [
    { key: "date", name: "Дата*", editable: false },
    { key: "amount", name: "Сумма*", editable: false },
    { key: "period", name: "Период", editable: false },
]

const clipboardToRows = (clipboard: string): D.DecodeResult<TableRowData[]> => {
    const rowDecoder = D.either(
        D.tuple(
            validationDecoders.date,
            validationDecoders.decimal,
            validationDecoders.fullMonth_year
        ),
        D.tuple(validationDecoders.date, validationDecoders.decimal).transform(
            ([date, amount]) =>
                [date, amount, undefined] as [Date, number, Date | undefined]
        )
    )

    const lines = clipboard
        .trim()
        .split("\n")
        .map((x) => x.trim())
        .map((line) => line.split("\t"))
        .map((xs) => xs.filter((x) => x.trim().length > 0))

    return D.array(rowDecoder)
        .transform((xs) =>
            xs.map(([date, amount, period]) => ({
                date,
                amount,
                period,
            }))
        )
        .decode(lines)
}

type PaymentsClipboardLoaderProps = {
    isOpened: boolean
    submit: (rows: TableRowData[]) => void
    closeForm: () => void
}

export const PaymentsClipboardLoader = ({
    isOpened,
    submit,
    closeForm,
}: PaymentsClipboardLoaderProps) => {
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

    return (
        <ModalForm
            title="Загрузить платежи"
            {...modalForm}
            submit={() => submit(rows)}
            isOpened={isOpened}
            close={closeForm}
            cancel={closeForm}
            isValid
        >
            <Typography variant="caption">
                Вставьте таблицу (без заголовков) из буфера обмена (Ctrl + V |
                Cmd ⌘ + V)
            </Typography>
            <DataGrid
                columns={columns}
                rows={rows.map((row) => ({
                    ...row,
                    date: dayjs(row.date).format("DD.MM.YYYY"),
                    period: row.period
                        ? dayjs(row.period).format("MMMM YYYY")
                        : undefined,
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

