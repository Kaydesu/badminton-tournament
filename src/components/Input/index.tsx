import React, { useMemo, useState } from 'react';
import { InputStyle, InputSuggestions } from './styled';
import Icon from '@components/Icon';
import caretDown from '../../assets/icons/caret-down.svg';

type InputProps = React.ComponentPropsWithoutRef<'input'>;

interface Props extends InputProps {
    label?: string;
    data?: string[];
}

const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, onChange, placeholder, data = null, value } = props;

    const [openSuggestion, setOpenSuggestion] = useState(false);

    const [filterData, setFilterData] = useState(data);

    const filterSuggestion = (text: string) => {
        const filterList = data.filter(item => {
            const regExp = new RegExp(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''), 'gi');
            return regExp.test(item.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        });
        setFilterData(filterList);
    }

    const handleInputChange = () => {
        if (data) {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                filterSuggestion(e.target.value);
                onChange && onChange(e);
            }
        } else {
            return onChange;
        }
    }

    return (
        <InputStyle className="tambo-input">
            {label && <div className="tambo-input__label">{label}</div>}
            <input
                type="text"
                value={value}
                ref={ref}
                placeholder={placeholder}
                className="tambo-input__input"
                onChange={handleInputChange()}
                {...props}
            />
            {data && (
                <>
                    <div className='dropdown-icon' onClick={() => setOpenSuggestion(!openSuggestion)}>
                        <Icon src={caretDown} />
                    </div>
                    <InputSuggestions visible={openSuggestion} className='tambo-input-suggestion'>
                        <div className='tambo-scrollbar'>
                            {filterData.map((item, idx) => (
                                <li key={idx}>
                                    {item}
                                </li>
                            ))}
                        </div>
                    </InputSuggestions>
                </>
            )}
        </InputStyle>
    );
});

export default Input;
export { default as TextArea } from './TextArea';
