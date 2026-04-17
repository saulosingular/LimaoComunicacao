export const parseSafeNumber = (val: string | number | undefined): number => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return val;
    // Tira espaços e troca virgula por ponto
    const normalized = val.trim().replace(',', '.');
    // Para aceitar strings como "0." enquanto ainda se está digitando, podemos não forçar Number() de cara
    // Mas o helper devolve number. Para inputs controlados, o ideal é o input receber string, e na hora do cálculo passamos parseSafeNumber.
    const parsed = Number(normalized);
    return isNaN(parsed) ? 0 : parsed;
};
