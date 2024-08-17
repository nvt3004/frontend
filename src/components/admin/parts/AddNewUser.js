import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import './ThoLHCSS.css'


const LabelHover = styled.label`
&:hover {
  transform: scale(1.1); /* Điều chỉnh kích thước khi hover */
  opacity: 0.75; /* Độ trong suốt khi hover */
}
transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const ButtonHover = styled.button`
&:hover {
transform: scale(1.1); /* Điều chỉnh kích thước khi hover */
opacity: 0.75; /* Độ trong suốt khi hover */
}
transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

function AddNewUser() {
  const [avatar, setAvatar] = useState(process.env.PUBLIC_URL + '/images/DefaultAvatar.png');

  const { register, handleSubmit, formState: { errors } } = useForm();

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

  const onSubmit = (data) => {
    const age = calculateAge(data.birthday);
    if (age < 18) {
      // Cập nhật lỗi cho ngày sinh không hợp lệ
      Swal.fire(
        {
          customClass: {
            title: 'swal-title'
          },
          title: 'THE INFOMATION MAY NOT CORRECT !!',
          text: 'Your age must be older than 18 ! Plase check again.',
          icon: 'error',
          showCloseButton: true,
        }
      );
      return;
    }
    // Xử lý dữ liệu form hợp lệ
    console.log(data);
  };

  const buttonStyle = {
    backgroundColor: '#63c790',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
  };

  return (
    <div className="container mt-3 w-50">
      <div className='row'>
        <div className='col-4 d-flex flex-column align-items-center'>
          <img src={avatar} alt='user avatar' style={avatarStyle} />
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the default file input
            id='avatarUpload'
          />
          <LabelHover htmlFor='avatarUpload' className='btn btn-warning text-white mt-2'>CHOOSE FILE</LabelHover>
        </div>
        <div className='col-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('birthday', { required: 'Birthday is required' })}
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
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-select rounded-5 px-3 py-2"
                id="role"
                {...register('role', { required: 'Role is required' })}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
              </select>
              {errors.role && <p className="text-danger">{errors.role.message}</p>}
            </div>
            <ButtonHover type='submit' className="btn rounded-5 w-25 fs-5 text-white" style={buttonStyle}>Submit</ButtonHover>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewUser;
