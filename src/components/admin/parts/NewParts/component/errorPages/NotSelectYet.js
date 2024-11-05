import React from 'react';

const NotSelectYet = ({text}) => {
    return (
        <div className='d-flex justify-content-center align-items-center'>
            <div style={{ height: '50%' }}>
                <div className='container d-flex flex-column justify-content-center align-items-center'>
                    <img src={`${process.env.PUBLIC_URL}/images/admin/svg/select-focus.svg`} alt='svg-select-yet' style={{ maxWidth: '12%', height: 'auto' }} />
                    <p className='mt-2 fw-medium text-blue-pantone-1 fs-6' style={{fontSize: '190%'}}>{text}</p>
                </div>
            </div>
        </div>
    );
}

export default NotSelectYet;
