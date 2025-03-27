import axios from 'axios';

const API_URl = 'http://localhost:5000/api/users';

export const registerUser = async (userData) => {
     const response = await axios.post(`${API_URl}/register`, userData);
     return response.data ;
     };

export const LoginUser = async (userData)=>{
    const response = await axios.post(`${API_URl}/login`,userData)
    return response.data ;
}
export const getAllUsers = async () => {
    const response = await axios.get(API_URl );
    return response.data;
};
