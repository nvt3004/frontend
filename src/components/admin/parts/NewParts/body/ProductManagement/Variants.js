import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

const Variants = ({ sizes, colors, control, errors, sizesDefault, colorsDefault }) => {
    return (
        <div>
            <div className='bg-white rounded-2 border py-2 px-4'>
                <h5 className='mb-3 fs-4'>Variants</h5>
                <Form>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Sizes</Form.Label>
                        </div>
                        <Controller
                            name="sizes"
                            control={control}
                            defaultValue={sizesDefault}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={sizes}
                                    isMulti
                                    placeholder="Select sizes..."
                                    onChange={(selectedOptions) => {
                                        const formattedOptions = selectedOptions
                                            ? selectedOptions.filter(option => option.value && option.label)
                                            : [];
                                        field.onChange(formattedOptions); // Cập nhật giá trị mới
                                    }}
                                />
                            )}
                        />
                        <p className="fs-6 fw-medium text-danger">
                            {errors?.sizes && `Attribute: size is required !`}
                        </p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <div className='d-flex align-items-center mb-1'>
                            <Form.Label className='fs-6 fw-medium mb-0'>Colors</Form.Label>
                        </div>
                        <Controller
                            name="colors"
                            control={control}
                            defaultValue={colorsDefault}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={colors}
                                    isMulti
                                    placeholder="Select colors..."
                                    onChange={(selectedOptions) => {
                                        const formattedOptions = selectedOptions
                                            ? selectedOptions.filter(option => option.value && option.label)
                                            : [];
                                        field.onChange(formattedOptions); // Cập nhật giá trị mới
                                    }}
                                />
                            )}
                        />
                        <p className="fs-6 fw-medium text-danger">
                            {errors?.colors && `Attribute: color is required !`}
                        </p>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}

export default Variants;
