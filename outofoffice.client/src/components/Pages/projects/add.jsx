import { useEffect, useState } from 'react';
import {
    Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem
} from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ProjectsAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selProj = location.state || {};
    const { register, getValues, formState: { errors } } = useForm();
    const [PMs, setPMs] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [allUsers, setAllUsers] = useState([]);
    const [newMembersList, setNewMembersList] = useState([]);
    const token = localStorage.getItem('token');

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        if (allUsers.length == 0) {
            fetch('https://localhost:7130/api/employee', {
                method: 'Get',
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
                setAllUsers(data)
            }).catch(error => {
                alert(error.message)
            });
        }
        if (PMs.length == 0) {
            fetch('https://localhost:7130/api/employee/pms', {
                method: 'Get',
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
                setPMs(data)
            }).catch(error => {
                alert(error.message)
            });
        }
    }, [allUsers, PMs]);

    const onSubmit = async (event) => {
        let isError = false;
        let newProjectId = null
        event.preventDefault();
        const formData = getValues();
            formData.members = newMembersList

        formData.projectStatus = formData.projectStatus === 'true';
        formData.managerId = parseInt(formData.managerId);
        formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
        formData.endDate = dayjs(endDate).format('YYYY-MM-DD');
        await fetch('https://localhost:7130/api/project/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    throw new Error(errorData);
                });
            }
            return response.text();
        }).then(data => {
            newProjectId = data
            setAlertMessage(data.message);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            isError = true;
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });
        if (!isError)
        {
            formData.id = parseInt(newProjectId);
            const selProj = formData
            navigate('/projects/edit', { state: selProj });
        }
    };

    const handleChangeMembersList = (e) => {
        setNewMembersList(e.target.value)
    };

    return (
        <div>
            <h1>Add New Project</h1>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
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
                        disablePast={true}
                    />
                    <DatePicker
                        required
                        name="endDate"
                        label="End Date"
                        value={endDate}
                        disablePast={true}
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
                        {PMs.map((model, index) => (
                            <MenuItem key={index} value={model.id} disabled={model.Status}>{model.name}</MenuItem>
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
            </Box>
            <h2>Project Members:</h2>
            <FormControl sx={{ m: 1, minWidth: 200 }} required={false}>
                <InputLabel id="newMembers-label">Select Members</InputLabel>
                <Select
                    labelId="newMembers-label"
                    label="New members"
                    autoWidth
                    multiple
                    name="newMembers"
                    value={newMembersList}
                    onChange={handleChangeMembersList}
                >
                    {allUsers.map((model, index) => (
                        <MenuItem key={index} value={model.id} disabled={!model.employeeStatus}>{model.name + ' ' + model.surname}</MenuItem>
                    ))
                    }
                </Select>
            </FormControl>
                <h2><Button type="submit" variant="contained" color="primary" onClick={onSubmit}>
                    Add Project
                </Button></h2>
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

export default ProjectsAdd;
