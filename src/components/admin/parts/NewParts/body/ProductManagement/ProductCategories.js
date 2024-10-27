import React, { useEffect, useState } from 'react';
import { MdCategory } from "react-icons/md";
import DoRequest from '../../../../axiosRequest/doRequest';
// import categories from './categoriesData';
import { motion } from 'framer-motion';
import { Form } from 'react-bootstrap';
import CustomButton from '../../component/CustomButton';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const ProductCategories = () => {
    const [categories, setCategories] = useState([]);
    const handleGetCategoriesAPI = () => {
        DoRequest().get('/home/category/dashboard/get-all').then((response) => {
            const sortedCategories = response?.data?.data?.sort((a, b) => a.categoryId - b.categoryId);
            setCategories(sortedCategories);

        });
    }

    const [selectedCategory, setSelectedCategory] = useState(null);
    const handleSetSelectedCategory = (category) => {
        setSelectedCategory(category);
    }
    useEffect(() => {
        handleGetCategoriesAPI();
    }, [selectedCategory]);

    const [isEdit, setEdit] = useState(false);
    const [isNew, setNew] = useState(false);

    const handleChange = (e) => {
        if (isEdit === false && isNew === false) {
            e.preventDefault();
        }
    }

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    useEffect(() => {
        if (selectedCategory) {
            setValue("categoryId", selectedCategory?.categoryId);
        }
    }, [selectedCategory, setValue]);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            if (!isNew) {
                await DoRequest().put("/home/category/update", data).then((response) => {
                    if (response?.status === 200) {
                        toast.success('Category updated successfully!');
                        handleGetCategoriesAPI();
                        handleClear();
                    }
                });
            } else {
                await DoRequest().post("/home/category/add", data).then((response) => {
                    if (response?.status === 200) {
                        toast.success('Added new category successfully!');
                        handleGetCategoriesAPI();
                        handleClear();
                    }
                });
            }

        } catch (error) {
            toast.error('Failed to update category. Try again !!');
            console.log(error);
        }
    }

    const handleRemove = async () => {
        try {
            await DoRequest().delete(`/home/category/remove/${selectedCategory?.categoryId}`).then(
                (response) => {
                    if (response?.status === 200) {
                        toast.success('Removed successfully!');
                        handleGetCategoriesAPI();
                        handleClear();
                    }
                }
            );
        } catch (error) {
            toast.error('Failed to update category. Try again !!');
            console.log(error);
        }
    }

    const handleClear = () => {
        setSelectedCategory(null);
        setEdit(false);
        setNew(false);
        reset()
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><MdCategory />&ensp;Product's categories</h4>
                        <p className='fw-medium'>Manage categories of products</p>
                    </div>
                </div>
                <div className='d-flex'>
                    <div className='col-9 pe-3'>
                        <div className='me-2'>
                            <div className='bg-white rounded-1 border d-flex flex-column' style={{ minHeight: '550px', maxHeight: '550px', overflowY: 'auto', paddingBottom: '5px' }}>
                                <div className='d-flex flex-wrap' style={{ width: '100%', maxWidth: '1020px', marginTop: '10px' }}>
                                    {categories?.map((item, index) => (
                                        <motion.div key={index} className='mx-2 mt-2 rounded-1 d-flex align-items-center justify-content-center'
                                            style={{ maxHeight: '50px', minWidth: '150px', minHeight: '40px', flex: '0 0 calc(16.66% - 16px)', marginBottom: '10px' }}
                                            onClick={() => { handleSetSelectedCategory(item) }}
                                            animate={{
                                                borderColor: selectedCategory?.categoryId === item?.categoryId ? '#0d6efd' : '#ccc',
                                                borderStyle: 'solid',
                                                borderWidth: selectedCategory?.categoryId === item?.categoryId ? '1px' : '1px',
                                                opacity: selectedCategory?.categoryId === item?.categoryId ? 0.8 : 1
                                            }}>
                                            <motion.label whileHover={{ color: '#0d6efd' }} 
                                                style={{ color: selectedCategory?.categoryId === item?.categoryId ? '#0d6efd' : 'black' }}>
                                                <h6 className='mb-0'>{item?.categoryName}</h6>
                                            </motion.label>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-3'>
                        <div className='bg-white p-2 border rounded-1' style={{ minHeight: "70px" }}>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group>
                                    <Form.Label>Category name: </Form.Label>
                                    <Form.Control type='text' defaultValue={selectedCategory && !isEdit ? selectedCategory?.categoryName : ''}
                                        {...register("categoryName", { required: true })}
                                        placeholder={(selectedCategory && isEdit) && selectedCategory?.categoryName}
                                        onKeyDown={handleChange} onPaste={handleChange}
                                        disabled={!selectedCategory && !isNew} />
                                    {errors?.categoryName && (
                                        <p className='fw-bold text-danger'>Category name is required</p>
                                    )}
                                </Form.Group>

                                <div className='d-flex justify-content-around mt-2'>
                                    {isEdit ? (
                                        <>
                                            <button type='submit' className='btn btn-success custom-radius custom-hover text-white'>Save</button>
                                            <CustomButton
                                                btnBG={'danger'}
                                                btnName={'Cancel'}
                                                textColor={'text-white'}
                                                handleClick={() => {
                                                    handleClear()
                                                }}
                                            />
                                        </>
                                    ) : (
                                        selectedCategory ? (
                                            <>
                                                <CustomButton
                                                    btnBG={'warning'}
                                                    btnName={'Change'}
                                                    textColor={'text-white'}
                                                    handleClick={() => { setEdit(true) }}
                                                />
                                                <CustomButton
                                                    btnBG={'success'}
                                                    btnName={'Clear'}
                                                    textColor={'text-white'}
                                                    handleClick={() => { setSelectedCategory(null) }}
                                                />
                                                <CustomButton
                                                    btnBG={'danger'}
                                                    btnName={'Remove'}
                                                    textColor={'text-white'}
                                                    handleClick={handleRemove}
                                                />
                                            </>
                                        ) : isNew ? (
                                            <>
                                                <button type='submit' className='btn btn-success custom-radius custom-hover text-white'>Save</button>
                                                <CustomButton
                                                    btnBG={'danger'}
                                                    btnName={'Cancel'}
                                                    textColor={'text-white'}
                                                    handleClick={() => {
                                                        handleClear()
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <CustomButton
                                                btnBG={'primary'}
                                                btnName={'Create'}
                                                textColor={'text-white'}
                                                handleClick={() => { setNew(true) }}
                                            />
                                        )
                                    )}
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ProductCategories;
