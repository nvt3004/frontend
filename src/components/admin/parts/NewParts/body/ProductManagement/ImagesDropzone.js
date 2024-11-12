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
            <input {...getInputProps()}/>
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    );

};
export default ImagesDropzone;
