import axiosInstance from './axiosInstance';

const API_URl = '/api/users';

export const registerUser = async (userData) => {
     const response = await axiosInstance.post(`${API_URl}/register`, userData);
     return response.data;
};

export const LoginUser = async (userData) => {
    const response = await axiosInstance.post(`${API_URl}/login`, userData);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axiosInstance.get(API_URl);
    return response.data;
};
