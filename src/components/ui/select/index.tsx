import React, { SelectHTMLAttributes } from 'react';
import { SelectContainer, Label, SelectElement, ErrorText } from './styles';

interface IOption {
    value: string | number;
    label: string;
}

export interface ICustomSelect extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    label?: string;
    error?: string;
    widthFull?: boolean;
    options: IOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, ICustomSelect>(
    ({ name, label, error, widthFull = true, options, ...rest }, ref) => {
        return (
            <SelectContainer $widthFull={widthFull}>
                {label && <Label htmlFor={name}>{label}</Label>}
                <SelectElement ref={ref} id={name} name={name} $hasError={!!error} {...rest}>
                    <option value="" disabled hidden>Selecione...</option>
                    {options.map((opt, index) => (
                        // Usamos index junto ao value para garantir unicidade da key,
                        // evitando warnings de "duplicate key" quando a mesma opção aparece
                        // em selects diferentes na mesma árvore de componentes.
                        <option key={`${opt.value}_${index}`} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </SelectElement>
                {error && <ErrorText>{error}</ErrorText>}
            </SelectContainer>
        );
    }
);

Select.displayName = 'Select';
