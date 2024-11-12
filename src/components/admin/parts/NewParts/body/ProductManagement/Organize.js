import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';

const Organize = ({ categories, errors, control, cateDefault, handleOpenCateModal }) => {
    return (
        <div>
            <div className='bg-white rounded-2 border py-2 px-4 mb-4'>
                <h5 className='mb-3 fs-4'>Organize</h5>
                <Form>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Category</Form.Label>
                            <motion.label className='ms-3 mb-0 font-12 fw-medium text-primary'
                                whileHover={{ opacity: 0.8, scale: 1.08 }} onClick={handleOpenCateModal}>New category</motion.label>
                        </div>
                        <Controller
                            name='categories'
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={categories}
                                    placeholder='Select category...'
                                    value={field.value ? { value: field.value[0].id, label: field.value[0].name } : cateDefault ? cateDefault : ''}
                                    onChange={(selectedOption) => {
                                        field.onChange(selectedOption ? [{ id: selectedOption.value, name: selectedOption.label }] : []);
                                    }}
                                />
                            )}
                        />
                        <p className='fs-6 fw-medium text-danger'>{errors?.categories && `Product's category is required !`}</p>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Organize;
