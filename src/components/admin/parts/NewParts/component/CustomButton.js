import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const CustomButton = ({ btnName, btnBG, handleClick, textColor, btnType, form, textSize, className, tooltip }) => {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltip}
        </Tooltip>
    );

    if (tooltip) {
        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <Button
                    form={form}
                    type={btnType}
                    className={`custom-radius custom-hover ${textColor} ${textSize} ${className}`}
                    variant={btnBG}
                    style={{ opacity: 0.8 }}
                    onClick={handleClick}
                >
                    {btnName}
                </Button>
            </OverlayTrigger>
        );
    } else { 
        return (
            <Button
                form={form}
                type={btnType}
                className={`custom-radius custom-hover ${textColor} ${textSize} ${className}`}
                variant={btnBG}
                style={{ opacity: 0.8 }}
                onClick={handleClick}
            >
                {btnName}
            </Button>
        );
    }
};

export default CustomButton;