import Header from "../../components/Form/Header"
import Login from "../../components/Form/Login"

import { hof } from "../../utils/hof"

const Signin = ({...props}) => {


    return (
        <div className="bg-[#f98b88] w-screen h-screen flex items-center justify-center">
            <div className="bg-white rounded-[15px] max-w-md w-full space-y-8 py-8 px-8">
             <Header
                heading="Login to your account"
                paragraph="Don't have an account yet? "
                linkName="Signup"
                linkUrl="/auth/signup"
                />
            <Login {...props}/>
            </div>
        </div>
    )
}


export default Signin

export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: false,
            authenticationReq: false,
            authorizationReq: false
        }
    }
})


