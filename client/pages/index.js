import {hof} from '../utils/hof'


import Feed from "../components/Feed";


const Index = ({ ...props }) => {
    return (
        <Feed {...props}/>
    )
}

export default Index

export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: true,
            authenticationReq: true,
            authorizationReq: true
        }
    }
})


