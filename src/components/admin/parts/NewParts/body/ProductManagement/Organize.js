import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const Organize = ({suppliers, categories}) => {
    return (
        <div>
            <div className='bg-white rounded-2 border py-2 px-4 mb-4'>
                <h5 className='mb-3 fs-4'>Organize</h5>
                <Form>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Category</Form.Label>
                            <label className='ms-3 font-12 fw-medium text-primary'>New category</label>
                        </div>
                        <Select options={categories} placeholder='Select category...'/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Supplier</Form.Label>
                            <label className='ms-3 font-12 fw-medium text-primary'>New supplier</label>
                        </div>
                        <Select options={suppliers} placeholder='Select supplier...'/>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Organize;
