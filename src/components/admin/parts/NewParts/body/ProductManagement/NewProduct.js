import React, { useEffect, useRef, useState, version } from 'react';
import { Form, InputGroup, Table } from 'react-bootstrap';
import { RiAddBoxFill } from "react-icons/ri";
import CustomButton from '../../component/CustomButton';
import suppliers from '../SuppliersManagement/data';
import Variants from './Variants';
import Organize from './Organize';
import EmptyValues from '../../component/errorPages/EmptyValues';
import Dropzone, { useDropzone } from 'react-dropzone';
import ImagesDropzone from './ImagesDropzone';


const NewProduct = () => {
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

    const sizeRef = useRef();
    const colorRef = useRef();

    const [selectedSizes, setSelectedSize] = useState([]);
    const [selectedColors, setSelectedColor] = useState([]);
    const handleSizeChange = (selectedOptions) => {
        setSelectedSize(selectedOptions);
    };
    const handleColorChange = (selectedOptions) => {
        setSelectedColor(selectedOptions);
    }
    // useEffect(() => {
    //     console.log('Selected sizes have changed: ', selectedSize);
    // }, [selectedSize]);

    const [variants, setVariants] = useState([]);
    let variantIndex = 0;
    const handleSetVariants = () => {
        const newVariants = [];
        selectedSizes.forEach(size => {
            selectedColors.forEach(color => {
                newVariants.push({ index: variantIndex, size: size.label, color: color.label, images: [] });
            });
        });
        setVariants(newVariants);
        
        variantIndex +=1;
    }
    useEffect(() => {
        handleSetVariants();
        console.log(variants);
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
        console.log(variants);

    };



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
                                                                {/* <ImagesDropzone onDrop={(files) => handleDrop(files, index)} />
                                                                {variants.map((variant, index) => (
                                                                    <div key={index}>
                                                                        <div>
                                                                            {variant.images && variant.images.map((image, imgIndex) => (
                                                                                <img key={imgIndex} src={image.url} alt={`Variant ${index} image`} style={{ width: '150px', height: 'auto' }} />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))} */}
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
                        <Organize suppliers={supplierOptions} categories={categoryOptions} />
                        <Variants sizeRef={sizeRef} colorRef={colorRef}
                            sizes={sizes} colors={colors}
                            sizeChange={handleSizeChange} colorChange={handleColorChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewProduct;
