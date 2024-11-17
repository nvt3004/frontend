import React from 'react';
import { useDropzone } from 'react-dropzone';

const ImagesDropzone = ({ onDrop, maxFile, maxFileNum }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles);
        },
        accept: { 'image/*': [] },
        ...({ maxFiles: 1, multiple: false }),
    });

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>
                <div className='d-flex flex-column align-items-center'>
                    <img src={`${process.env.PUBLIC_URL}/images/admin/svg/image.svg`} alt='version'
                        style={{ maxWidth: '120px', height: 'auto' }} />
                    <p className='row'>Choose new image</p>
                </div>
                <hr />
            </p>
        </div>
    );

};
export default ImagesDropzone;
