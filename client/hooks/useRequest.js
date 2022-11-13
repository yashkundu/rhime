import axios from 'axios'
import { useState } from 'react'

export const useRequest = ({url, method, body, onSuccess, onError}) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async () => {
        try {
            setErrors(null)
            const response = await axios({
                method,
                url,
                data: body,
                withCredentials: true
            })
            if(onSuccess){
                onSuccess(response.data)
            }
            return response.data
        } catch (err) {
            console.log('use Request Error -- ', err.response.data)
            setErrors(err.response.data.errors)
            setTimeout(() => setErrors(null), 1000*10)
            if(onError) onError()
        }
    }

    return {doRequest, errors}

}