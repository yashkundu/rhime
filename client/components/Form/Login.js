import { useState } from 'react';
import { loginFields } from "./formFields";
import FormAction from "./FormAction";
import Input from "./Input";

import { useRequest } from '../../hooks/useRequest';
import {useRouter} from 'next/router'

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

import { Alert } from '@mui/material';

export default function Login({invokeSuccess, invokeFailure}){
    const [loginState,setLoginState]=useState(fieldsState);
    const router = useRouter()

    const {doRequest, errors} = useRequest({
        url: '/api/auth/signin',
        method: 'post',
        body: {
            userName: loginState.userName,
            password: loginState.password
        },
        onSuccess: () => {
            invokeSuccess('Successfully signed in')
            router.push('/')
        },
        onError: () => {
            invokeFailure('Error in sign in')
        }
      })


    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        await login();
    }

    //Handle Login API Integration here
    const login = async () =>{
        await doRequest()
    }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
        </div>
        {(errors && !errors[0].field) && (
            <Alert severity="error">{errors[0].msg}</Alert>
        )}

        <FormAction handleSubmit={handleSubmit} text="Login"/>

      </form>
    )
}