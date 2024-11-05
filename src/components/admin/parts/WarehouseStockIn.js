import React from 'react';
import CustomerSelection from './CustomerSelection';

const WarehouseStockIn = () => {
    return (
        <div>
            <h3 className='bg-body-secondary'>Stock In</h3>
            <div className='mt-3 d-flex'>
                <div className='col-7 me-3'>
                    <div>
                        <CustomerSelection/>
                        {/* <Card>
                            <Card.Header className='pb-0'>
                                <p className='fs-5 fw-medium'>Supplier's Infomation</p>
                                <p className='fs-6 fw-bold text-primary d-flex align-items-center m-1'><FaUser/>&ensp;Stockin John</p>
                            </Card.Header>
                            <Card.Body>

                            </Card.Body>
                        </Card> */}
                    </div>
                </div>
                <aside className='col-5'>ity's me</aside>
            </div>
        </div>
    );
}

export default WarehouseStockIn;
