import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapToast from './Toast';

const LabelHover = styled.label`
  &:hover {
    transform: scale(1.1);
    opacity: 0.75;
  }
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const ButtonHover = styled.button`
  &:hover {
    transform: scale(1.1);
    opacity: 0.75;
  }
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const AddNewSupplier = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', text: '', color: '' });

  const addNewSupplierHandle = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Make sure you fill in the correct information!',
      showConfirmButton: true,
      confirmButtonText: `Yes, I'm sure!`,
      showCancelButton: true
    }).then((response) => {
      if (response.isConfirmed) {
        setToastContent({
          title: 'Added a new supplier!',
          text: 'Check it in the manage table.',
          color: 'success'
        });
        setShowToast(true);
      }
    });
  }

  return (
    <div className="container mt-3 w-50">
      <div className='row'>
        <div className='col-12'>
          <form onSubmit={handleSubmit(addNewSupplierHandle)}>
            <div className="mb-3">
              <label htmlFor="suppliername" className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="suppliername"
                {...register('suppliername', {
                  required: 'Company name is required',
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                    message: 'Company name must start with a letter and can only contain letters, numbers, and underscores'
                  }
                })}
              />
              {errors.suppliername && <p className="text-danger">{errors.suppliername.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="contactname" className="form-label">Contact Name</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="contactname"
                {...register('contactname', { required: 'Contact name is required' })}
              />
              {errors.contactname && <p className="text-danger">{errors.contactname.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control rounded-5 px-3 py-2"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="phone"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="address"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && <p className="text-danger">{errors.address.message}</p>}
            </div>
            <ButtonHover type='submit' className="btn rounded-5 w-25 fs-5 text-white btn-success opacity-75">Submit</ButtonHover>
          </form>
        </div>
        <div>
          <BootstrapToast show={showToast} close={() => setShowToast(false)} title={toastContent.title} text={toastContent.text} color={toastContent.color}/>
        </div>
      </div>
    </div>
  );
}

export default AddNewSupplier;
