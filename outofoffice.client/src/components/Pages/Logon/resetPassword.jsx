import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ResetPasswordPage = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState(null);
    const [isCorrectStatus, setIsCorrectStatus] = useState();
    const isCorrect = () => {
        const formData = getValues();
        if (formData.passwordN1 === formData.passwordN2) {
            setIsCorrectStatus(true)
            return true;
        } else {
            setIsCorrectStatus(false)
            return false;
        }
    }
    const decodedToken = jwtDecode(localStorage.getItem('token'));

    const onSubmit = async () => {
        if (isCorrect()) {

            const formData = getValues();
            const loginData = {
                login: decodedToken.sub,
                Password: formData.password,
                newPassword: formData.passwordN1
            }

            fetch('https://localhost:7130/api/account/passwordReset', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        throw new Error(errorData);
                    });
                }
                return response.json();
            }).then(data => {
                const { token } = data;
                localStorage.setItem('token', token);
                setErrorText(null)
                navigate('/',);
            }).catch(error => {
                setErrorText(error.message)
            });
        }
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '1rem',
                boxSizing: 'border-box'
            }}
        >
            <h1>Change your Password </h1>
            <h2 style={{ color: 'red' }}>{errorText != null ? errorText : ''}</h2>
            <h2 style={{ color: 'red' }}>{isCorrectStatus === false ? 'The passwords entered are not the same!' : ''}</h2>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    required
                    name="currentPassword"
                    label="Current password"
                    type="password"
                    {...register("password", { required: true })}
                    error={!!errors.password}
                    helpertext={errors.password ? 'Password is required' : ''}
                />
                <br />
                <TextField
                    required
                    name="newPassword"
                    label="New password"
                    type="password"
                    {...register("passwordN1", { required: true })}
                    error={!!errors.password}
                    helpertext={errors.password ? 'Password is required' : ''}
                />
                <br />
                <TextField
                    required
                    name="confirmPassword"
                    label="Confirm password"
                    type="password"
                    {...register("passwordN2", { required: true })}
                    error={!!errors.password}
                    helpertext={errors.password ? 'Password is required' : ''}
                />
                <br />
                <Button type="submit" variant="contained" color="primary">
                    Set New Password
                </Button>
            </Box>
        </div>
    );
};

export default ResetPasswordPage;
