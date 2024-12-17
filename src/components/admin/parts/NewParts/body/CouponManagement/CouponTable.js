import React, { useEffect, useRef, useState } from "react";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import axiosInstance from "../../../../../../services/axiosConfig";
import { Button, Form, InputGroup, Pagination } from "react-bootstrap";
import ModalSft from "../../../../ModalSft";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import CustomButton from "../../component/CustomButton";
import { Plus, Pencil, Trash } from "phosphor-react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { formatCurrency } from "../../../../../../services/formatCurrency";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import moment from "moment";
import { getProfile } from "../../../../../../services/api/OAuthApi";

const CouponTable = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setValue,
        setError,
        clearErrors
    } = useForm();

    const [profile, setProfile] = useState(null);
    const handleGetProfile = async () => {
        try {
            const data = await getProfile();
            if (data) {
                setProfile(data?.listData);
                setLoading(false)
            } else {
                console.log('Không tìm thấy user hoặc không có dữ liệu hợp lệ');
            }
        } catch (error) {
            console.error("Lỗi khi gọi API getProfile:", error);
        }
    }
    useEffect(
        () => {
            handleGetProfile();
        }, []
    );
    const [permissions, setPermissions] = useState([]);
    const handleGetPermission = () => {
        if (profile) {
            axiosInstance.get(`/staff/userpermissions/${profile?.userId}`).then(
                (response) => {
                    if (response) {
                        setPermissions(response.data?.data.find(item => item.title === 'Coupon'));
                        setLoading(false);
                    }
                }
            ).catch(
                (error) => {
                    if (error) {
                        console.log("Error while get permission: ", error);
                        setLoading(false);
                    }
                }
            );
        }
    }
    useEffect(
        () => {
            handleGetPermission();
        }, [profile]
    );
    // useEffect(
    //     () => {
    //         console.log("permissions: ", permissions);

    //     }, [permissions]
    // );



    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const collumn = [
        { title: "Mã", dataIndex: "code", key: "code" },
        { title: "Mô tả", dataIndex: "desc", key: "description" },
        { title: "Bắt đầu", dataIndex: "start", key: "start" },
        { title: "Kết thúc", dataIndex: "end", key: "end" },
        {
            title: "Giảm theo",
            dataIndex: "kind",
            key: "kind",
            render: (value) => {
                return value === "perc" ? "Phần trăm" : "Giá tiền";
            },
        },
        { title: "Giá trị", dataIndex: "value", key: "value" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        // {
        //     title: "Hành động",
        //     key: "action",
        //     render: (_, record) => {
        //         return (
        //             <div>
        //                 <button
        //                     className="btn btn-dark btn-sm me-2"
        //                     onClick={() => setSelectedCoupon(record)}
        //                 >
        //                     <Pencil weight="fill" />
        //                 </button>
        //                 <button
        //                     className="btn btn-danger btn-sm"
        //                     onClick={() => onHandleRemoveCoupon(record)}
        //                 >
        //                     <Trash weight="fill" />
        //                 </button>
        //             </div>
        //         );
        //     },
        // },
    ];

    if (permissions) {
        const editPerm = permissions?.permission?.find((item) => item.name === "Update");
        const removePerm = permissions?.permission?.find((item) => item.name === "Delete");
        if (editPerm?.use === true || removePerm?.use === true) {
            collumn.push(
                {
                    title: "Hành động",
                    key: "action",
                    render: (_, record) => {

                        return (
                            <div>
                                {editPerm?.use === true && (
                                    <button
                                        className="btn btn-dark btn-sm me-2"
                                        onClick={() => setSelectedCoupon(record)}
                                    >
                                        <Pencil weight="fill" />
                                    </button>
                                )}
                                {removePerm?.use === true && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onHandleRemoveCoupon(record)}
                                    >
                                        <Trash weight="fill" />
                                    </button>
                                )}
                            </div>
                        );
                    },
                },
            );
        }
    }

    useEffect(() => {
        if (selectedCoupon) {
            console.log(selectedCoupon);

            setValue("description", selectedCoupon.desc);
            setValue(
                "value",
                selectedCoupon.kind === "perc"
                    ? parseInt(selectedCoupon.value)
                    : parseInt(selectedCoupon.value.replace(" ₫", ""))
            );
            setStartDate(moment(selectedCoupon.start, "dd/MM/yyyy HH:mm").toDate());
            setEndDate(moment(selectedCoupon.end, "dd/MM/yyyy HH:mm").toDate());
            setValue("quantity", selectedCoupon.quantity);
            setCouponType(selectedCoupon.kind === "perc" ? "percent" : "price");
            setOpenModal(true); // Mở modal khi có selectedCoupon
        }
    }, [selectedCoupon, setValue]);

    const [coupons, setCoupons] = useState([
        {
            code: "",
            desc: "",
            start: "",
            end: "",
            kind: "",
            value: "",
            quantity: "",
        },
    ]);

    const triggers = () => {
        if (permissions) {
            const addPerm = permissions?.permission?.find((item) => item.name === "Add");
            if (addPerm && addPerm.use === true) {
                return (
                    <div className="d-flex">
                        <Button
                            variant="dark"
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            Thêm mới <Plus />
                        </Button>
                    </div>
                );
            }
        }

    };

    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [size, setSize] = useState(10);
    const handleGetCouponAPI = () => {
        axiosInstance
            .get(`/staff/coupons?page=${currentPage}&size=${size}`)
            .then((response) => {
                if (response?.data?.errorCode === 200) {
                    const mappedCoupons = response.data.data.content.map((coupon) => ({
                        id: coupon.id,
                        code: coupon.code,
                        desc: coupon.description,
                        start: coupon.startDate,
                        end: coupon.endDate,
                        kind: coupon.disPercent !== null ? "perc" : "price",
                        value:
                            coupon.disPercent !== null
                                ? `${coupon.disPercent}%`
                                : `${formatCurrency(coupon.disPrice)} ₫`, // Sửa cú pháp ở đây
                        quantity: coupon.quantity || "N/A",
                    }));

                    setCoupons(mappedCoupons);

                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                }
            });
    };
    useEffect(() => {
        handleGetCouponAPI();
    }, [currentPage, size]);
    const handleSetPage = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };
    const paginationItems = [];
    for (let number = 0; number < totalPage; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handleSetPage(number)}
            >
                {number + 1}
            </Pagination.Item>
        );
    }

    const [isOpenModal, setOpenModal] = useState(false);
    const [couponType, setCouponType] = useState("percent");

    const formatDateToPattern = (dateString) => {
        const date = new Date(dateString);
        date.toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
        });
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatToDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setMinutes(today.getMinutes() + 1);
        return today;
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + 90);
        return today;
    });
    const resetDate = () => {
        setStartDate(() => {
            const today = new Date();
            today.setMinutes(today.getMinutes() + 1);
            return today;
        });
        setEndDate(() => {
            const today = new Date();
            today.setDate(today.getDate() + 90);
            return today;
        });
    };

    const onSubmit = async (data) => {
        const maxDate = new Date(startDate);
        maxDate.setMonth(startDate.getMonth() + 3);
        const newDate = new Date();
        const now = moment(newDate, 'dd/MM/yyyy HH:mm').toDate();

        console.log(startDate)

        if (now > moment(startDate, 'dd/MM/yyyy HH:mm').toDate()) {
            console.log('ngày bắt đầu sai');

            setError("startDate", {
                type: "manual",
                message: "Thời gian bắt đầu phải ngay tại bây giờ hoặc xa hơn",
            });
            return;
        } else if (startDate > endDate) {
            setError("startDate", {
                type: "manual",
                message: "Ngày bắt đầu phải trước ngày hết hạn",
            });
            return;
        } else if (endDate > maxDate) {
            setError("endDate", {
                type: "manual",
                message: "Thời hạn sử dụng của phiếu chỉ trong vòng 3 tháng",
            });
            return;
        }

        const formattedData = {
            description: data.description,
            disPercent: couponType === "percent" ? data.value : null,
            disPrice: couponType === "price" ? data.value : null,
            startDate: formatDateToPattern(startDate),
            endDate: formatDateToPattern(endDate),
            quantity: data.quantity,
        };

        console.log(formattedData);

        try {
            await axiosInstance
                .post("/staff/coupons", formattedData)
                .then((response) => {
                    if (response.status === 403) {
                        toast.error("Bạn không có quyền thực hiện công việc này !");
                    } else {
                        if (response?.data?.errorCode === 200) {
                            toast.success("Thêm thành công!");
                            reset();
                            setOpenModal(false);
                            setLoading(false);
                            handleGetCouponAPI();
                            setCouponType("percent");
                            resetDate();
                        } else {
                            resetDate();
                            toast.error(
                                response?.data?.message || "Không thể thực hiện công việc !",
                                { autoClose: 3000 }
                            );
                        }
                    }
                });
        } catch (error) {
            console.error("Error adding coupon:", error);
            if (error) {
                if (error.response?.status === 998) {
                    resetDate();
                    toast.error(
                        error?.response?.data?.message ||
                        "Bạn không có quyền thực hiện công việc này"
                    );
                } else {
                    resetDate();
                    toast.error(
                        error?.response?.data?.message ||
                        "Đã có lỗi xảy ra. Vui lòng liên hệ kỹ thuật !"
                    );
                }
            }
        }
    };

    const onHandleRemoveCoupon = (selectedCoupon) => {
        if (selectedCoupon) {
            console.log("selected");

            Swal.fire({
                title: "Bạn có chắc không ?",
                text: "Bạn có thể không thể khôi phục lại thông tin này !",
                icon: "question",
                showConfirmButton: true,
                confirmButtonText: "OK",
                showCancelButton: true,
                cancelButtonText: "Cancel",
            }).then((confirm) => {
                if (confirm.isConfirmed) {
                    axiosInstance
                        .delete(`/staff/coupons?id=${selectedCoupon?.id}`)
                        .then((response) => {
                            if (response.data?.errorCode === 200) {
                                handleGetCouponAPI();
                                resetDate();
                                toast.success("Xóa thành công !");
                            } else {
                                toast.error("Không thể thực thi công việc. Vui lòng thử lại !");
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            if (error) {
                                if (error.response?.status === 998) {
                                    toast.error(
                                        error?.response?.data?.message ||
                                        "Bạn không có quyền thực hiện công việc này"
                                    );
                                } else {
                                    toast.error(
                                        error?.response?.data?.message ||
                                        "Đã có lỗi xảy ra. Vui lòng liên hệ kỹ thuật !"
                                    );
                                }
                            }
                        });
                }
            });
        }
    };

    const onSubmitUpdate = async (data) => {
        if (selectedCoupon) {
            alert(1);
            const maxDate = new Date(startDate);
            maxDate.setMonth(startDate.getMonth() + 3);

            if (startDate > endDate) {
                setError("startDate", {
                    type: "manual",
                    message: "Ngày bắt đầu phải trước ngày hết hạn",
                });
                return;
            } else if (endDate > maxDate) {
                setError("endDate", {
                    type: "manual",
                    message: "Thời hạn sử dụng của phiếu chỉ trong vòng 3 tháng",
                });
                return;
            }
            const formattedData = {
                description: data.description,
                disPercent: couponType === "percent" ? data.value : null,
                disPrice: couponType === "price" ? data.value : null,
                startDate: formatDateToPattern(startDate),
                endDate: formatDateToPattern(endDate),
                quantity: data.quantity,
            };
            axiosInstance
                .put(`/staff/coupons?id=${selectedCoupon?.id}`, formattedData)
                .then((response) => {
                    if (response.data?.errorCode) {
                        reset();
                        handleGetCouponAPI();
                        setSelectedCoupon(null);
                        setCouponType("percent");
                        setOpenModal(false);
                        toast.success("Chỉnh sửa thành công !");
                    } else {
                        toast.error("Không thể thực thi công việc. Vui lòng thử lại !");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error) {
                        if (error.response?.status === 998) {
                            resetDate();
                            toast.error(
                                error?.response?.data?.message ||
                                "Bạn không có quyền thực hiện công việc này"
                            );
                        } else {
                            resetDate();
                            toast.error(
                                error?.response?.data?.message ||
                                "Đã có lỗi xảy ra. Vui lòng liên hệ kỹ thuật !"
                            );
                        }
                    }
                });
        }
    };

    return (
        <div>
            <FullScreenSpinner isLoading={loading} />
            <DataTableSft
                columns={collumn}
                title={"Danh sách phiếu giảm giá"}
                dataSource={coupons}
                buttonTable={triggers()}
            />
            <div className="bg-body-tertiary d-flex justify-content-between align-items-center container pt-2">
                <p className="font-13">
                    {`${(currentPage + 1) * 10 <= totalElements
                        ? (currentPage + 1) * 10
                        : totalElements
                        } of ${totalElements} `}
                    {size === totalElements ? (
                        <span
                            className="text-primary"
                            onClick={() => {
                                setSize(10);
                            }}
                        >{`Sort >`}</span>
                    ) : (
                        <span
                            className="text-primary"
                            onClick={() => {
                                setSize(totalElements);
                            }}
                        >{`View all >`}</span>
                    )}
                </p>
                {totalPage > 1 && (
                    <Pagination className="border-0">
                        <Pagination.First
                            onClick={() => {
                                setCurrentPage(0);
                            }}
                        >{`<`}</Pagination.First>
                        {paginationItems}
                        <Pagination.Last
                            onClick={() => {
                                setCurrentPage(totalPage - 1);
                            }}
                        >{`>`}</Pagination.Last>
                    </Pagination>
                )}
            </div>
            <ModalSft
                open={isOpenModal}
                title={
                    selectedCoupon ? "Cập nhật phiếu giảm giá" : "Thêm phiếu giảm giá mới"
                }
                titleOk={selectedCoupon ? "Lưu" : "Thêm"}
                onCancel={() => {
                    setOpenModal(false);
                    setCouponType("percent");
                    setSelectedCoupon(null);
                    resetDate();
                    reset();
                }}
                onOk={
                    selectedCoupon ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmit)
                }
            >
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>
                            Mô tả <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            {...register("description", {
                                required: "Không được bỏ trống.",
                            })}
                            placeholder="Coupon's description"
                        />
                        {errors.description && (
                            <span className="text-danger">{errors.description.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <label>
                            Ngày bắt đầu <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => { setStartDate(date); clearErrors('startDate') }}
                            // dateFormat="dd/MM/yyyy"
                            dateFormat="yyyy/MM/dd HH:mm"
                            showTimeSelect
                            locale={vi}
                            placeholderText="dd/mm/yyyy"
                            className="form-control"
                        />
                        {errors.startDate && (
                            <span className="text-danger">{errors.startDate.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <label>
                            Ngày kết thúc <span className="text-danger">*</span>
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => { setEndDate(date); clearErrors('endDate') }}
                            // dateFormat="dd/MM/yyyy"
                            dateFormat="yyyy/MM/dd HH:mm"
                            showTimeSelect
                            locale={vi}
                            placeholderText="dd/mm/yyyy"
                            className="form-control"
                        />
                        {errors.endDate && (
                            <span className="text-danger">{errors.endDate.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            Loại giảm giá <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                            <Form.Select
                                defaultValue={
                                    selectedCoupon
                                        ? selectedCoupon.kind === "perc"
                                            ? "percent"
                                            : "price"
                                        : "percent"
                                }
                                onChange={(e) => setCouponType(e.target.value)}
                                style={{ maxWidth: "150px" }}
                            >
                                <option value="percent">Phần trăm</option>
                                <option value="price">Giá tiền</option>
                            </Form.Select>

                            <Form.Control
                                type="number"
                                step={couponType === "percent" ? 1 : 1000}
                                {...register("value", {
                                    required: "Không được bỏ trống.",
                                    validate: (value) => {
                                        if (couponType === "percent") {
                                            if (value < 5 || value > 50) {
                                                return "Giá trị giảm phải từ 5 - 50%";
                                            }
                                        } else if (couponType === "price") {
                                            if (value < 5000 || value > 100000) {
                                                return "Giá trị giảm phải từ 5.000 - 100.000";
                                            }
                                        }
                                        return true;
                                    },
                                })}
                                placeholder={`Giá trị giảm`}
                            />

                            <InputGroup.Text>
                                {couponType === "percent" ? "%" : "₫"}
                            </InputGroup.Text>
                        </InputGroup>
                        {errors.value && (
                            <span className="text-danger">{errors.value.message}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>
                            Số lượng <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            {...register("quantity", {
                                required: "Không được bỏ trống.",
                                min: { value: 1, message: "Số lượng phải lớn hơn 1" },
                            })}
                            placeholder="Số lượng phiếu giảm giá"
                        />
                        {errors.quantity && (
                            <span className="text-danger">{errors.quantity.message}</span>
                        )}
                    </Form.Group>
                </Form>
            </ModalSft>
        </div>
    );
};

export default CouponTable;
