import React from 'react';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';
import { FaBell, FaSearch } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';

const Headder = () => {
    return (
        <div>
            <div className='position-sticky top-0 bg-white d-flex justify-content-between align-items-center' style={{ minHeight: "75px", zIndex: 1000 }}>
                <div className='col-3 d-flex align-items-center'>
                    <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='logo' style={{ width: "70px" }} />
                    <div className='text-primary'>
                        <h3 className='mb-0'>{`Steps To Future`}</h3>
                        <p className='mb-0'>Dashboard</p>
                    </div>
                </div>
                <div className='col-9 me-3 d-flex justify-content-end align-items-center'>
                    {/* <InputGroup className='w-30'>
                        <InputGroup.Text className=''><FaSearch /></InputGroup.Text>
                        <Form.Control className='' placeholder='Searching . . .' />
                    </InputGroup> */}
                    <div className='w-25 d-flex justify-content-around align-items-center'>
                        <FaGear className='fs-4'/>
                        <FaBell className='fs-4' />
                        <Dropdown>
                            <Dropdown.Toggle as={"div"}>
                                <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} alt='avatar' style={{ height: "40px", width: "auto" }} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Action 3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Headder;
