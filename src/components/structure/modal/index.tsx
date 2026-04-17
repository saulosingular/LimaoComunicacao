'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import {
    Overlay,
    ModalContainer,
    ModalHeaderContainer,
    CloseButton,
    ModalContentContainer,
    ModalFooterContainer
} from './styles';

export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, width, footer }: IModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <Overlay ref={overlayRef} onClick={handleOverlayClick}>
            <ModalContainer $width={width}>
                <ModalHeaderContainer>
                    <h2>{title}</h2>
                    <CloseButton onClick={onClose} aria-label="Fechar">
                        <FiX size={24} />
                    </CloseButton>
                </ModalHeaderContainer>

                <ModalContentContainer>
                    {children}
                </ModalContentContainer>

                {footer && <ModalFooterContainer>{footer}</ModalFooterContainer>}
            </ModalContainer>
        </Overlay>,
        document.body
    );
}
