import React, { forwardRef } from 'react';
import { MainButton, SecondaryButton } from './styled';

type ButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface Props extends ButtonProps {
    buttonType?: 'main' | 'secondary';
}

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { className = '', children, onClick, buttonType = 'main' } = props;
    return buttonType === 'main' ? (
        <MainButton ref={ref} className={`tambo-button ${className}`} onClick={onClick} {...props}>
            {children}
        </MainButton>
    ) : (
        <SecondaryButton ref={ref} className={`tambo-button ${className}`} onClick={onClick}  {...props}>
            {children}
        </SecondaryButton>
    );
});

export default Button;
