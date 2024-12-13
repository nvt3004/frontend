import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../../../../services/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import DataTableSft from '../../../../DataTableSft';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { Input } from 'react-select/animated';
import { useForm } from 'react-hook-form';

const FeedbacksTable = () => {
    const [originalFeedbackData, setOriginalFeedbackData] = useState([]);
    const [tableData, setTableData] = useState(
        [
            {
                id: '',
                product: '',
                date: '',
                rating: 0,
                user: '',
                reply: '',
                comment: '',
                images: ''
            }
        ]
    );
    const handleGetFeedbacskAPI = () => {
        axiosInstance.get('/staff/feedback/dashboard').then(
            (response) => {
                if (response?.data?.code === 200) {
                    setOriginalFeedbackData(response?.data?.data?.contents);
                }
            }
        ).catch(
            (error) => {
                if (error) {
                    console.log(error);
                    toast.error('Bạn không có quyền thực thi chức năng này ! Hoặc đã có lỗi xảy ra. Hãy báo cho bộ phận kỹ thuật khi phát hiện ra lỗi !');
                }
            }
        );
    }
    const mapDataToTableData = (apiData) => {
        return apiData.map((item) => ({
            id: item.feedbackId,
            product: item.productName,
            date: item.feedbackDate,
            rating: item.rating,
            user: item.user.fullName,
            reply: item.reply != null ? item?.reply : 0,
            comment: item?.comment,
            image: item.images || 0
        }));
    };

    useEffect(
        () => {
            handleGetFeedbacskAPI();
        }, []
    );
    const mappedData = useMemo(() => mapDataToTableData(originalFeedbackData), [originalFeedbackData]);
    useEffect(() => {
        setTableData(mappedData);
    }, [mappedData]);

    useEffect(
        () => {
            if (tableData) {
                console.log("table data: ", tableData);
            }
            if (originalFeedbackData.length >= 1) {
                console.log("original data: ", originalFeedbackData);
            }
        }, [tableData, originalFeedbackData]
    );

    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const { setValue, register, getValues, formState: { errors }, setError } = useForm();
    useEffect(
        () => {
            if (selectedFeedback && selectedFeedback?.reply !== 0) {
                console.log("selected feedback: ", selectedFeedback);
                setValue('content', selectedFeedback?.reply?.content);
            }
        }, [selectedFeedback]
    );
    const handleReply = () => {
        const replyText = getValues("content");
        if (!replyText) {
            setError("content", { type: 'manual', message: "Không được bỏ trống phản hồi !" });
        } else {
            const data = {
                feedbackId: selectedFeedback?.id,
                content: replyText
            }
            if (data) {
                axiosInstance.post("/admin/reply/add", data).then(
                    (response) => {
                        if (response.data?.code === 200) {
                            setSelectedFeedback(null);
                            setShowModal(false);
                            toast.success('Phản hồi thành công !');
                        } else if (response.data?.code === 998) {
                            toast.error('Bạn không có quyền thực hiện chức năng này, vui lòng thử lại ! Hoặc nếu có lỗi xảy ra, vui lòng liên hệ ỹ thuật.');
                        } else {
                            toast.error('Không thể phản hồi ! Có thể đã xảy ra lỗi, vui lòng liên hệ kỹ thuật.');
                        }
                    }
                ).catch(
                    (error) => {
                        if (error) {
                            console.log(error);
                            toast.error('Bạn không có quyền thực hiện chức năng này, vui lòng thử lại ! Hoặc nếu có lỗi xảy ra, vui lòng liên hệ ỹ thuật.');
                            return;
                        }
                    }
                );
            }
        }
    }

    const column = [
        { title: 'Mã', dataIndex: 'id', key: 'id' },
        { title: 'Sản phẩm', dataIndex: 'product', key: 'product' },
        { title: 'Ngày đăng', dataIndex: 'date', key: 'date' },
        { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
        { title: 'Bình luận', dataIndex: 'comment', key: 'comment' },
        {
            dataIndex: 'image', key: 'image', render: (
                (value) => {
                    return (
                        <img src={value} alt='feedback-images' />
                    );
                }
            )
        },
        {
            title: 'Phản hồi', dataIndex: 'reply', key: 'reply', render: (_, record) => {
                return (
                    record?.reply === 0 ?
                        (
                            <Button variant='dark' onClick={() => { setShowModal(true); setSelectedFeedback(record) }}>Phản hồi</Button>
                        ) :
                        (
                            <Button variant='dark' onClick={() => { setShowModal(true); setSelectedFeedback(record) }}><FaEye /></Button>
                        )
                )
            }
        },
    ];
    return (
        <div>
            <div>
                <DataTableSft
                    columns={column}
                    dataSource={tableData}
                />
            </div>
            <div>
                <Modal show={showModal} onHide={() => { setShowModal(false); setSelectedFeedback(null) }}>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <textarea className='border px-2 py-1 rounded-1' style={{ width: '100%' }}
                                    placeholder='Phản hồi bình luận. . .'
                                    {...register("content", { required: true })} />
                                <p className='text-danger'>{errors?.content?.message}</p>
                                <div className='d-flex justify-content-end mt-2'>
                                    {selectedFeedback && selectedFeedback?.reply !== 0 ?
                                        <Button variant='dark' onClick={() => { setShowModal(false); setSelectedFeedback(null) }}>Close</Button> :
                                        <div className='d-flex justify-content-between mt-2'>
                                            <Button className='me-2' variant='success' onClick={() => { handleReply() }}>Phản hồi</Button>
                                            <Button variant='danger' onClick={() => { setShowModal(false); setSelectedFeedback(null) }}>Hủy bỏ</Button>
                                        </div>
                                    }
                                </div>

                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default FeedbacksTable;
