import React, { useEffect, useRef, useState, version } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
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

const UpdateProduct = () => {
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    useEffect(() => {
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

    const { register, trigger, setValue, getValues, formState: { errors }, setError, control } = useForm();

    const [selectedSizes, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColor] = useState([]);
    const [versions, setVersions] = useState([]);
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
                    images: [], retailPrice: "", wholesalePrice: ""
                });
            });
        });
        setVersions(newVariants);
    };
    useEffect(() => {
        handleSetVariants();
    }, [selectedSizes, selectedColors]);

    const handleDrop = (files, versionIndex) => {
        const newImages = files.map((file, index) => (
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        ));

        setVersions((prevVariants) =>
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
        setVersions((prevVariants) =>
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

    useEffect(() => {
        if (selectedProduct) {
            setValue("name", selectedProduct.productName);
            setValue("categories", selectedProduct.categories.map(category => ({
                value: category.id,
                label: category.name
            })));

            setMainImage({ preview: selectedProduct.image });

            const productVersions = selectedProduct.versions.map(version => ({
                ...version,
                attributes: version.attributes,
                images: version.images.map(img => ({
                    preview: img.name
                }))
            }));
            setVersions(productVersions);
        }
    }, [selectedProduct, setValue]);

    const handleUpdate = () => {
        const productData = {
            name: getValues("name"),
            image: mainImage,
            categories: getValues("categories"),
            versions: versions.map((version, index) => ({
                ...version,
                retailPrice: getValues(`versions[${index}].retailPrice`),
                wholesalePrice: getValues(`versions[${index}].wholesalePrice`),
                images: version.images.map(img => img.preview), // chuyển URL thành dạng cần thiết để gửi lên API
                attributes: [
                    { key: "Size", value: version.attributes[0].value },
                    { key: "Color", value: version.attributes[1].value }
                ]
            }))
        };
        
        console.log(productData);
        
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><RiAddBoxFill />&ensp;{location.state?.product ? `Update product` : `Add a product`}</h4>
                        <p className='fw-medium'>{location.state?.product ? `Change product infomation` : `Add a new product to your store`}</p>
                    </div>
                    <div>
                        <CustomButton btnType={'button'} btnBG={'warning'} btnName={'Save'} textColor={'text-white'} handleClick={handleUpdate}/>
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
                                        {...register('name', {required: true})}/>
                                    <p>{errors?.name && `Product name is required !`}</p>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product main image</Form.Label>
                                    <div className='bg-white border rounded-2 py-2 px-1'>
                                        <ImagesDropzone maxFile={true} maxFileNum={1} onDrop={(files) => handleDropMainImage(files)} />
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
                                </Form.Group>
                            </Form>
                        </div>
                        <div>
                            <label className=' fs-4 fw-medium'>Product versions</label>
                            <div>
                                {versions?.length > 0 ? (
                                    <Table className='custom-table' striped hover>
                                        <thead>
                                            <th>#</th>
                                            <th className='text-center'>Size</th>
                                            <th className='text-center'>Color</th>
                                            <th className='text-center'>Retail price</th>
                                            <th className='text-center'>Wholesale price</th>
                                        </thead>
                                        <tbody>
                                            {versions?.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={index + 1} className=''>
                                                            <td>{index + 1}</td>
                                                            <td className='text-center'>{item?.attributes[0]?.value}</td>
                                                            <td className='text-center'>{item?.attributes[1]?.value}</td>
                                                            <td className='w-30'>
                                                                <InputGroup>
                                                                    <Form.Control placeholder={`Product's retail price...`} />
                                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                                </InputGroup>
                                                            </td>
                                                            <td className='w-30'>
                                                                <InputGroup>
                                                                    <Form.Control placeholder={`Product's wholesale price...`} />
                                                                    <InputGroup.Text>VND</InputGroup.Text>
                                                                </InputGroup>
                                                            </td>
                                                        </tr>
                                                        <tr className=''>
                                                            <td colSpan={5}>
                                                                <ImagesDropzone onDrop={(files) => handleDrop(files, index)} />
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
                        <Organize
                            categories={categories}
                            errors={errors}
                            control={control}
                            cateDefault={selectedProduct?.categories}
                        />
                        <Variants
                            sizes={attributes.sizes}
                            colors={attributes.colors}
                            control={control}
                            errors={errors}
                            sizesDefault={selectedProduct?.versions.map(v => v.attributes.find(attr => attr.key === 'Size')).filter(Boolean)}
                            colorsDefault={selectedProduct?.versions.map(v => v.attributes.find(attr => attr.key === 'Color')).filter(Boolean)}
                        />
                    </div>
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
