import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const EmployeesEdit = () => {
    const location = useLocation();
    const data = location.state?.selEmplo || {};
    const HR = location.state?.HR || {};
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isEnablePasswordChange, setisEnablePasswordChange] = useState(false);
    const [isEnableAdminMode, setisEnableAdminMode] = useState(false);
    const admList = ['BOSS', 'Admin'];
    const isAddMode = location.pathname.includes('/add');
    const [newPosition, setNewPosition] = useState(!isAddMode);

    const isHrMode = () => { //HR data Access
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        return decodedToken.position === 'HR' || admList.includes(decodedToken.position) ? true : false;
    }
    const isAdminMode = () => { //Login Data Access
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        return admList.includes(decodedToken.position) ? true : false;
    }

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setSelID(data.id)
        isAddMode ? setisEnablePasswordChange(true) : null;
        isHrMode() ? null : navigate('/403',);
        if (isAdminMode()) {
            fetch('https://localhost:7130/api/account/username', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: data.id })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            }).then(data => {
                setUsername(data)
            })
        }
    }, []);

    const onSubmit = async () => {
        const registerData = getValues();

        registerData.employeeStatus = registerData.employeeStatus === 'true';
        registerData.employeePartner = parseInt(registerData.employeePartner);
        registerData.freeDays = parseInt(registerData.freeDays);

        const userData = {
            employeeStatus:
                registerData.employeeStatus,
            freeDays:
                registerData.freeDays,
            name:
                registerData.name,
            photo:
                registerData.photo,
            position:
                registerData.position,
            subdivision:
                registerData.subdivision,
            surname:
                registerData.surname,
            employeePartner:
                registerData.employeePartner
        };

        const logonData = {
            changePassword: registerData.changePassword,
            login: registerData.login,
            Password: registerData.password,
            EmployeeId: parseInt(selID)
        };

        !isAddMode ?
            userData.ID = parseInt(selID) : null;

        await fetch(isAddMode ? 'https://localhost:7130/api/employee/add' : 'https://localhost:7130/api/employee/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(isAddMode ? registerData : userData)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        }).then(data => {
            console.log('Response: ', data);
            setAlertMessage(isAddMode ? 'Employee added successfully' : 'Employee update successfully');
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            console.error('Error:', error);
            setAlertMessage(isAddMode ? 'Failed to add employee' : 'Failed to update employee');
            setAlertTitle('error');
            setOpenAlert(true);
        });

        if (!isAddMode && isAdminMode() && isEnableAdminMode) {
            isEnablePasswordChange ? null : logonData.Password = null
            console.log('to send:', logonData)
            await fetch('https://localhost:7130/api/account/update', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logonData)
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            }).then(data => {
                setUsername(data)
                console.log('Response: ', data);
            }).catch(error => {
                console.error('Error:', error);
            });
        }
    };

    const handleChangeAdminMode = (event) => {
        setisEnableAdminMode(event.target.checked);
    };

    const handleChangePassword = (event) => {
        setisEnablePasswordChange(event.target.checked);
    };

    const handleChangeIndividualOption = (event) => {
        setNewPosition(event.target.checked);
    };

    return (
        <div>
            <h1>{isAddMode ? 'Add New Employee' : 'Employee ID: ' + selID}</h1>
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
                    defaultValue={ data.position}
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
                <br/>
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
                        defaultValue={data.employeePartner}
                        label="Employee Partner"
                        autoWidth
                        name="employeePartner"
                        type="number"
                        {...register("employeePartner", { required: true })}
                        error={!!errors.employeePartner}
                        helpertext={errors.employeePartner ? 'Employee Partner is required' : ''}
                    >
                        {HR.map((model, index) => (
                            <MenuItem key={index} value={model.id} disabled={!model.employeeStatus}>{model.name + ' ' + model.surname}</MenuItem>
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
                {(isAdminMode() && !isAddMode )&& (
                    <Box>
                        <br />
                        <h2>Edit Logon Data? <Checkbox checked={isEnableAdminMode} onChange={handleChangeAdminMode} /></h2>
                    </Box>
                )}
                {( (isAdminMode() && isEnableAdminMode) || isAddMode) && (
                    <Box>
                        <h2>Only for adding a new user or for administrators</h2>

                        <TextField
                            name="login"
                            label="Login"
                            defaultValue={username}
                            {...register("login", { required: true })}
                            error={!!errors.login}
                            helpertext={errors.login ? 'Login is required' : ''}
                        />
                        <h3>Require change password at next logon:<Checkbox defaultChecked={isAddMode} {...register("changePassword")} /></h3>
                        <h3>Do you want to change a password? <Checkbox checked={isEnablePasswordChange} onChange={handleChangePassword} disabled={isAddMode} /></h3>
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            disabled={!isEnablePasswordChange }
                            {...register("password", { required: isEnablePasswordChange })}
                            error={!!errors.password}
                            helpertext={errors.password ? 'Password is required' : ''}
                        />
                    </Box>)}
                <Button type="submit" variant="contained" color="primary">
                    {isAddMode ? 'Add' : 'Confirm'}
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

export default EmployeesEdit;
