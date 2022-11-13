import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import React from 'react';
import { useState } from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Snack = ({Layout, Children, ...props}) => {

    const [snack, setSnack] = useState({
        open: false,
        info: '',
        severity: 'success'
    })

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnack({
            open: false,
            info: '',
            severity: 'success'
        });
    };

    const invokeSuccess = (info) => {
        setSnack({
            open: true,
            info: info,
            severity: 'success'
        })
    }

    const invokeFailure = (info) => {
        setSnack({
            open: true,
            info: info,
            severity: 'error'
        })
    }

    return (
        <>
            {(Layout) ? (
                <Layout {...props} Children={Children} invokeSuccess={invokeSuccess} invokeFailure={invokeFailure}/>
            ) : (
                <Children {...props} invokeSuccess={invokeSuccess} invokeFailure={invokeFailure}/>
            )}
            <Snackbar open={snack.open} autoHideDuration={1000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snack.severity} sx={{ width: '100%' }}>
                {snack.info}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Snack