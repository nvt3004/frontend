import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const CustomButton = ({ btnName, btnBG, handleClick, textColor, btnType, form, textSize, className, tooltip, disabled, icon, btnSize, style = {} }) => {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltip}
        </Tooltip>
    );

    // Merge custom style with default style
    const buttonStyle = { opacity: 0.8, ...style };

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
                    style={style}  // Use the merged style here
                    onClick={handleClick}
                    disabled={disabled}
                    size={btnSize}
                >
                    {icon} {btnName}
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
                style={buttonStyle}  // Use the merged style here
                onClick={handleClick}
                disabled={disabled}
                icon={icon}
                size={btnSize}
            >
                {icon} {btnName}
            </Button>
        );
    }
};

export default CustomButton;
