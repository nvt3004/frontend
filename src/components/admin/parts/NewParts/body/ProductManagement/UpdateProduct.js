import React, { useEffect, useState } from 'react';
import { RiAddBoxFill, RiRefreshFill } from "react-icons/ri";
import CustomButton from '../../component/CustomButton';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import ImagesDropzone from './ImagesDropzone';
import { useDropzone } from 'react-dropzone';
import { FaTrash } from "react-icons/fa";
import { motion } from 'framer-motion';
import Select from 'react-select';
import axiosInstance from '../../../../../../services/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import { FileToBase64 } from '../../../../../../services/fileToBase64';
import Swal from 'sweetalert2';
import { MdModeEdit } from "react-icons/md";
import { HiCheck } from "react-icons/hi";
import { ImCancelCircle } from "react-icons/im";

const UpdateProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // START SET selectedProduct
    const [selectedProduct, setSelectedProduct] = useState(null);
    const handleRefreshSelectedProduct = () => {
        axiosInstance.get(`/staff/product/refresh/${location?.state?.product?.id}`).then(
            (response) => {
                if (response?.data?.code === 200) {
                    setSelectedProduct(response?.data?.data);
                } else {
                    toast.error(`Couldn't refresh product infomations. Please try again !`);
                }
            }
        );
    }
    useEffect(
        () => {
            if (location?.state?.product) {
                // setSelectedProduct(location?.state?.product);
                handleRefreshSelectedProduct();
            }
        }, [location?.state]
    );
    useEffect(
        () => {
            console.log('selected product: ', selectedProduct);

        }, [selectedProduct]
    );
    // END SET selectedProduct

    // START CONFIG ADD NEW VERSION MODAL
    const [openNewVersion, setOpenNewVersion] = useState(false);
    // END CONFIG ADD NEW VERSION MODAL

    // START useForm()
    const { register, formState: { errors }, control, reset, setValue, getValues, setError, trigger } = useForm();
    // END useForm()

    // START SET categories
    const [categories, setCategories] = useState([]);
    useEffect(
        () => {
            axiosInstance.get('/home/category/dashboard/get-all').then(
                (response) => {
                    if (response?.data?.code === 200) {
                        let list = response?.data?.data?.map(item => ({
                            value: item?.categoryId,
                            label: item?.categoryName,
                        })).sort((a, b) => a.value - b.value);

                        setCategories(list);
                    } else {
                        toast.error(`Couldn't get the category list. Please try again !`);
                    }
                }
            );
        }, []
    );
    useEffect(
        () => {
            console.log('categories: ', categories);

        }, [categories]
    )
    // END SET categories

    // START CONFIG react-dropzone
    const [imagePreview, setImagePreview] = useState(null);
    const [imageVersionPreview, setImageVersionPreview] = useState(null);
    const onDropMainImage = (file) => {
        const preview = file?.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setImagePreview(preview[0]);
    }
    const onDropVersionImage = (file) => {
        const preview = file?.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setImageVersionPreview(preview[0]);
    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (openNewVersion || versionID) {
                onDropVersionImage(acceptedFiles)
            } else {
                onDropMainImage(acceptedFiles);
            }
        },
        accept: { 'image/*': [] },
        ...({ maxFiles: 1, multiple: false }),
    });
    // END CONFIG react-dropzone

    // START SET changeMainInfo
    const [changeMainInfo, setChangeMainInfo] = useState(false);
    const handleCancelChangeMainInfo = () => {
        setChangeMainInfo(false);
        setImagePreview(null);
        reset(['name', 'categories'])
    }
    const handleSubmitChangeMainInfo = async () => {
        if (imagePreview) {
            setValue('image', await FileToBase64(imagePreview));
        }
        const mainInfoData = {
            id: selectedProduct?.id,
            name: getValues('name') || selectedProduct?.productName,
            image: getValues('image') || '',
            categories: getValues('categories')?.length > 0
                ? getValues('categories')
                : selectedProduct?.categories
        };

        console.log('value: ', mainInfoData);
        axiosInstance.put('/staff/product/update', mainInfoData).then(
            (response) => {
                if (response?.data?.code === 200) {
                    toast.success('Updated product main infomations successfully !');
                    setChangeMainInfo(false);
                    setImagePreview(null);
                    handleRefreshSelectedProduct();
                } else {
                    toast.error(`Couldn't update the this product main infomations. Please try again !`);
                };
            }
        );
    }
    // END SET changeMainInfo

    // START SET attributes
    const [attributes, setAttributes] = useState({ sizes: [], colors: [] });
    useEffect(() => {
        axiosInstance.get('/admin/attribute/all').then(
            (response) => {
                if (response?.data?.code === 200) {
                    const fetchData = response?.data?.data;
                    let fetchSizes = [];
                    let fetchColors = [];

                    fetchData.forEach(item => {
                        if (item.attributeName === 'Color') {
                            fetchColors = item?.options?.map(i => ({
                                value: i?.id,
                                label: i?.value
                            }));
                        }
                        if (item.attributeName === 'Size') {
                            fetchSizes = item?.options?.map(i => ({
                                value: i?.id,
                                label: i?.value
                            }));
                        }
                    });
                    setAttributes(
                        {
                            colors: fetchColors,
                            sizes: fetchSizes
                        }
                    );

                } else {
                    toast.error(`Couldn't get the attribute list. Please try again !`);
                }
            }
        );
    }, []);
    // END SET attributes

    // START SET changeVersionInfo
    const [changeVersionInfo, setChangeVersionInfo] = useState(false);
    const [versionID, setVersionID] = useState(null);
    // END SET changeVersionInfo



    // START HANDLE changeVersionInfo
    const getDate = () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const MM = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên phải cộng thêm 1
        const yy = String(now.getFullYear()).slice(-2); // Lấy 2 số cuối của năm
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        return `${dd}${MM}${yy}-${hh}${mm}${ss}`;
    };

    const handleRemoveVersion = (version) => {
        Swal.fire(
            {
                title: 'Are you sure ?',
                text: 'You might not recover this product version !',
                icon: 'question',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            }
        ).then(
            (confirm) => {
                if (confirm.isConfirmed) {
                    axiosInstance.delete(`/staff/version/remove/${version?.id}`).then(
                        (response) => {
                            if (response?.data?.code === 200) {
                                toast.success('Deleted product version successfully !');
                                handleRefreshSelectedProduct();
                            } else {
                                toast.error(`Couldn't delete the this product version. Please try again !`);
                            }
                        }
                    );
                }
            }
        )
    }
    const handleAddNewVersion = async () => {
        let isValid = await trigger(['addNewSize', 'addNewColor', 'addNewRetailPrice', 'addNewWholesalePrice']);

        if (!imageVersionPreview) {
            setError('imageVersion', { type: 'manual', message: 'Version image is required!' });
            isValid = false;
        } else {
            setValue('imageVersion', await FileToBase64(imageVersionPreview));
        }

        if (!isValid) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        const data = getValues();

        const formattedData = {
            idProduct: selectedProduct?.id,
            versionName: `${selectedProduct?.productName}-ver-${getDate()}`,
            retailPrice: parseFloat(data.addNewRetailPrice),
            wholesalePrice: parseFloat(data.addNewWholesalePrice),
            image: {
                name: data?.imageVersion,
            },
            attributes: [
                {
                    id: data.addNewSize?.id,
                    key: "size",
                    value: data.addNewSize?.name
                },
                {
                    id: data.addNewColor?.id,
                    key: "color",
                    value: data.addNewColor?.name
                }
            ]
        };

        console.log("Data to be sent:", formattedData); // Log dữ liệu gửi lên API

        axiosInstance.post('/staff/version/add', formattedData).then(
            (response) => {
                if (response?.data?.code === 200) {
                    toast.success('Added product version successfully');
                    setOpenNewVersion(false);
                    reset(['addNewSize', 'addNewColor', 'addNewRetailPrice', 'addNewWholesalePrice']);
                    setImageVersionPreview(null);
                    handleRefreshSelectedProduct();
                } else {
                    console.error("API Error:", response.data);
                    toast.error(response.data?.message || `Couldn't add this product version. Please try again!`);
                }
            }
        ).catch((error) => {
            console.error("API Error:", error);
            toast.error("An error occurred while adding the product version.");
        });
    }

    const handleUpdateVersion = async () => {
        const version = selectedProduct?.versions.find(item => item?.id === versionID);
        console.log('found version: ', version);

        if (imageVersionPreview) {
            setValue('imageVersion', await FileToBase64(imageVersionPreview));
        } else {
            setValue('imageVersion', '');
        }

        const dataVersion = {
            id: version?.id,
            versionName: version?.versionName,
            retailPrice: getValues('retailPrice') || version?.retailPrice,
            wholesalePrice: getValues('wholesalePrice') || version?.wholesalePrice,
            image: {
                name: getValues('imageVersion') || ''
            }

        }

        console.log('version update data: ', dataVersion);
        axiosInstance.put('/staff/version/update', dataVersion).then(
            (response) => {
                if (response?.data?.code === 200) {
                    toast.success('Updated version successfully');
                    setVersionID(null);
                    setImageVersionPreview(null);
                    handleRefreshSelectedProduct()
                } else {
                    toast.error(`Couldn't update the this product version. Please try again !`);
                }
            }
        );
    }
    // END HANDLE changeVersionInfo

    const ChangeInput = (e, condition) => {
        if (!condition) {
            e.preventDefault();
        }
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><RiRefreshFill />&ensp;{`Update product`}</h4>
                        <p className='fw-medium'>{`Change product infomation`}</p>
                    </div>
                    {/* <div>
                        <CustomButton btnType={'button'} btnBG={'warning'} btnName={'Save'} textColor={'text-white'} />
                    </div> */}
                </div>
                <div className='d-flex justify-content-between custom-form'>
                    <div className='col-9 pe-3'>
                        <div>
                            <Form>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product name</Form.Label>
                                    <Form.Control className='py-2 custome-placeholder-font-12'
                                        type='text' placeholder='Write product name here'
                                        defaultValue={selectedProduct?.productName || ''}
                                        {...register('name', { required: true })}
                                        onKeyDown={(e) => { ChangeInput(e, changeMainInfo) }} />
                                    <p className='fs-6 fw-medium text-danger'>{errors?.name && `Product's name is required !`}</p>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product main image</Form.Label>
                                    <div className='bg-white border rounded-2 py-2 px-1'>
                                        {changeMainInfo && (
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} />
                                                <p>Drag 'n' drop some files here, or click to select files</p>
                                            </div>
                                        )}
                                        <div className='d-flex justify-content-around'>
                                            {imagePreview ? (
                                                <div className='position-relative' style={{ width: '100%' }}>
                                                    <img
                                                        src={imagePreview?.preview}
                                                        alt="Main preview"
                                                        style={{ width: '150px', height: 'auto' }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className='position-relative'>
                                                    <img
                                                        src={selectedProduct?.image}
                                                        alt="Main"
                                                        style={{ width: '150px', height: 'auto' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className='fs-6 fw-medium text-danger'>{errors?.image && errors?.image?.message}</p>
                                </Form.Group>
                            </Form>
                            <div className='d-flex justify-content-end'>
                                {!changeMainInfo && (
                                    <CustomButton btnBG={'warning'} btnName={'Change main info'} btnType={'button'} textColor={'text-white'} handleClick={() => { setChangeMainInfo(true) }} />
                                )}

                                {changeMainInfo &&
                                    (<div className='d-flex justify-content-around' style={{ minWidth: '200px' }}>
                                        <React.Fragment>
                                            <CustomButton btnBG={'danger'} btnName={'Cancel'} btnType={'button'} textColor={'text-white'} handleClick={handleCancelChangeMainInfo} />
                                            <CustomButton btnBG={'success'} btnName={'Save changed'} btnType={'button'} textColor={'text-white'} handleClick={handleSubmitChangeMainInfo} />
                                        </React.Fragment>

                                    </div>
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            <label className=' fs-4 fw-medium'>Product versions</label>
                            <div>
                                {selectedProduct ? (
                                    <Table hover striped>
                                        <thead>
                                            <th>Version name</th>
                                            <th>Size</th>
                                            <th>Color</th>
                                            <th>Quantity</th>
                                            <th>Retail price</th>
                                            <th>Wholesale price</th>
                                            <th>Remove</th>
                                            <th></th>
                                        </thead>
                                        <tbody>
                                            {selectedProduct?.versions.map(
                                                (version, index) => (
                                                    version?.active && (
                                                        <React.Fragment key={index}>
                                                            <tr className='custom-table'>
                                                                <td style={{ maxWidth: '250px' }}>{version?.versionName}</td>
                                                                <td>{version?.attributes[0]?.value}</td>
                                                                <td>{version?.attributes[1]?.value}</td>
                                                                <td>{version?.quantity}</td>
                                                                <td>
                                                                    {(version?.id === versionID) ?
                                                                        (
                                                                            <InputGroup>
                                                                                <Form.Control type='number'
                                                                                    placeholder='Retail price. . .'
                                                                                    {...register(`retailPrice`)}
                                                                                    onKeyDown={(e) => { ChangeInput(e, (version?.id === versionID)) }} />
                                                                                <InputGroup.Text>VND</InputGroup.Text>
                                                                            </InputGroup>
                                                                        ) :
                                                                        (
                                                                            `${version?.retailPrice} VND`
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {(version?.id === versionID) ?
                                                                        (
                                                                            <InputGroup>
                                                                                <Form.Control type='number'
                                                                                    placeholder='Wholesale price. . .'
                                                                                    {...register(`wholesalePrice`)}
                                                                                    onKeyDown={(e) => { ChangeInput(e, (version?.id === versionID)) }} />
                                                                                <InputGroup.Text>VND</InputGroup.Text>
                                                                            </InputGroup>
                                                                        ) :
                                                                        (
                                                                            `${version?.retailPrice} VND`
                                                                        )
                                                                    }
                                                                </td>
                                                                {selectedProduct?.versions.length > 1 && (
                                                                    <td>
                                                                        <CustomButton btnType={'button'}
                                                                            btnBG={'danger'} btnName={<FaTrash />}
                                                                            handleClick={() => { handleRemoveVersion(version) }} />
                                                                    </td>
                                                                )}
                                                                <td>
                                                                    <div style={{ minWidth: '90px' }}>
                                                                        {!(versionID === version?.id) ?
                                                                            (
                                                                                <div className='d-flex justify-content-center'>
                                                                                    <CustomButton btnType={'button'}
                                                                                        btnBG={'warning'} btnName={<MdModeEdit />} textColor={'text-white'}
                                                                                        handleClick={() => {
                                                                                            if (versionID) {
                                                                                                Swal.fire(
                                                                                                    {
                                                                                                        title: 'WARNING !!',
                                                                                                        text: 'You are on a another version update. Please cancel it if you want to move to this !',
                                                                                                        showConfirmButton: true,
                                                                                                        confirmButtonText: 'OK'
                                                                                                    }
                                                                                                )
                                                                                            } else {
                                                                                                setVersionID(version?.id);
                                                                                            }


                                                                                        }} />
                                                                                </div>
                                                                            ) :
                                                                            (
                                                                                <div className='d-flex justify-content-between'>
                                                                                    <CustomButton btnType={'button'}
                                                                                        btnBG={'success'} btnName={<HiCheck />} textColor={'text-white'}
                                                                                        handleClick={() => { handleUpdateVersion() }} />
                                                                                    <CustomButton btnType={'button'}
                                                                                        btnBG={'danger'} btnName={<ImCancelCircle />} textColor={'text-white'}
                                                                                        handleClick={() => { setVersionID(null); setImageVersionPreview(null); }} />
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={8}>
                                                                    {(versionID === version?.id) && (
                                                                        <div {...getRootProps({ className: 'dropzone' })}>
                                                                            <input {...getInputProps()} />
                                                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                                                        </div>
                                                                    )}
                                                                    {
                                                                        imageVersionPreview && versionID === version?.id ?
                                                                            (
                                                                                <img src={imageVersionPreview?.preview} alt={version?.versionName} style={{ width: '150px', height: 'auto' }} />
                                                                            ) :
                                                                            (
                                                                                <img src={version?.image?.name} alt={version?.versionName} style={{ width: '150px', height: 'auto' }} />
                                                                            )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    )
                                                )
                                            )}
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className='d-flex justify-content-center'>
                                                        <div className='d-flex justify-content-around' style={{ minWidth: '350px' }}>
                                                            <CustomButton btnBG={'warning'} btnName={'Add new version'} btnType={'button'} textColor={'text-white'}
                                                                handleClick={() => { setOpenNewVersion(true); setVersionID(null); setImageVersionPreview(null); }} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div className='bg-white rounded-2 border py-2 px-4'>
                            <h5 className='mb-3 fs-4'>Category</h5>
                            <Form>
                                <Form.Group className="mb-3">
                                    <div className="d-flex align-items-center mb-1">
                                        <Form.Label className="fs-6 fw-medium mb-0">Category</Form.Label>
                                        <motion.label
                                            className="ms-3 mb-0 font-12 fw-medium text-primary"
                                            whileHover={{ opacity: 0.8, scale: 1.08 }}
                                        >
                                            New category
                                        </motion.label>
                                    </div>
                                    <Controller
                                        name="addNewCategories"
                                        control={control}
                                        rules={{ required: true }}
                                        defaultValue={
                                            selectedProduct?.categories && selectedProduct.categories.length > 0
                                                ? [{ value: selectedProduct.categories[0].id, label: selectedProduct.categories[0].name }]
                                                : []
                                        }

                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={categories}
                                                placeholder="Select category..."
                                                value={
                                                    field.value && field.value.length > 0 && field.value[0]
                                                        ? { value: field.value[0].id, label: field.value[0].name }
                                                        : selectedProduct?.categories && selectedProduct.categories.length > 0
                                                            ? [{ value: selectedProduct.categories[0].id, label: selectedProduct.categories[0].name }]
                                                            : []
                                                }
                                                onChange={(selectedOption) => {
                                                    field.onChange(
                                                        selectedOption ? [{ id: selectedOption.value, name: selectedOption.label }] : []
                                                    );
                                                }}
                                            />
                                        )}
                                    />
                                    <p className="fs-6 fw-medium text-danger">
                                        {errors?.categories && `Product's category is required!`}
                                    </p>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Form>
                    <Modal show={openNewVersion} size='lg'>
                        <Modal.Body>
                            <div>
                                <h5 className='mb-3 fs-4'>Attributes</h5>

                                <div className='d-flex justify-content-between'>
                                    <Form.Group className="mb-3" style={{ minWidth: '350px' }}>
                                        <div className="d-flex align-items-center mb-1">
                                            <Form.Label className="fs-6 fw-medium mb-0">Sizes</Form.Label>
                                            <motion.label
                                                className="ms-3 mb-0 font-12 fw-medium text-primary"
                                                whileHover={{ opacity: 0.8, scale: 1.08 }}
                                            >
                                                New size
                                            </motion.label>
                                        </div>
                                        <Controller
                                            name="addNewSize"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={attributes?.sizes}
                                                    placeholder="Select size..."
                                                    isClearable
                                                    value={attributes?.colors.find(option => option.value === field.value?.id)} // Sửa dòng này
                                                    onChange={(selectedOption) => {
                                                        field.onChange(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : null);
                                                    }}
                                                />
                                            )}
                                        />
                                        <p className="fs-6 fw-medium text-danger">
                                            {errors.addNewSize && `Size is required!`}
                                        </p>
                                    </Form.Group>

                                    <Form.Group className="mb-3" style={{ minWidth: '350px' }}>
                                        <div className="d-flex align-items-center mb-1">
                                            <Form.Label className="fs-6 fw-medium mb-0">Colors</Form.Label>
                                            <motion.label
                                                className="ms-3 mb-0 font-12 fw-medium text-primary"
                                                whileHover={{ opacity: 0.8, scale: 1.08 }}
                                            >
                                                New color
                                            </motion.label>
                                        </div>
                                        <Controller
                                            name="addNewColor"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={attributes?.colors}
                                                    placeholder="Select color..."
                                                    isClearable
                                                    value={attributes?.colors.find(option => option.value === field.value?.id)} // Sửa dòng này
                                                    onChange={(selectedOption) => {
                                                        field.onChange(selectedOption ? { id: selectedOption.value, name: selectedOption.label } : null);
                                                    }}
                                                />
                                            )}
                                        />
                                        <p className="fs-6 fw-medium text-danger">
                                            {errors.addNewColor && `Color is required!`}
                                        </p>
                                    </Form.Group>
                                </div>
                                <div className='d-flex justify-content-between mb-3'>
                                    <Form.Group style={{ minWidth: '350px' }}>
                                        <Form.Label>Retail price</Form.Label>
                                        <Form.Control
                                            placeholder='Retail price...'
                                            {...register("addNewRetailPrice", { required: true })}
                                        />
                                        <p className='fs-6 text-danger fw-medium'>{errors.addNewRetailPrice && `Retail price is required!`}</p>
                                    </Form.Group>
                                    <Form.Group style={{ minWidth: '350px' }}>
                                        <Form.Label>Wholesale price</Form.Label>
                                        <Form.Control
                                            placeholder='Whole price...'
                                            {...register("addNewWholesalePrice", { required: true })}
                                        />
                                        <p className='fs-6 text-danger fw-medium'>{errors.addNewWholesalePrice && `Wholesale price is required!`}</p>
                                    </Form.Group>
                                </div>
                                <div>
                                    <Form.Group>
                                        <Form.Label>Version image</Form.Label>
                                        <div {...getRootProps({ className: 'dropzone' })}>
                                            <input {...getInputProps()} />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        </div>
                                        {imageVersionPreview && (
                                            <div className='position-relative' style={{ width: '100%' }}>
                                                <img
                                                    src={imageVersionPreview?.preview}
                                                    alt="Main preview"
                                                    style={{ width: '150px', height: 'auto' }}
                                                />
                                            </div>
                                        )}
                                        <p className='fs-6 text-danger fw-medium'>{errors.imageVersion && `Version image is required!`}</p>
                                    </Form.Group>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className=''>
                                <div className='d-flex justify-content-around' style={{ minWidth: '130px' }}>
                                    <CustomButton btnType={'button'} btnBG={'success'} btnName={'Add'} handleClick={() => { handleAddNewVersion() }} />
                                    <CustomButton btnBG={'danger'} btnName={'Cancel'}
                                        handleClick={
                                            () => {
                                                setOpenNewVersion(false);
                                                reset(['addNewSize', 'addNewColor', 'addNewRetailPrice', 'addNewWholesalePrice']);
                                                setImageVersionPreview(null)
                                            }
                                        } />
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default UpdateProduct;
