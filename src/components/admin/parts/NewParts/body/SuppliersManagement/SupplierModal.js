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
                        <AiOutlineProduct />&ensp;<p className='mb-0 fs-3'>{isNew ? `Nhà cung cấp mối` : `Thông tin nhà cung cấp`}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id='form1'>
                        <Form.Group>
                            <Form.Label>Người liên hệ</Form.Label>
                            <Form.Control type='text' defaultValue={supplier?.contactName}
                                {...register("contactName", { required: true })}
                                placeholder={`Tên người liên hệ`}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.contactName && (
                                <p className='fw-bold text-danger'>Vui lòng không bỏ trống</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nhà cung cấp</Form.Label>
                            <Form.Control type='text' defaultValue={(supplier && !isEdit) ? supplier?.supplierName : ''}
                                {...register("supplierName", { required: true })}
                                placeholder={`Tên nhà cung cấp`}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.supplierName && (
                                <p className='fw-bold text-danger'>Vui lòng không bỏ trống</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control type='text' defaultValue={supplier && !isEdit ? supplier?.address : ''}
                                {...register("address", { required: true })}
                                placeholder={'Địa chỉ nhà cung cấp'}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.address && (
                                <p className='fw-bold text-danger'>Vui lòng không bỏ trống</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' defaultValue={supplier && !isEdit ? supplier?.email : ''}
                                {...register("email", {
                                    required: "Vui lòng không bỏ trống",
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                placeholder={'Email nhà cung cấp'}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.email && (
                                <p className='fw-bold text-danger'>{errors.email.message}</p>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control type='tel' defaultValue={supplier && !isEdit ? supplier?.phone : ''}
                                {...register("phone", {
                                    required: "Vui lòng không bỏ trống",
                                    pattern: {
                                        value: /^0\d{9}$/,
                                        message: "Số điện thoại không hợp lệ"
                                    }
                                })}
                                placeholder={'Số điện thoại nhà cung cấp'}
                                onKeyDown={handleChange} onPaste={handleChange}
                                disabled={!supplier && !isNew} />
                            {errors?.phone && (
                                <p className='fw-bold text-danger'>{errors.phone.message}</p>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton btnBG={'danger'} btnName={'Hủy bỏ'} handleClick={handleCancel} />
                    {isNew ? (
                        <>
                            <CustomButton btnBG={'success'} btnName={'Lưu'} btnType={'submit'}
                                form={'form1'} textColor={'text-white'} handleClick={handleSubmitNew} />
                        </>
                    ) : (
                        isEdit ? (
                            <>
                                <CustomButton btnBG={'success'} btnName={'Lưu thay đổi'} btnType={'submit'}
                                    form={'form1'} textColor={'text-white'} handleClick={handleSubmit} />
                            </>
                        ) : (
                            <>
                                <CustomButton btnBG={'warning'} btnName={'Thay đổi thông tin'} btnType={'button'}
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
