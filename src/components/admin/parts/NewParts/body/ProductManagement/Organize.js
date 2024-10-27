import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { motion } from 'framer-motion';

const Organize = ({suppliers, categories, handleOpenSupplier}) => {
    return (
        <div>
            <div className='bg-white rounded-2 border py-2 px-4 mb-4'>
                <h5 className='mb-3 fs-4'>Organize</h5>
                <Form>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Category</Form.Label>
                            <motion.label className='ms-3 mb-0 font-12 fw-medium text-primary'
                                whileHover={{opacity: 0.8, scale: 1.08}} >New category</motion.label>
                        </div>
                        <Select options={categories} placeholder='Select category...'/>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Supplier</Form.Label>
                            <motion.label className='ms-3 mb-0 font-12 fw-medium text-primary'
                                whileHover={{opacity: 0.8, scale: 1.1}}
                                onClick={handleOpenSupplier}>New supplier</motion.label>
                        </div>
                        <Select options={suppliers} placeholder='Select supplier...'/>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Organize;
