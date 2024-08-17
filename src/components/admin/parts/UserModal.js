import React from 'react';
import ButtonHover from './StyledButton'; // Assuming StyledButton is already implemented
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserModal({ show, handleClose, userData }) {
  const buttonStyle = {
    backgroundColor: '#63c790',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mt-3 w-100">
          <div className='row'>
            <div className='col-4 d-flex flex-column align-items-center'>
              <img src={process.env.PUBLIC_URL + '/images/DefaultAvatar.png'} alt='user avatar' style={avatarStyle} />
              <ButtonHover type="button" className="btn btn-warning text-white mt-2">
                Upload avatar
              </ButtonHover>
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
                <ButtonHover type="submit" className="btn rounded-5 w-25 fs-5 text-white" style={buttonStyle}>Submit</ButtonHover>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UserModal;
