import React from 'react';
import { Button } from 'react-bootstrap';

const CustomButton = ({btnName, btnBG, handleClick, textColor}) => {
    return (
        <Button className={`custom-radius custom-hover ${textColor} `} variant={btnBG} onClick={handleClick}>{btnName}</Button>
    );
}

export default CustomButton;
