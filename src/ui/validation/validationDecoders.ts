import dayjs from "dayjs"
import { date, nonEmptyString, regex, string } from "decoders"

export const validationDecoders = {
    nonEmptyString,
    decimal: nonEmptyString
        .describe("Значение не может быть пустым")
        .transform((x) => x.replaceAll(",", "."))
        .transform((x) => x.replaceAll(" ", ""))
        .transform((x) => x.replaceAll(" ", ""))
        .pipe(regex(/^\d*[.,]?\d*$/, "Ожидается число"))
        .transform(parseFloat),
    date: string
        .transform((x) =>
            dayjs(x, [
                "DD.MM.YYYY",
                "DD.MM.YY",
                "YYYY-MM-DD",
                "YY-MM-DD",
            ]).toDate()
        )
        .pipe(date)
        .describe("Ожидается дата"),
    fullMonth_year: string
        .transform((x) => x.toLowerCase())
        .transform((x) => dayjs(x, ["MMMM YYYY", "YYYY MMMM"]).toDate())
        .pipe(date)
        .describe("Ожидается дата в форматах: 'Январь 2001' или '2001 Январь'"),
}

