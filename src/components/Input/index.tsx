import React from 'react';
import { InputStyle } from './styled';


type InputProps = React.ComponentPropsWithoutRef<'input'>;

interface Props extends InputProps {
    label?: string;
    data?: any[];
    renderOptions?: <D>(data: D) => string | JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, onChange, placeholder, value } = props;

    return (
        <InputStyle className="tambo-input">
            {label && <div className="tambo-input__label">{label}</div>}
            <input
                type="text"
                value={value}
                ref={ref}
                placeholder={placeholder}
                className="tambo-input__input"
                onChange={onChange}
                {...props}
            />
        </InputStyle>
    );
});

export default Input;
export { default as TextArea } from './TextArea';
