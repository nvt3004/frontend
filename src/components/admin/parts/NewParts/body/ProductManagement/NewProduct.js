import React, { useEffect, useRef, useState, version } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { RiAddBoxFill } from "react-icons/ri";
import CustomButton from '../../component/CustomButton';
import suppliers from '../SuppliersManagement/data';
import Variants from './Variants';
import Organize from './Organize';
import EmptyValues from '../../component/errorPages/EmptyValues';
import ImagesDropzone from './ImagesDropzone';
import { MdDeleteForever } from "react-icons/md";
import SupplierModal from '../SuppliersManagement/SupplierModal';

const NewProduct = () => {
    const handleGetAttributesAPI = () => {

    }
    const supplierOptions = suppliers.map(item => ({
        value: item?.id,
        label: item?.supplierName,
    }));
    const categoryOptions = [
        { value: 1, label: `Man's clothing` },
        { value: 2, label: `Women's clothing` },
        { value: 3, label: `Kid's clothing` },
    ];
    const sizes = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
    ];
    const colors = [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'yellow', label: 'Yellow' },
    ];

    const [selectedSizes, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColor] = useState([]);
    const handleSizeChange = (selectedOptions) => {
        setSelectedSize(selectedOptions);
    };
    const handleColorChange = (selectedOptions) => {
        setSelectedColor(selectedOptions);
    }

    const [variants, setVariants] = useState([]);
    const handleSetVariants = () => {
        const newVariants = [];
        selectedSizes.forEach(size => {
            selectedColors.forEach(color => {
                newVariants.push({ size: size.label, color: color.label, images: [] });
            });
        });
        setVariants(newVariants);
    };

    useEffect(() => {
        handleSetVariants();
    }, [selectedSizes, selectedColors]);

    const handleDrop = (files, versionIndex) => {
        const newImages = files.map((file, index) => ({
            id: index,
            url: URL.createObjectURL(file),
        }));

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
    useEffect(() => {
        console.log(variants);

    }, [variants]);

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

    const [openSupplierModal, setOpenSupplierModal] = useState(false);
    const handleOpenSupplierModal = () => {
        setOpenSupplierModal(true);
    }
    const handleCancelSupplier = () => {
        setOpenSupplierModal(false);
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><RiAddBoxFill />&ensp;Add a product</h4>
                        <p className='fw-medium'>Add new product to store</p>
                    </div>
                    <div>
                        <CustomButton btnBG={'primary'} btnName={'Publish product'} />
                    </div>
                </div>
                <div className='d-flex justify-content-between custom-form'>
                    <div className='col-9 pe-3'>
                        <div>
                            <Form>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product name</Form.Label>
                                    <Form.Control className='py-2 custome-placeholder-font-12' type='text' placeholder='Write product name here' />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='fs-4 fw-medium'>Product description</Form.Label>
                                    <Form.Control className='py-2 custome-placeholder-font-12'
                                        as="textarea" rows={3}
                                        placeholder='Write product description here'
                                        style={{ resize: 'none' }} />
                                </Form.Group>
                            </Form>
                        </div>
                        <div>
                            <label className=' fs-4 fw-medium'>Product versions</label>
                            <div>
                                {selectedSizes?.length > 0 && selectedColors?.length > 0 ? (
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
                                                            <td className='text-center'>{item?.size}</td>
                                                            <td className='text-center'>{item?.color}</td>
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
                                                                            <img key={imgIndex} src={image.url} alt={`Variant's image`}
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
                        <Organize suppliers={supplierOptions} categories={categoryOptions} handleOpenSupplier={handleOpenSupplierModal}/>
                        <Variants 
                            sizes={sizes} colors={colors}
                            sizeChange={handleSizeChange} colorChange={handleColorChange} />
                    </div>
                </div>
                <div>
                    <SupplierModal isNew={true} show={openSupplierModal} handleCancel={handleCancelSupplier}/>
                </div>
            </div>
        </div>
    );
}

export default NewProduct;
