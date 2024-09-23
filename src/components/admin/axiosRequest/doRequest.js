import axios from 'axios';
import React from 'react';

const DoRequest = ({token}) => {
    const baseURL = 'http://localhost:8080';
    const axiosInstance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        timeout: 5000,
    })

    return axiosInstance;
}

export default DoRequest;
