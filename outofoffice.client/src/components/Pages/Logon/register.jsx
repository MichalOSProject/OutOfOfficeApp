import { Box, TextField, Button, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';

const Register = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();

    const onSubmit = async () => {
        const registerData = getValues();
        registerData.EmployeeId = parseInt(registerData.EmployeeId);
        console.log(registerData);

        fetch('https://localhost:7130/api/account/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
    };
    return (
        <div>
            <h1>Register</h1>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    required
                    name="login"
                    label="Login"
                    {...register("login", { required: true })}
                    error={!!errors.login}
                    helpertext={errors.login ? 'Login is required' : ''}
                />
                <TextField
                    required
                    name="password"
                    label="Password"
                    type="password"
                    {...register("password", { required: true })}
                    error={!!errors.password}
                    helpertext={errors.password ? 'Password is required' : ''}
                />
                <TextField
                    required
                    name="EmployeeId"
                    label="ID"
                    type="number"
                    {...register("EmployeeId", { required: true })}
                    error={!!errors.EmployeeId}
                    helpertext={errors.EmployeeId ? 'User ID is required' : ''}
                />
                <Checkbox defaultChecked {...register("changePassword")}/>
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </Box>
        </div>
    );
};

export default Register;
