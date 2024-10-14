import React, { useState } from 'react';
import { BsFillHouseAddFill } from "react-icons/bs";
import CustomButton from '../../component/CustomButton';
import Select from 'react-select';
import suppliers from '../SuppliersManagement/data';

const StockIn = () => {
    const supplierOptions = suppliers.map(item => ({
        value: item?.id,
        label: item?.supplierName,
    }));

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const handleGetSupplier = (selectedOption) => {
        // const matchSupplier = suppliers.find(item => item?.id === selectedOption?.value);
        // if (matchSupplier) {
        //     setSelectedSupplier(matchSupplier);
        // }
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
                        <div className='' style={{ minHeight: '150px', maxWidth: '500px' }}>
                            <p className='fs-4 fw-medium mb-1'>Supplier</p>
                            <div className='border'>
                                <Select value={selectedSupplier} options={supplierOptions} onChange={handleGetSupplier}/>
                                {/* {selectedSupplier ? (
                                    <div>
                                        <p>{`Name: ${selectedSupplier?.supplierName}`}</p>
                                    </div>
                                ) : (<p>{`Null value`}</p>)} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StockIn;
