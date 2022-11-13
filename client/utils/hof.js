const hof = (gssp) => {
    return async (context) => {
        let pageProps = await gssp(context);
        let data = null;
        try {
            data = JSON.parse(context.req.headers['user-auth'])
        } catch (error) {
            data = null;
        }
        // data  -> {sideBar, authenticationReq, authorizationReq}
        console.log(data);
        // pageProps.props  -> {sideBar, authenticationReq, authorizationReq}
        pageProps.props.user = data

        if(data) {
            if(!data.isAuth) 
            if(!pageProps.props.authorizationReq) return pageProps
            else 
                return {
                    redirect: {
                        permanent: false,
                        destination: "/auth/spotify"
                    }
                }
            if(!pageProps.props.authenticationReq || !pageProps.props.authorizationReq)
                return {
                    redirect: {
                        permanent: false,
                        destination: "/"
                    }
                }
        }

        else {
            data = null
            console.log('authentication middleware error --- ');
            if(pageProps.props.authenticationReq)
                return {
                    redirect: {
                        permanent: false,
                        destination: "/auth/signin"
                    }
                }
        }
        pageProps.props.user = data
        return pageProps
    }
}

export {hof}