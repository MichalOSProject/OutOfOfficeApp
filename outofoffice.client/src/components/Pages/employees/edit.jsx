import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem, Checkbox, Backdrop, CircularProgress, Fade } from "@mui/material";
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const EmployeesEdit = () => {
    const location = useLocation();
    const data = location.state || {};
    const [HR, setHR] = useState([]);
    const [HRLoaded, setHRLoaded] = useState(false);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [usernameLoaded, setUsernameLoaded] = useState(false);
    const [isEnablePasswordChange, setisEnablePasswordChange] = useState(false);
    const [isEnableAdminMode, setisEnableAdminMode] = useState(false);
    const admList = ['BOSS', 'Admin'];
    const [newPosition, setNewPosition] = useState(true);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [fadeTime, setFadeTime] = useState(0);


    const isHrMode = () => {
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        return decodedToken.position === 'HR' || admList.includes(decodedToken.position) ? true : false;
    }
    const isAdminMode = () => {
        const decodedToken = jwtDecode(localStorage.getItem('token'));
        return admList.includes(decodedToken.position) ? true : false;
    }

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setSelID(data.id)
        isHrMode() ? null : navigate('/403',);

        if (!HRLoaded) {
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
                setHRLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        }
        if (!usernameLoaded) {
            if (isAdminMode()) {
                fetch('https://localhost:7130/api/account/username', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data.id)
                }).then(response => {
                    if (!response.ok) {
                        return response.text().then(errorData => {
                            throw new Error(errorData);
                        });
                    }
                    return response.text();
                }).then(data => {
                    setUsername(data)
                    setUsernameLoaded(true)
                }).catch(error => {
                    alert(error.message)
                });
            }
        }
        if ((isAdminMode() ? usernameLoaded: true) && HRLoaded)
        {
            setFadeTime(700)
            setLoading(false);
        }

    }, [HR, username, data]);

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

            userData.ID = parseInt(selID)

        await fetch('https://localhost:7130/api/employee/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }).then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    throw new Error(errorData);
                });
            }
            return response.text();
        }).then(data => {
            setAlertMessage(data);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });

        if (isAdminMode() && isEnableAdminMode) {
            isEnablePasswordChange ? null : logonData.Password = null
            await fetch('https://localhost:7130/api/account/update', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logonData)
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        throw new Error(errorData);
                    });
                }
                return response.text();
            }).then(data => {
                setUsername(data)
            }).catch(error => {
                alert(error.message)
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                TransitionComponent={Fade}
                transitionDuration={fadeTime} // Czas zanikania w ms
            >
                Loading Data
                <CircularProgress size={100} sx={{ color: '#7b00ff' }} />
            </Backdrop>
            <h1>Employee ID: {selID}</h1>
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
                {(isAdminMode()) && (
                    <Box>
                        <br />
                        <h2>Edit Logon Data? <Checkbox checked={isEnableAdminMode} onChange={handleChangeAdminMode} /></h2>
                    </Box>
                )}
                {(isAdminMode() && isEnableAdminMode) && (
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
                        <h3>Require change password at next logon:<Checkbox defaultChecked={false} {...register("changePassword")} /></h3>
                        <h3>Do you want to change a password? <Checkbox checked={isEnablePasswordChange} onChange={handleChangePassword} disabled={false} /></h3>
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            disabled={!isEnablePasswordChange}
                            {...register("password", { required: isEnablePasswordChange })}
                            error={!!errors.password}
                            helpertext={errors.password ? 'Password is required' : ''}
                        />
                    </Box>)}
                    <br/>
                <Button type="submit" variant="contained" color="primary">
                    Confirm
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
