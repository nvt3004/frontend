import React, { useState } from 'react';
import {ButtonHover} from './StyledButton'; // Assuming StyledButton is already implemented
import { LabelHover } from './StyledButton';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapToast from './Toast';

function UserModal({ show, handleClose, userData }) {
  const buttonStyle = {
    backgroundColor: '#63c790',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
  };
  const [avatar, setAvatar] = useState(process.env.PUBLIC_URL + '/images/DefaultAvatar.png');

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

  // const LabelHover = styled.label`
  //   &:hover {
  //     transform: scale(1.1); /* Điều chỉnh kích thước khi hover */
  //     opacity: 0.75; /* Độ trong suốt khi hover */
  //   }
  //   transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  //   `;

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', text: '', color: '' });

  const updateHandle = () => {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'You might not recover this infomations after update !',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: `Yes, I'm sure !`,
      showCancelButton: true
    }).then((response) => {
      if (response.isConfirmed) {
        setToastContent({
          title: 'Update successed!',
          text: 'The infomatiosn has been changed.',
          color: 'success'
        });
        setShowToast(true);
        handleClose();
      }
    });
  }
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mt-3 w-100">
            <div className='row'>
              <div className='col-4 d-flex flex-column align-items-center'>
                <img src={process.env.PUBLIC_URL + '/images/DefaultAvatar.png'} alt='user avatar' style={avatarStyle} />
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  style={{ display: 'none' }} // Hide the default file input
                  id='avatarUpload'
                />
                <LabelHover htmlFor='avatarUpload' className='btn btn-warning opacity-75 text-white mt-2'>CHOOSE FILE</LabelHover>
              </div>
              <div className='col-8'>
                <form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control rounded-5 px-3 py-2" id="username" defaultValue={userData?.username} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">Fullname</label>
                    <input type="text" className="form-control rounded-5 px-3 py-2" id="fullname" defaultValue={userData?.fullname} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="birthday" className="form-label">Birthday</label>
                    <input type="date" className="form-control rounded-5 px-3 py-2" id="birthday" defaultValue={userData?.birthday} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select className="form-select rounded-5 px-3 py-2" id="gender" defaultValue={userData?.gender}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="else">Else</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control rounded-5 px-3 py-2" id="email" defaultValue={userData?.email} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-select rounded-5 px-3 py-2" id="role" defaultValue={userData?.role}>
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <ButtonHover type="button" className="btn rounded-5 w-25 fs-5 text-white btn-success opacity-75" onClick={updateHandle}>Update</ButtonHover>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div>
        <BootstrapToast show={showToast} close={() => setShowToast(false)} title={toastContent.title} text={toastContent.text} color={toastContent.color}/>
      </div>
    </>
  );
}

export default UserModal;
