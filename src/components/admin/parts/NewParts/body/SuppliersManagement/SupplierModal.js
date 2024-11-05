import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { AiOutlineProduct } from 'react-icons/ai';
import CustomButton from '../../component/CustomButton';
import CustomFormControl from '../../component/CustomFormControl';

const SupplierModal = ({ supplier, show, isNew, isEdit, handleChange, handelEdit, handleCancel, handleSubmit, register, errors, handleSubmitNew }) => {

    return (
        <div>
            <Modal show={show} onHide={handleCancel}>
                <Modal.Header>
                    <Modal.Title className='d-flex align-items-center'>
                        <AiOutlineProduct />&ensp;<p className='mb-0 fs-3'>{isNew ? `New Supplier` : `Supplier Infomations`}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id='form1'>
                        <Form.Group>
                            <Form.Label>Contacter</Form.Label>
                            <Form.Control type='text' defaultValue={supplier?.contactName}
                                {...register("contactName", { required: true })}
                                placeholder={`Contacter's name`}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.contactName && (
                                <p className='fw-bold text-danger'>Contacter required</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Supplier</Form.Label>
                            <Form.Control type='text' defaultValue={(supplier && !isEdit) ? supplier?.supplierName : ''}
                                {...register("supplierName", { required: true })}
                                placeholder={(supplier && isEdit) && supplier?.supplierName}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.supplierName && (
                                <p className='fw-bold text-danger'>Supplier is required</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control type='text' defaultValue={supplier && !isEdit ? supplier?.address : ''}
                                {...register("address", { required: true })}
                                placeholder={(supplier && isEdit) && supplier?.address}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.address && (
                                <p className='fw-bold text-danger'>Address is required</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' defaultValue={supplier && !isEdit ? supplier?.email : ''}
                                {...register("email", {
                                    required: "Email iss required",
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Email does not valid"
                                    }
                                })}
                                placeholder={(supplier && isEdit) && supplier?.email}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.email && (
                                <p className='fw-bold text-danger'>{errors.email.message}</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type='tel' defaultValue={supplier && !isEdit ? supplier?.phone : ''}
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^0\d{9}$/,
                                        message: "Phone number does not valid"
                                    }
                                })}
                                placeholder={(supplier && isEdit) && supplier?.phone}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.phone && (
                                <p className='fw-bold text-danger'>{errors.phone.message}</p>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton btnBG={'danger'} btnName={'Cancel'} handleClick={handleCancel} />
                    {isNew ? (
                        <>
                            <CustomButton btnBG={'success'} btnName={'Save'} btnType={'submit'}
                                form={'form1'} textColor={'text-white'} handleClick={handleSubmitNew} />
                        </>
                    ) : (
                        isEdit ? (
                            <>
                                <CustomButton btnBG={'success'} btnName={'Save changed'} btnType={'submit'}
                                    form={'form1'} textColor={'text-white'} handleClick={handleSubmit} />
                            </>
                        ) : (
                            <>
                                <CustomButton btnBG={'warning'} btnName={'Change infomations'} btnType={'button'}
                                    textColor={'text-white'} handleClick={handelEdit} />
                            </>
                        )
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SupplierModal;
