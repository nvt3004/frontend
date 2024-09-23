import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapToast from './Toast';
import PermissionModal from './PermissionModal';

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

const AddNewUser = () => {
  const [avatar, setAvatar] = useState(process.env.PUBLIC_URL + '/images/DefaultAvatar.png');

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', text: '', color: '' });

  const addNewUserHandle = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Make sure you fill in the correct information!',
      showConfirmButton: true,
      confirmButtonText: `Yes, I'm sure!`,
      showCancelButton: true
    }).then((response) => {
      if (response.isConfirmed) {
        setToastContent({
          title: 'Added a new user!',
          text: 'Check it in the manage table.',
          color: 'success'
        });
        setShowToast(true);
      }
    });
  }

  const userRoleRef = useRef('');
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    console.log(userRoleRef?.current?.value);
    if (userRoleRef?.current?.value === "staff") {
      setShowModal(true);
    }
  }
  const hideModal = () => {
    setShowModal(false);
  }

  return (
    <div className="container mt-3 w-50">
      <div className='row'>
        <div className='col-4 d-flex flex-column align-items-center'>
          <img src={avatar} alt='user avatar' style={{ width: '120px', height: '120px' }} />
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id='avatarUpload'
          />
          <LabelHover htmlFor='avatarUpload' className='btn btn-warning opacity-75 text-white mt-2'>CHOOSE FILE</LabelHover>
        </div>
        <div className='col-8'>
          <form onSubmit={handleSubmit(addNewUserHandle)}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="username"
                {...register('username', {
                  required: 'Username is required',
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                    message: 'Username must start with a letter and can only contain letters, numbers, and underscores'
                  }
                })}
              />
              {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">Fullname</label>
              <input
                type="text"
                className="form-control rounded-5 px-3 py-2"
                id="fullname"
                {...register('fullname', { required: 'Fullname is required' })}
              />
              {errors.fullname && <p className="text-danger">{errors.fullname.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="birthday" className="form-label">Birthday</label>
              <input
                type="date"
                className="form-control rounded-5 px-3 py-2"
                id="birthday"
                {...register('birthday', {
                  required: 'Birthday is required',
                  validate: {
                    validAge: value => {
                      const age = calculateAge(value);
                      return (age >= 18 && age <= 65) || 'Age must be between 18 and 65';
                    }
                  }
                })}
              />
              {errors.birthday && <p className="text-danger">{errors.birthday.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select rounded-5 px-3 py-2"
                id="gender"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="else">Else</option>
              </select>
              {errors.gender && <p className="text-danger">{errors.gender.message}</p>}
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
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-select rounded-5 px-3 py-2"
                id="role"
                {...register('role', { required: 'Role is required' })}
                ref={userRoleRef}
                onChange={openModal}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
              </select>
              {errors.role && <p className="text-danger">{errors.role.message}</p>}
            </div>
            <ButtonHover type='submit' className="btn rounded-5 w-25 fs-5 text-white btn-success opacity-75">Submit</ButtonHover>
          </form>
        </div>
        <div>
          <BootstrapToast show={showToast} close={() => setShowToast(false)} title={toastContent.title} text={toastContent.text} color={toastContent.color} />
        </div>
        <div>
          <PermissionModal show={showModal} handleClose={hideModal} />
        </div>
      </div>
    </div>
  );
}

export default AddNewUser;
