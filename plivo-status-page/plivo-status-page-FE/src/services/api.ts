import axios from 'axios';
// import { showToast } from '@/components/common/toast';

type AxiosRequestArgs = {
    method: "GET" | "POST"
    endpoint: string
    jwt?: boolean
    data?: Record<string, any>
}

export const Api = async ({ method, data={}, jwt = true, endpoint }: AxiosRequestArgs) => {
    const token = localStorage.getItem('token')
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Method': method,
            ...(jwt ? { Authorization: `Bearer ${token}` } : {}),
        }
    };

    return await axios.request({
        ...config,
        url: `${baseUrl}${endpoint}`,
        method,
        data,
    }).then((res) => {
        // console.log("todoapi => res.data",res.data)
        return res.data;
    }).catch(err => {
        const error_message = err?.response?.data?.message ?? "Something went wrong"
        const error_code = err?.response?.data?.status ?? "000"
        if(["TOKEN_EXPIRED","TOKEN_INVALID","TOKEN_MISSING"].includes(error_code)){
            console.log("token expired")
            localStorage.removeItem('token');
            window.location.href = window.location.origin;
        }
        return {
            error: {
                message: error_message,
                code: error_code,
            }
        }
        // showToast(error || error_code || "Something went wrong", "error")
    })
};
