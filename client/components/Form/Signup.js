import { useState } from 'react';
import { signupFields } from "./formFields"
import FormAction from "./FormAction";
import Input from "./Input";
import { useRequest } from '../../hooks/useRequest';
import {useRouter} from 'next/router'

import { Alert } from '@mui/material';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup({invokeSuccess, invokeFailure}){
    const [signupState,setSignupState]=useState(fieldsState);
    const router = useRouter()

    const {doRequest, errors} = useRequest({
      url: '/api/auth/signup',
      method: 'post',
      body: {
          userName: signupState.userName,
          email: signupState.email,
          password: signupState.password
      },
      onSuccess: () => {
        invokeSuccess('Successfully signed up')
        router.push('/auth/signin')
      },
      onError: () => {
        invokeFailure('Error in signing up')
      }
    })

    const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

    const handleSubmit= async (e)=>{
        e.preventDefault();
        await createAccount()
        console.log('Errors ------ ', errors);
    }

    //handle Signup API Integration here
    const createAccount= async ()=>{
      await doRequest()
    }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
        {
                fields.map(field=>
                        (<>   
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                          />
                          {field.id===(errors && errors[0]?.field) && (
                            <Alert severity="error">{field.error}</Alert>
                          )}
                        </>)
                )}
          {(errors && !errors[0].field) && (
            <Alert severity="error">{errors[0].msg}</Alert>
          )}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>

         

      </form>
    )
}