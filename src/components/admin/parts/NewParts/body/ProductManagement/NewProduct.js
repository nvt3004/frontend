import React, { useEffect, useRef, useState, version } from 'react';
import { Button, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import { RiAddBoxFill } from "react-icons/ri";
import CustomButton from '../../component/CustomButton';
import suppliers from '../SuppliersManagement/data';
import Variants from './Variants';
import Organize from './Organize';
import EmptyValues from '../../component/errorPages/EmptyValues';
import ImagesDropzone from './ImagesDropzone';
import { MdArtTrack, MdDeleteForever } from "react-icons/md";
import SupplierModal from '../SuppliersManagement/SupplierModal';
import axiosInstance from '../../../../../../services/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import { set, useForm } from 'react-hook-form';
import { FileToBase64, FilesToBase64 } from '../../../../../../services/fileToBase64';
import { useLocation } from 'react-router-dom';

const NewProduct = () => {
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const handleGetCategory = () => {
        axiosInstance.get('/home/category/dashboard/get-all').then(
            (response) => {
                if (response?.data?.code === 200) {
                    let list = response?.data?.data?.map(item => ({
                        value: item?.categoryId,
                        label: item?.categoryName,
                    })).sort((a, b) => b.value - a.value);

                    setCategories(list);
                } else {
                    toast.error(`Couldn't get the category list. Please try again !`);
                }
            }
        );
    }
    useEffect(() => {
        handleGetCategory();
    }, []);

    const [attributes, setAttributes] = useState({
        sizes: [],
        colors: []
    });
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

    const defaultValues = location?.state?.product;
    const { register, trigger, setValue, getValues, formState: { errors }, setError, control, watch, reset, handleSubmit } = useForm({ defaultValues });

    const [selectedSizes, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColor] = useState([]);
    const [variants, setVariants] = useState([]);
    const handleSetVariants = () => {
        const newVariants = [];
        selectedSizes.forEach(size => {
            selectedColors.forEach(color => {
                newVariants.push({
                    attributes: [
                        {
                            id: size?.value,
                            key: 'Size',
                            value: size?.label
                        },
                        {
                            id: color?.value,
                            key: 'Color',
                            value: color?.label
                        }
                    ],
                    images: [],
                });
            });
        });
        setVariants(newVariants);
    };
    useEffect(() => {
        handleSetVariants();
    }, [selectedSizes, selectedColors]);
    // useEffect(() => {
    //     console.log("variant: ", variants);

    // }, [variants]);

    const handleDrop = (files, versionIndex) => {
        const newImages = files.map((file, index) => (
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        ));

        setVariants((prevVariants) =>
            prevVariants.map((variant, idx) =>
                idx === versionIndex
                    ? {
                        ...variant,
                        images: [...(variant.images || []), ...newImages],
                    }
                    : variant
            )
        );
    };
    const handleDeleteImage = (versionIndex, imgIndex) => {
        setVariants((prevVariants) =>
            prevVariants.map((variant, idx) =>
                idx === versionIndex
                    ? {
                        ...variant,
                        images: variant.images.filter((_, index) => index !== imgIndex),
                    }
                    : variant
            )
        );
    };

    const [mainImage, setMainImage] = useState(null);
    const handleDropMainImage = (file) => {
        const preview = file?.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setMainImage(preview[0]);
    }

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

    const sizes = watch('sizes');
    const colors = watch('colors');
    useEffect(
        () => {
            if (sizes && sizes.length > 0 && colors && colors.length > 0) {
                setSelectedColor(colors);
                setSelectedSize(sizes);
            }
        }, [sizes, colors]
    );

    const handleSubmitAdd = async () => {
        if (mainImage) {
            setValue('image', await FileToBase64(mainImage));
        } else {
            setError('image', { type: 'manual', message: 'Main image is required!' });
        }

        const fieldsToValidate = [
            'name',
            'description',
            'categories',
            'sizes',
            'colors',
        ];

        if (variants.length > 0) {
            fieldsToValidate.push(
                ...variants.flatMap((_, index) => [
                    `variants[${index}].retailPrice`,
                    `variants[${index}].wholesalePrice`
                ])
            );
        }

        let imageVersion = true;
        if (variants?.length > 0) {
            variants.forEach((item, index) => {
                if (!item?.images?.length > 0) {
                    setError(`variants[${index}].images`, { type: 'manual', message: 'Please add at least one image of each version!' });
                    imageVersion = false;
                }
            });
        }

        let isValid = await trigger(fieldsToValidate);

        if (isValid && imageVersion) {
            const variantPrice = getValues('variants');
            let combineVariant = [];
            if (variants?.length > 0) {
                const base64Array = await Promise.all(
                    variants.map(item => FilesToBase64(item?.images || []))
                );

                if (variantPrice?.length > 0) {
                    combineVariant = variants.map((item, index) => ({
                        ...item,
                        versionName: `${getValues('name')}-ver-${index + 1}-${getDate()}`,
                        retalPrice: variantPrice[index]?.retailPrice,
                        wholesalePrice: variantPrice[index]?.wholesalePrice,
                        images: base64Array[index]
                    }));
                }
            }

            const productData = {
                name: getValues('name'),
                description: getValues('description'),
                categories: getValues('categories'),
                image: getValues('image'),
                price: 0,
                versions: combineVariant
            };

            if (productData) {
                console.log("product:", productData);

                axiosInstance.post('/staff/product/add', productData).then(
                    (response) => {
                        if (response?.data?.code === 200 || response?.data?.code === 201) {
                            toast.success('Product published successfully!');
                            reset();
                            setMainImage(null);
                            setVariants(null);
                            setSelectedColor([]);
                            setSelectedSize([]);
                        } else {
                            toast.error('Failed to add product. Please check for errors and try again!');
                        }
                    }
                );
            }
        } else {
            toast.error('Please fill in all required fields correctly!');
        }
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    useEffect(() => {
        if (location.state?.product) {
            setSelectedProduct(location.state.product);
        }
    }, [location.state]);

    useEffect(
        () => {
            console.log('selected product: ', selectedProduct);
        }, [selectedProduct]
    );

    const [isModal, setIsModal] = useState({ cate: false, size: false, color: false });
    const handleOpenCateModal = () => {
        setIsModal({ cate: !isModal.cate });
    }
    const handleCancelCateModal = () => {
        setIsModal({ cate: !isModal.cate });

    }
    const handleSubmitAddNewCategory = async () => {
        let valid = await trigger('categoryNameNew');
        if (valid) {
            const categoryName = getValues('categoryNameNew') || '';
            axiosInstance.post("/home/category/add", { categoryName }).then((response) => {
                if (response?.status === 200) {
                    toast.success('Added new category successfully!');
                    handleCancelCateModal();
                    handleGetCategory();
                    reset({ categoryNameNew: '' });
                } else {
                    toast.error('Failed to add new category. Please check for errors and try again!');
                }
            }).catch((error) => {
                console.error('Error adding category:', error);
                toast.error('An error occurred while adding the category.');
            });
        } else {
            setError('categoryNameNew', { type: 'manual', message: 'Category name cannot be null!' });
        }
    };

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><RiAddBoxFill />&ensp;{`Add a product`}</h4>
                        <p className='fw-medium'>{`Add a new product to your store`}</p>
                    </div>
                    <div>
                        <CustomButton btnType={'button'} btnBG={'primary'} btnName={'Publish product'} textColor={'text-white'} handleClick={handleSubmitAdd} />
                    </div>
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
                                        {...register('name', { required: true })} />
                                    <p className='fs-6 fw-medium text-danger'>{errors?.name && `Product's name is required !`}</p>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product main image</Form.Label>
                                    <div className='bg-white border rounded-2 py-2 px-1'>
                                        <ImagesDropzone maxFile={true} maxFileNum={1} onDrop={(files) => handleDropMainImage(files)}
                                            register={register} errors={errors} />
                                        <div className='d-flex justify-content-around'>
                                            {mainImage && (
                                                <div className='position-relative'>
                                                    <img
                                                        src={mainImage.preview}
                                                        alt="Main image preview"
                                                        style={{ width: '150px', height: 'auto' }}
                                                    />
                                                    <Button
                                                        className='position-absolute top-0 end-0 p-0 d-flex justify-content-center align-items-center'
                                                        variant='secondary'
                                                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                        onClick={() => setMainImage(null)}
                                                    >
                                                        <MdDeleteForever style={{ width: '60%', height: '60%' }} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className='fs-6 fw-medium text-danger'>{errors?.image && errors?.image?.message}</p>
                                </Form.Group>
                            </Form>
                        </div>
                        <div>
                            <label className=' fs-4 fw-medium'>Product versions</label>
                            <div>
                                {variants?.length > 0 ? (
                                    <Table className='custom-table' striped hover>
                                        <thead>
                                            <th>#</th>
                                            <th className='text-center'>Size</th>
                                            <th className='text-center'>Color</th>
                                            <th className='text-center'>Retail price</th>
                                            <th className='text-center'>Wholesale price</th>
                                        </thead>
                                        <tbody>
                                            {variants?.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={index + 1} className=''>
                                                            <td>{index + 1}</td>
                                                            <td className='text-center'>{item?.attributes[0]?.value}</td>
                                                            <td className='text-center'>{item?.attributes[1]?.value}</td>
                                                            <td className='w-30'>
                                                                <InputGroup>
                                                                    <Form.Control placeholder={`Product's retail price...`}
                                                                        {...register(`variants[${index}].retailPrice`, { required: true, min: 1000, pattern: /^[0-9]+$/ })} />
                                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                                </InputGroup>
                                                                <p className='fs-6 fw-medium text-danger'>
                                                                    {errors.variants?.[index]?.retailPrice && 'Required anumber and must be equal or greater than 1000 !'}</p>
                                                            </td>
                                                            <td className='w-30'>
                                                                <InputGroup>
                                                                    <Form.Control placeholder={`Product's wholesale price...`}
                                                                        {...register(`variants[${index}].wholesalePrice`, { required: true, min: 1000, pattern: /^[0-9]+$/ })} />
                                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                                </InputGroup>
                                                                <p className='fs-6 fw-medium text-danger'>
                                                                    {errors.variants?.[index]?.wholesalePrice && 'Required a number and must be equal or greater than 1000 ! !'}</p>
                                                            </td>
                                                        </tr>
                                                        <tr className=''>
                                                            <td colSpan={5}>
                                                                <ImagesDropzone onDrop={(files) => handleDrop(files, index)} />
                                                                <p className='fs-6 fw-medium text-danger'>
                                                                    {errors.variants?.[index]?.images?.message}
                                                                </p>
                                                                <div className='d-flex justify-content-around'>
                                                                    {item.images && item.images.map((image, imgIndex) => (
                                                                        <div className='position-relative'>
                                                                            <img key={imgIndex} src={image?.preview} alt={`Variant's image`}
                                                                                style={{ width: '150px', height: 'auto' }} />
                                                                            <Button
                                                                                className='position-absolute top-0 end-0 p-0 d-flex justify-content-center align-items-center'
                                                                                variant='secondary'
                                                                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                                                onClick={() => handleDeleteImage(index, imgIndex)}
                                                                            >
                                                                                <MdDeleteForever style={{ width: '60%', height: '60%' }} />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                ) : (<EmptyValues text={'Please select full attributes of variants  !!'} />)}
                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <Organize errors={errors} categories={categories} control={control} handleOpenCateModal={() => { handleOpenCateModal() }} />
                        <Variants
                            sizes={attributes?.sizes} colors={attributes?.colors}
                            control={control} errors={errors}
                        />
                    </div>
                </div>
                <div>
                    <ToastContainer />
                    <div>
                        <Form>
                            <Modal show={isModal.cate}>
                                <Modal.Body>
                                    <Form.Control
                                        type='text'
                                        placeholder={`Category's name. . .`}
                                        {...register("categoryNameNew", { required: true })}
                                    />
                                    {errors?.categoryNameNew && (
                                        <p className='fw-bold text-danger'>Category name is required</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className='d-flex justify-content-between' style={{ minWidth: '140px' }}>
                                        <CustomButton btnBG={'success'} btnName={'Save'} handleClick={handleSubmitAddNewCategory} />
                                        <CustomButton btnBG={'danger'} btnName={'Cancel'} handleClick={handleCancelCateModal} />
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewProduct;
