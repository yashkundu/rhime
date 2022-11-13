const loginFields=[
    {
        labelText:"UserName",
        labelFor:"userName",
        id:"userName",
        name:"userName",
        type:"text",
        autoComplete:"userName",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"UserName",
        labelFor:"userName",
        error: "The username should be of min length 2.",
        id:"userName",
        name:"userName",
        type:"text",
        autoComplete:"userName",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Email address",
        labelFor:"email-address",
        error: "Not a valid email address",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        error: "Password should be of min 7 characters containing atleast one number, one letter and one special character",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

export {loginFields,signupFields}