import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const Variants = ({sizeRef, colorRef, sizes, colors, sizeChange, colorChange}) => {
    return (
        <div>
            <div className='bg-white rounded-2 border py-2 px-4'>
                <h5 className='mb-3 fs-4'>Variants</h5>
                <Form>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Sizes</Form.Label>
                            {/* <label className='ms-3 font-12 fw-medium text-primary'>New size</label> */}
                        </div>
                        <Select ref={sizeRef} options={sizes} isMulti placeholder='Select sizes...' onChange={sizeChange}/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Colors</Form.Label>
                            {/* <label className='ms-3 font-12 fw-medium text-primary'>New supplier</label> */}
                        </div>
                        <Select ref={colorRef} options={colors} isMulti placeholder='Select colors...' onChange={colorChange}/>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Variants;
