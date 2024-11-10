import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({btnName, btnBG, handleClick, textColor, btnType, form}) => {
    return (
        <Button form={form} type={btnType} className={`custom-radius custom-hover ${textColor}`} variant={btnBG} style={{opacity: 0.9}} onClick={handleClick}>{btnName}</Button>
    );
}

export default CustomButton;
