# Калькулятор пеней за услуги ЖКХ

Калькулятор пеней - это инструмент для расчёта пеней за просроченную оплату услуг ЖКХ

## Основные возможности

- Возможность выбора параметров расчёта, таких как: порядок расчёта (для физических или юридических лиц), метод распределения оплаты (FIFO или с приоритетом целевого расчётного периода оплаты)
- Расчёт пеней производится с учётом действующих мораториев правительства РФ
- Массовая загрузка долгов и платежей из буфера обмена
- Вывод формулы, по которой была рассчитана пеня
- Выгрузка расчётов в формате Excel (xlsx)

## Используемые технологии

- [React](https://react.dev/) - UI-библиотека
- [Vite | Next Generation Frontend Tooling](https://vitejs.dev/) - система сборки
- [MUI: The React component library you always wanted](https://mui.com/) - библиотека компонентов React

## Установка и запуск

```bash
> yarn install
> yarn build
> yarn preview

или для разработки:
> yarn dev
```

## Почему был начат этот проект?

Мы вместе с моими коллегами не смогли найти калькулятор, который выводит все расчёты, включая периоды с мораториями, а также позволяет задать правила распределения оплаты, поэтому было решено создать свой собственный

## Для разработчика

[F.A.Q.](./Readme.dev.md)
