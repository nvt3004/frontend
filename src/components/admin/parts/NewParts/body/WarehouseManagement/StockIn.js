import React, { useRef, useState } from 'react';
import { BsFillHouseAddFill } from "react-icons/bs";
import CustomButton from '../../component/CustomButton';
import Select from 'react-select';
import suppliers from '../SuppliersManagement/data';
import NotSelectYet from '../../component/errorPages/NotSelectYet';

const StockIn = () => {
    const supplierOptions = suppliers.filter(item => item?.status === true).map(item => ({
        value: item?.id,
        label: item?.supplierName,
    }));

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const supplierRef = useRef();
    const handleGetSupplier = (selectedOption) => {
        const matchSupplier = suppliers.find(item => item?.id === selectedOption?.value);
        if (matchSupplier) {
            setSelectedSupplier(matchSupplier);
        }
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><BsFillHouseAddFill />&ensp;Stock in</h4>
                        <p className='fw-medium'>Stock in products</p>
                    </div>
                    <div>
                        <CustomButton btnBG={'primary'} btnName={'Publish product'} />
                    </div>
                </div>
                <div className='mt-2 d-flex'>
                    <div className='col-9 pe-3'>
                        <div className='me-2'>
                            <div className='row bg-white border rounded-1' style={{ minHeight: '500px' }}>

                            </div>
                            <div className='mt-2 mb-3 row bg-white border rounded-1' style={{ minHeight: '300px' }}>

                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div style={{ minHeight: '150px', maxWidth: '500px' }}>
                            <p className='fs-4 fw-medium mb-1'>Product's supplier</p>
                            <div className=''>
                                <Select ref={supplierRef} options={supplierOptions} placeholder={`Select supplier. . .`} onChange={handleGetSupplier} />
                                {selectedSupplier ? (
                                    <div className='border rounded-2 px-2 pt-1 mt-1 bg-white' style={{ minHeight: '150px' }}>
                                        <p>{`Supplier's name: ${selectedSupplier?.supplierName}`}</p>
                                        <p>{`Contacter: ${selectedSupplier?.contactName}`}</p>
                                        <p>{`Address: ${selectedSupplier?.address}`}</p>
                                        <p>{`Phone number: ${selectedSupplier?.phone}`}</p>
                                        <p>{`Email: ${selectedSupplier?.email}`}</p>
                                    </div>
                                ) : (
                                    <div className='border rounded-2 px-2 mt-1 bg-white d-flex justify-content-center align-items-center'
                                        style={{ minHeight: '150px' }}>
                                        {/* <p>{`Supplier's name: ${selectedSupplier?.supplierName}`}</p>
                                        <p>{`Contacter: ${selectedSupplier?.contactName}`}</p>
                                        <p>{`Address: ${selectedSupplier?.address}`}</p>
                                        <p>{`Phone number: ${selectedSupplier?.phone}`}</p>
                                        <p>{`Email: ${selectedSupplier?.email}`}</p> */}

                                        {/* <p className='m-0 fs-6'>You haven't select supplier yet !</p> */}

                                        <NotSelectYet text={`You haven't select supplier yet !`} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockIn;
