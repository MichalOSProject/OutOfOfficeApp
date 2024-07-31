import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

const EmployeesEdit = () => {
    const location = useLocation();
    const data = location.state?.selEmplo || {};
    const HR = location.state?.HR || {};
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const isAddMode = location.pathname.includes('/add');

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setSelID(data.id)
        console.log(HR);
    }, []);

    const onSubmit = async () => {
        const formData = getValues();
        !isAddMode ?
            formData.ID = parseInt(selID) : null;
        formData.employeeStatus = formData.employeeStatus === 'true';
        formData.employeePartner = parseInt(formData.employeePartner);
        formData.freeDays = parseInt(formData.freeDays);
        var formattedData = new FormData();
        for (const key in formData) {
            formattedData.append(key, formData[key]);
        }
        console.log(formData)

        fetch(isAddMode ? 'https://localhost:7130/api/employee/add' : 'https://localhost:7130/api/employee/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log('Success:', data);
            setAlertMessage(isAddMode ? 'Employee added successfully' : 'Employee update successfully');
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            console.error('Error:', error);
            setAlertMessage(isAddMode ? 'Failed to add employee' : 'Failed to update employee');
            setAlertTitle('error');
            setOpenAlert(true);
        });
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
                <TextField
                    required
                    name="position"
                    label="Position"
                    defaultValue={data.position}
                    {...register("position", { required: true })}
                    error={!!errors.position}
                    helpertext={errors.position ? 'Position is required' : ''}
                />
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
