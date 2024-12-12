import axios from 'axios';
import React from 'react';

const DoRequest = () => {
    const baseURL = 'https://api.stepstothefuture.store/api';
    const token = `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbnRydXFoeTNAZ21haWwuY29tIiwicHVycG9zZSI6ImxvZ2luIiwiaWF0IjoxNzMwMDI5OTkxLCJleHAiOjE3MzAwNDc5OTF9.cTdDj8YNcFsNafctLyeeu0oj871f9cZfbcbGTOLMaqE`;
    const axiosInstance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })

    return axiosInstance;
}

export default DoRequest;
