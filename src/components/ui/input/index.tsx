'use client';

import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';
import { Container, Label, ContentContainer, ErrorText } from './styles';

export interface ICustomInput extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    error?: string;
    icon?: React.ComponentType<IconBaseProps>;
    widthFull?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, ICustomInput>(
    (
        { name, label, error, icon: Icon, widthFull = true, ...rest },
        ref
    ) => {
        return (
            <Container $widthFull={widthFull}>
                {label && <Label htmlFor={name}>{label}</Label>}
                <ContentContainer $hasError={!!error}>
                    {Icon && <Icon size={18} />}
                    <input ref={ref} id={name} name={name} {...rest} />
                </ContentContainer>
                {error && <ErrorText>{error}</ErrorText>}
            </Container>
        );
    }
);

Input.displayName = 'Input';
