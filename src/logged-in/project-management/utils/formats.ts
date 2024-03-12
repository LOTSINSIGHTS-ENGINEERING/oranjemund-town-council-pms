export const moneyFormat = (value: number) => {
    return `${new Intl.NumberFormat().format(value)}`;
}