import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ProjectsEdit = () => {
    const location = useLocation();
    const selProj = location.state?.selProj || {};
    const PM = location.state?.PM || {};
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const isAddMode = location.pathname.includes('/add');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setSelID(selProj.id)
        if (!isAddMode) {
            setStartDate(dayjs(selProj.startDate))
            setEndDate(dayjs(selProj.endDate))
        }
    }, []);

    const onSubmit = async () => {
        const formData = getValues();
        !isAddMode ?
            formData.ID = parseInt(selID) : null;
        formData.projectStatus = formData.projectStatus === 'true';
        formData.managerId = parseInt(formData.managerId);
        formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
        formData.endDate = dayjs(endDate).format('YYYY-MM-DD');
        var formattedData = new FormData();
        for (const key in formData) {
            formattedData.append(key, formData[key]);
        }
        console.log(formData)

        fetch(isAddMode ? 'https://localhost:7130/api/project/add' : 'https://localhost:7130/api/project/edit', {
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
            setAlertMessage(isAddMode ? 'Project added successfully' : 'Project update successfully');
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            console.error('Error:', error);
            setAlertMessage(isAddMode ? 'Failed to add project' : 'Failed to update project');
            setAlertTitle('error');
            setOpenAlert(true);
        });
    };
    return (
        <div>
            <h1>{isAddMode ? 'Add New Project' : 'Project ID: ' + selID}</h1>
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
                    name="projectType"
                    label="Project Type"
                    defaultValue={selProj.projectType}
                    {...register("projectType", { required: true })}
                    error={!!errors.projectType}
                    helpertext={errors.projectType ? 'Project Type is required' : ''}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        required
                        name="startDate"
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue)
                        }}
                        disablePast={isAddMode }
                    />
                    <DatePicker
                        required
                        name="endDate"
                        label="End Date"
                        value={endDate}
                        disablePast={isAddMode}
                        minDate={startDate}
                        onChange={(newValue) => {
                            setEndDate(newValue)
                        }}
                    />
                </LocalizationProvider>
                <FormControl sx={{ m: 1, minWidth: 200 }} required>
                    <InputLabel id="managerId-label">Project Manager</InputLabel>
                    <Select
                        labelId="managerId-label"
                        defaultValue={selProj.managerId}
                        label="Project Manager"
                        autoWidth
                        name="managerId"
                        type="number"
                        {...register("managerId", { required: true })}
                        error={!!errors.managerId}
                        helpertext={errors.managerId ? 'Project Manager is required' : ''}
                    >
                        {PM.map((model, index) => (
                            <MenuItem key={index} value={model.id} disabled={!model.employeeStatus}>{model.name + ' ' + model.surname}</MenuItem>
                        ))
                        }
                    </Select>
                </FormControl>
                <TextField
                    name="comment"
                    label="Comment"
                    defaultValue={selProj.comment}
                    {...register("comment", { required: false })}
                />
                <FormControl sx={{ m: 1, minWidth: 200 }} required>
                    <InputLabel id="projectStatus-label">Project Status</InputLabel>
                    <Select
                        labelId="projectStatus-label"
                        defaultValue={selProj.projectStatus ? 'true' : 'false'}
                        label="Project Status"
                        autoWidth
                        name="projectStatus"
                        {...register("projectStatus", { required: true })}
                        error={!!errors.projectStatus}
                        helpertext={errors.projectStatus ? 'Project Status is required' : ''}
                    >
                        <MenuItem value={'true'}>Active</MenuItem>
                        <MenuItem value={'false'}>Inactive</MenuItem>
                    </Select>
                </FormControl>
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

export default ProjectsEdit;
