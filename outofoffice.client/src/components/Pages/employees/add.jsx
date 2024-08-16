import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const EmployeesAdd = () => {
    const location = useLocation();
    const data = location.state || {};
    const [HR, setHR] = useState([]);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const navigate = useNavigate();
    const [isEnablePasswordChange, setisEnablePasswordChange] = useState(false);
    const admList = ['BOSS', 'Admin'];
    const [newPosition, setNewPosition] = useState(false);
    const token = localStorage.getItem('token');

    const isHrMode = () => { //HR data Access
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        return decodedToken.position === 'HR' || admList.includes(decodedToken.position) ? true : false;
    }

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setisEnablePasswordChange(true);
        isHrMode() ? null : navigate('/403',);

        if (HR.length == 0) {
            fetch('https://localhost:7130/api/employee/hrs', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        throw new Error(errorData);
                    });
                }
                return response.json();
            }).then(data => {
                setHR(data)
            }).catch(error => {
                alert(error.message)
            });
        }
    }, [HR, data]);

    const onSubmit = async () => {
        let isError = false;
        let newUserId = null
        const registerData = getValues();

        registerData.employeeStatus = registerData.employeeStatus === 'true';
        registerData.employeePartner = parseInt(registerData.employeePartner);
        registerData.freeDays = parseInt(registerData.freeDays);

        await fetch('https://localhost:7130/api/employee/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        }).then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    throw new Error(errorData);
                });
            }
            return response.text();
        }).then(data => {
            newUserId = data
            setAlertMessage(data);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            isError = true;
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });

        if (!isError) {
            registerData.id = parseInt(newUserId);
            const selEmplo = registerData
            navigate('/employees/edit', { state: selEmplo });
        }
    };

    const handleChangePassword = (event) => {
        setisEnablePasswordChange(event.target.checked);
    };

    const handleChangeIndividualOption = (event) => {
        setNewPosition(event.target.checked);
    };

    return (
        <div>
            <h1>Add New Employee</h1>
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
                    name="name"
                    label="Name"
                    defaultValue={data.name}
                    {...register("name", { required: true })}
                    error={!!errors.name}
                    helpertext={errors.name ? 'Name is required' : ''}
                />
                <TextField
                    required
                    name="surname"
                    label="Surname"
                    defaultValue={data.surname}
                    {...register("surname", { required: true })}
                    error={!!errors.surname}
                    helpertext={errors.surname ? 'Surname is required' : ''}
                />
                <TextField
                    required
                    name="subdivision"
                    label="Subdivision"
                    defaultValue={data.subdivision}
                    {...register("subdivision", { required: true })}
                    error={!!errors.subdivision}
                    helpertext={errors.subdivision ? 'Subdivision is required' : ''}
                />
                <br />
                {newPosition && (<TextField
                    required
                    name="position"
                    label="Employee Position"
                    defaultValue={data.position}
                    {...register("position", { required: true })}
                    error={!!errors.position}
                    helpertext={errors.position ? 'Position is required' : ''}
                />)}
                {!newPosition && (<FormControl sx={{ m: 1, minWidth: 200 }} required>
                    <InputLabel id="employeePosition-label">Employee Position</InputLabel>
                    <Select
                        labelId="employeePosition-label"
                        label="Employee Position"
                        autoWidth
                        name="employeePosition"
                        {...register("position", { required: true })}
                        error={!!errors.position}
                        helpertext={errors.position ? 'Employee Position is required' : ''}
                    >
                        <MenuItem value={'HR'}>HR Manager</MenuItem>
                        <MenuItem value={'Project Manager'}>Project Manager</MenuItem>
                        <MenuItem value={'BOSS'}>System Administrator</MenuItem>
                    </Select>
                </FormControl>)}
                <b>Individual option? <Checkbox checked={newPosition} onChange={handleChangeIndividualOption} /></b>
                <br />
                <FormControl sx={{ m: 1, minWidth: 200 }} required>
                    <InputLabel id="employeeStatus-label">Employee Status</InputLabel>
                    <Select
                        labelId="employeeStatus-label"
                        defaultValue={data.employeeStatus ? 'true' : 'false'}
                        label="Employee Status"
                        autoWidth
                        name="employeeStatus"
                        {...register("employeeStatus", { required: true })}
                        error={!!errors.employeeStatus}
                        helpertext={errors.employeeStatus ? 'Employee Status is required' : ''}
                    >
                        <MenuItem value={'true'}>Active</MenuItem>
                        <MenuItem value={'false'}>Inactive</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }} required>
                    <InputLabel id="employeePartner-label">Employee Partner</InputLabel>
                    <Select
                        labelId="employeePartner-label"
                        defaultValue={data.employeePartnerID}
                        label="Employee Partner"
                        autoWidth
                        name="employeePartner"
                        type="number"
                        {...register("employeePartner", { required: true })}
                        error={!!errors.employeePartner}
                        helpertext={errors.employeePartner ? 'Employee Partner is required' : ''}
                    >
                        {HR.map((model, index) => (
                            <MenuItem key={index} value={model.id} disabled={model.Status}>{model.name}</MenuItem>
                        ))
                        }
                    </Select>
                </FormControl>
                <TextField
                    required
                    name="freeDays"
                    label="Free Days"
                    type="number"
                    defaultValue={data.freeDays}
                    {...register("freeDays", { required: true })}
                    error={!!errors.freeDays}
                    helpertext={errors.freeDays ? 'Free days are required' : ''}
                />
                <TextField
                    name="photo"
                    label="Photo source"
                    defaultValue={data.photo}
                    {...register("photo", { required: false })}
                />
                <h2>Logon information:</h2>
                <TextField
                    name="login"
                    label="Login"
                    {...register("login", { required: true })}
                    error={!!errors.login}
                    helpertext={errors.login ? 'Login is required' : ''}
                />
                <h3>Require change password at next logon:<Checkbox defaultChecked={true} {...register("changePassword")} /></h3>
                <h3>Do you want to change a password? <Checkbox checked={isEnablePasswordChange} onChange={handleChangePassword} disabled={true} /></h3>
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    disabled={!isEnablePasswordChange}
                    {...register("password", { required: isEnablePasswordChange })}
                    error={!!errors.password}
                    helpertext={errors.password ? 'Password is required' : ''}
                />
                <br/>
                <Button type="submit" variant="contained" color="primary">
                    Add
                </Button>
            </Box>
            <Alert
                severity={alertTitle}
                onClose={handleAlertClose}
                sx={{ mt: 2, display: openAlert ? 'block' : 'none' }}
            >
                <AlertTitle>{alertTitle == 'error' ? 'Error' : 'Success'}</AlertTitle>
                {alertMessage}
            </Alert>
        </div>
    );
};

export default EmployeesAdd;
