import React, { useEffect, useState } from 'react';
import FullScreenSpinner from '../../../FullScreenSpinner';
import DataTableSft from '../../../../DataTableSft';
import axiosInstance from '../../../../../../services/axiosConfig';
import { Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import ModalSft from '../../../../ModalSft';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import CustomButton from "../../component/CustomButton";
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import { formatCurrency } from '../../../../../../services/formatCurrency';
import Swal from 'sweetalert2';

const CouponTable = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm();

    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const collumn = [
        { title: "Mã", dataIndex: "code", key: "code" },
        { title: "Mô tả", dataIndex: "desc", key: "description" },
        { title: "Bắt đầu", dataIndex: "start", key: "start" },
        { title: "Kết thúc", dataIndex: "end", key: "end" },
        {
            title: "Giảm theo", dataIndex: "kind", key: "kind", render: (
                (value) => {
                    return value === 'perc' ? 'Phần trăm' : 'Giá tiền';
                }
            )
        },
        { title: "Giá trị", dataIndex: "value", key: "value" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        {
            title: "Hành động", key: "action", render: (_, record) => {
                return (
                    <div className='d-flex justify-content-around align-items-center'>
                        <FaEye className='eye-show' onClick={() => { setSelectedCoupon(record) }} />
                        <CustomButton btnBG={'danger'} btnName={<FaTrashAlt />} handleClick={() => { onHandleRemoveCoupon(record) }} />
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        if (selectedCoupon) {
            setValue("description", selectedCoupon.desc);
            setValue("startDate", formatToDateTimeLocal(selectedCoupon.start)); // Định dạng lại start
            setValue("endDate", formatToDateTimeLocal(selectedCoupon.end)); // Định dạng lại end
            setValue(
                "value",
                selectedCoupon.kind === 'perc'
                    ? parseInt(selectedCoupon.value)
                    : parseInt(selectedCoupon.value.replace(' VND', ''))
            );
            setValue("quantity", selectedCoupon.quantity);
            setCouponType(selectedCoupon.kind === 'perc' ? 'percent' : 'price');
            setOpenModal(true); // Mở modal khi có selectedCoupon
        }
    }, [selectedCoupon, setValue]);

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
    const [size, setSize] = useState(10);
    const handleGetCouponAPI = () => {
        axiosInstance.get(`/staff/coupons?page=${currentPage}&size=${size}`).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    const mappedCoupons = response.data.data.content.map(coupon => ({
                        id: coupon.id,
                        code: coupon.code,
                        desc: coupon.description,
                        start: coupon.startDate,
                        end: coupon.endDate,
                        kind: coupon.disPercent !== null ? 'perc' : 'price',
                        value: coupon.disPercent !== null ? `${coupon.disPercent}%` : `${formatCurrency(coupon.disPrice)} VND`, // Sửa cú pháp ở đây
                        quantity: coupon.quantity || 'N/A'
                    }));

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
        }, [currentPage, size]
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

    const formatToDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            axiosInstance.post("/staff/coupons", formattedData).then(
                (response) => {
                    if (response.status === 403) {
                        toast.error('Bạn không có quyền thực hiện công việc này !')
                    } else {
                        if (response?.data?.errorCode === 200) {
                            toast.success("Thêm thành công!");
                            reset();
                            setOpenModal(false);
                            setLoading(false);
                            handleGetCouponAPI();
                        } else {
                            toast.error(response?.data?.message || "Không thể thực hiện công việc !");
                        }
                    }
                }
            );

        } catch (error) {
            console.error("Error adding coupon:", error);
            toast.error("An error occurred while adding the coupon.");
        }
    };

    const onHandleRemoveCoupon = (selectedCoupon) => {
        if (selectedCoupon) {
            console.log('selected');

            Swal.fire(
                {
                    title: 'Bạn có chắc không ?',
                    text: 'Bạn có thể không thể khôi phục lại thông tin này !',
                    icon: 'question',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel'
                }
            ).then(
                (confirm) => {
                    if (confirm.isConfirmed) {
                        axiosInstance.delete(`/staff/coupons?id=${selectedCoupon?.id}`).then(
                            (response) => {
                                if (response.data?.errorCode === 200) {
                                    handleGetCouponAPI();
                                    toast.success('Xóa thành công !');
                                } else {
                                    toast.error('Không thể thực thi công việc. Vui lòng thử lại !');
                                }
                            }
                        ).catch(
                            (error) => {
                                console.log(error);

                                if (error.status === 403) {
                                    toast.error('Bạn không có quyền thực hiện công việc này !');
                                }
                            }
                        );
                    }
                }
            );
        }
    };

    const onSubmitUpdate = async (data) => {
        if (selectedCoupon) {

            const formattedData = {
                description: data.description,
                disPercent: couponType === "percent" ? data.value : null,
                disPrice: couponType === "price" ? data.value : null,
                startDate: formatDateToPattern(data.startDate),
                endDate: formatDateToPattern(data.endDate),
                quantity: data.quantity,
            };
            axiosInstance.put(`/staff/coupons?id=${selectedCoupon?.id}`, formattedData).then(
                (response) => {
                    if (response.data?.errorCode) {
                        reset();
                        handleGetCouponAPI();
                        setSelectedCoupon(null);
                        toast.success('Chỉnh sửa thành công !');
                    } else {
                        toast.error('Không thể thực thi công việc. Vui lòng thử lại !');
                    }
                }
            ).catch(
                (error) => {
                    console.log(error);
                    if (error.status === 403) {
                        toast.error('Bạn không có quyền thực hiện công việc này !');
                    }
                }
            );
        }
    }

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
                    {size === totalElements ?
                        (
                            <span className='text-primary' onClick={() => { setSize(10) }}>{`Sort >`}</span>
                        ) :
                        (
                            <span className='text-primary' onClick={() => { setSize(totalElements) }}>{`View all >`}</span>
                        )
                    }
                </p>
                {totalPage > 1 && (
                    <Pagination className='border-0'>
                        <Pagination.First onClick={() => { setCurrentPage(0) }}>{`<`}</Pagination.First>
                        {paginationItems}
                        <Pagination.Last onClick={() => { setCurrentPage(totalPage - 1) }}>{`>`}</Pagination.Last>
                    </Pagination>
                )}
            </div>
            <ModalSft
                open={isOpenModal}
                title={selectedCoupon ? 'Update coupon' : 'Create new coupon'}
                titleOk={selectedCoupon ? 'Save' : 'Create'}
                onCancel={() => {
                    setOpenModal(false);
                    setCouponType("percent");
                    setSelectedCoupon(null);
                    reset();
                }}
                onOk={selectedCoupon ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmit)}
            >
                <Form>
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
                                    today.setHours(0, 0, 0, 0); // Đặt hôm nay về đầu ngày (00:00:00)
                                    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tính ngày mai

                                    if (selectedDate < tomorrow) {
                                        return "Start date must be tomorrow or later.";
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
                                defaultValue={selectedCoupon ? selectedCoupon.kind === 'perc' ? 'percent' : 'price' : 'percent'}
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
                placeholder={`Enter ${
                  couponType === "percent" ? "percentage" : "price"
                } value`}
              />

              <InputGroup.Text>
                {couponType === "percent" ? "%" : "VND"}
              </InputGroup.Text>
            </InputGroup>
            {errors.value && (
              <span className="text-danger">{errors.value.message}</span>
            )}
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
};

export default CouponTable;
