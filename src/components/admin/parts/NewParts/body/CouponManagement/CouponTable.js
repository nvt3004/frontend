import React, { useEffect, useState } from 'react';
import FullScreenSpinner from '../../../FullScreenSpinner';
import DataTableSft from '../../../../DataTableSft';
import axiosInstance from '../../../../../../services/axiosConfig';
import { Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import ModalSft from '../../../../ModalSft';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const CouponTable = () => {
    const [loading, setLoading] = useState(false);

    const collumn = [
        { title: "Code", dataIndex: "code", key: "code" },
        { title: "Descriptions", dataIndex: "desc", key: "description" },
        { title: "Start", dataIndex: "start", key: "start" },
        { title: "End", dataIndex: "end", key: "end" },
        {
            title: "Kind", dataIndex: "kind", key: "kind", render: (
                (value) => {
                    return value === 'perc' ? 'Percent' : 'Price';
                }
            )
        },
        { title: "Value", dataIndex: "value", key: "value" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    ];

    const [coupons, setCoupons] = useState([{
        code: '',
        desc: '',
        start: '',
        end: '',
        kind: '',
        value: '',
        quantity: ''
    }]);

    const triggers = () => {
        return (
            <div className='d-flex'>
                <Button variant='dark' onClick={() => { setOpenModal(true) }}>New coupon</Button>
            </div>
        )
    }

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const handleGetCouponAPI = () => {
        axiosInstance.get(`/staff/coupons?page=${currentPage}`).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    const mappedCoupons = response.data.data.content.map(coupon => ({
                        code: coupon.code,
                        desc: coupon.description,
                        start: coupon.startDate,
                        end: coupon.endDate,
                        kind: coupon.disPercent !== null ? 'perc' : 'price', // Xác định loại
                        value: `${coupon.disPercent}%` || `${coupon.disPrice} VND` || '', // Giá trị giảm
                        quantity: coupon.quantity || 'N/A' // Thay fullname bằng trường khác nếu có
                    }));

                    // Cập nhật state
                    setCoupons(mappedCoupons);

                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                }
            }
        );
    }
    useEffect(
        () => {
            handleGetCouponAPI();
        }, []
    );
    const handleSetPage = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }
    const paginationItems = [];
    for (let number = 0; number < totalPage; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage}
                onClick={() => handleSetPage(number)}>
                {number + 1}
            </Pagination.Item>
        );
    }

    const [isOpenModal, setOpenModal] = useState(false);
    const [couponType, setCouponType] = useState("percent");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues
    } = useForm();

    const formatDateToPattern = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const onSubmit = async (data) => {
        const formattedData = {
            // code: data.code,
            description: data.description,
            disPercent: couponType === "percent" ? data.value : null,
            disPrice: couponType === "price" ? data.value : null,
            startDate: formatDateToPattern(data.startDate),
            endDate: formatDateToPattern(data.endDate),
            quantity: data.quantity,
        };

        console.log(formattedData);

        try {
            const response = await axiosInstance.post("/staff/coupons", formattedData);
            if (response?.data?.errorCode === 200) {
                toast.success("Coupon added successfully!");
                reset();
                setOpenModal(false);
                setLoading(false);
                handleGetCouponAPI();
            } else {
                toast.error(response?.data?.message || "Failed to add coupon.");
            }
        } catch (error) {
            console.error("Error adding coupon:", error);
            toast.error("An error occurred while adding the coupon.");
        }
    };

    return (
        <div>
            <FullScreenSpinner isLoading={loading} />
            <DataTableSft
                columns={collumn}
                title={"Coupon list"}
                dataSource={coupons}
                buttonTable={triggers()}
            />
            <div className='bg-body-tertiary d-flex justify-content-between align-items-center container pt-2'>
                <p className='font-13'>{`${(currentPage + 1) * 10 <= totalElements ? (currentPage + 1) * 10 : totalElements} of ${totalElements} `}
                    <span><a href='#' className='text-decoration-none fw-medium'>{`View all >`}</a></span>
                </p>
                {totalPage > 1 && (
                    <Pagination className='border-0'>
                        <Pagination.First>{`<`}</Pagination.First>
                        {paginationItems}
                        <Pagination.Last>{`>`}</Pagination.Last>
                    </Pagination>
                )}
            </div>
            <ModalSft
                open={isOpenModal}
                title={"Create new coupon"}
                titleOk={"Create"}
                onCancel={() => {
                    setOpenModal(false);
                    reset();
                    setCouponType("percent");
                }}
                onOk={handleSubmit(onSubmit)}
            >
                <Form>
                    {/* <Form.Group className="mb-2">
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                            {...register("code", { required: "Code is required." })}
                            placeholder="Coupon's code"
                        />
                        {errors.code && <span className="text-danger">{errors.code.message}</span>}
                    </Form.Group> */}
                    <Form.Group className="mb-2">
                        <Form.Label>Descriptions</Form.Label>
                        <Form.Control
                            {...register("description", {
                                required: "Description is required.",
                                maxLength: {
                                    value: 255,
                                    message: "Description cannot exceed 255 characters.",
                                },
                            })}
                            placeholder="Coupon's description"
                        />
                        {errors.description && (
                            <span className="text-danger">{errors.description.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Start date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            {...register("startDate", {
                                required: "Start date is required.",
                                validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // Reset giờ, phút, giây, và ms của hôm nay

                                    if (selectedDate < today) {
                                        return "Start date must be today or in the future.";
                                    }
                                    return true;
                                },
                            })}
                        />
                        {errors.startDate && (
                            <span className="text-danger">{errors.startDate.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>End date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            {...register("endDate", {
                                required: "End date is required.",
                                validate: (value) => {
                                    if (new Date(value) <= new Date(getValues("startDate"))) {
                                        return "End date must be after start date.";
                                    }
                                    return true;
                                },
                            })}
                        />
                        {errors.endDate && (
                            <span className="text-danger">{errors.endDate.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Discount Type</Form.Label>
                        <InputGroup>
                            <Form.Select
                                defaultValue="percent"
                                onChange={(e) => setCouponType(e.target.value)}
                                style={{ maxWidth: "150px" }}
                            >
                                <option value="percent">Percent</option>
                                <option value="price">Price</option>
                            </Form.Select>

                            <Form.Control
                                type="number"
                                step={couponType === "percent" ? 1 : 1000}
                                {...register("value", {
                                    required: "Discount value is required.",
                                    validate: (value) => {
                                        if (couponType === "percent") {
                                            if (value < 5 || value > 50) {
                                                return "Discount percentage must be between 5% and 50%.";
                                            }
                                        } else if (couponType === "price") {
                                            if (value < 5000 || value > 100000) {
                                                return "Discount price must be between 5000 and 100,000.";
                                            }
                                        }
                                        return true;
                                    },
                                })}
                                placeholder={`Enter ${couponType === "percent" ? "percentage" : "price"} value`}
                            />

                            <InputGroup.Text>
                                {couponType === "percent" ? "%" : "VND"}
                            </InputGroup.Text>
                        </InputGroup>
                        {errors.value && <span className="text-danger">{errors.value.message}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            {...register("quantity", {
                                required: "Quantity is required.",
                                min: { value: 1, message: "Quantity must be at least 1." },
                            })}
                            placeholder="Coupon's quantity"
                        />
                        {errors.quantity && (
                            <span className="text-danger">{errors.quantity.message}</span>
                        )}
                    </Form.Group>
                </Form>
            </ModalSft>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default CouponTable;
