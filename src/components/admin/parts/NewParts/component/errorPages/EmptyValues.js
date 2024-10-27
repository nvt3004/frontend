import React from 'react';

const EmptyValues = ({text}) => {
    return (
        <div style={{height: '300px'}}>
            <div className='h-100 container d-flex flex-column justify-content-center align-items-center'>
                <img src={`${process.env.PUBLIC_URL}/images/admin/svg/s-villa.svg`} alt='svg-empty-value' style={{maxWidth: '200px', height: 'auto'}}/>
                <p className='mt-2 font-24 fw-medium text-blue-pantone-1'>{text}</p>
            </div>
        </div>
    );
}

export default EmptyValues;
