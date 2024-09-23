import React from 'react';
import { Form } from 'react-bootstrap';

const CustomFormControl = ({type, defaultValue, defaultCheck, isEdit, isNew, ref}) => {
    const handleChange = (e) => {
        if(isEdit === false && isNew === false){
            e.preventDefault();
        }
    }
    return (
        <Form.Control type={type} ref={ref} defaultValue={defaultValue} defaultChecked={defaultCheck} onKeyDown={handleChange} onPaste={handleChange}/>
    );
}

export default CustomFormControl;
