import styled from 'styled-components';
import React from 'react';

type TextAreaProps = React.ComponentPropsWithoutRef<'textarea'>;

interface Props extends TextAreaProps {
    label?: string;
}

const TextareaStyle = styled.div`
    position: relative;
    .tambo-input__label {
        text-align: left;
        font-size: 14px;
        color: #4B4B4B;
        margin-bottom: 8px;
    }
    .tambo-input__input {
        color: #4B4B4B;
        background: #EBEFF0;
        border-radius: 4px;
        padding: 10px 12px;
        width: 100%;
        ::placeholder {
            color: #7e8497;
            opacity: 0.7;
        }
    }
`;

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { label, onChange, placeholder } = props;

    return (
        <TextareaStyle className="tambo-input--textarea">
            {label && <div className="tambo-input__label">{label}</div>}
            <textarea ref={ref}  {...props} placeholder={placeholder} className="tambo-input__input" onChange={onChange} />
        </TextareaStyle>
    );
});

export default TextArea;
