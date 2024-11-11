import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({btnName, btnBG, handleClick, textColor, btnType, form, textSize}) => {
    return (
        <Button form={form} type={btnType} className={`custom-radius custom-hover ${textColor} ${textSize}`} variant={btnBG} style={{opacity: 0.8}} onClick={handleClick}>{btnName}</Button>
    );
}

export default CustomButton;
