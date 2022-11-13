import Header from "../../components/Form/Header"
import Login from "../../components/Form/Login";
import * as SignupComponent from "../../components/Form/Signup";

import {hof} from '../../utils/hof'

const Signup = ({...props}) => {


    return (
        <div className="bg-[#f98b88] w-screen h-screen flex items-center justify-center">
            <div className="bg-white rounded-[15px] max-w-md w-full space-y-8 py-8 px-8">
            <Header
              heading="Signup to create an account"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/auth/signin"
            />
            <SignupComponent.default {...props}/>
            </div>
        </div>
    )
}

export default Signup

export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: false,
            authenticationReq: false,
            authorizationReq: false
        }
    }
})




