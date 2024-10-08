import { useEffect, useState } from 'react';
import { Box, TextField, Button, InputLabel, FormControl, Alert, AlertTitle, Select, MenuItem, Backdrop, CircularProgress, Fade } from "@mui/material";
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ProjectsEdit = () => {
    const location = useLocation();
    const selProj = location.state || {};
    const { register, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [projectMembers, setProjectMembers] = useState([]);
    const [projectMembersLoaded, setProjectMembersLoaded] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [allUsersLoaded, setAllUsersLoaded] = useState(false);
    const [PMs, setPMs] = useState([]);
    const [PMsLoaded, setPMsLoaded] = useState(false);
    const [newMembersList, setNewMembersList] = useState([]);
    const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [fadeTime, setFadeTime] = useState(0);


    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
        setSelID(selProj.id)
        setStartDate(dayjs(selProj.startDate))
        setEndDate(dayjs(selProj.endDate))
        if (!projectMembersLoaded) {
            fetch('https://localhost:7130/api/Project/projectsMembers', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selProj.id)
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        throw new Error(errorData);
                    });
                }
                return response.json();
            }).then(data => {
                setProjectMembers(data)
                setProjectMembersLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        }

        if (!allUsersLoaded) {
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
                setAllUsersLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        }
        if (!PMsLoaded) {
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
                setPMsLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        }
        if (projectMembersLoaded && allUsersLoaded && PMsLoaded)
        {
            setFadeTime(700)
            setLoading(false);
        }

    }, [projectMembers, allUsers, PMs, selProj]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'name', headerName: 'Name:' },
        { field: 'surname', headerName: 'Surname:' },
        { field: 'subdivision', headerName: 'Subdivision:' },
        { field: 'position', headerName: 'Position:' },
        { field: 'employeeStatus', headerName: 'Status:' }
    ];

    const rows = projectMembers.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        name: item.name,
        surname: item.surname,
        position: item.position,
        subdivision: item.subdivision,
        employeeStatus: item.employeeStatus ? 'Active' : 'Inactive'
    }));

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = getValues();
        formData.ID = parseInt(selID)
        formData.projectStatus = formData.projectStatus === 'true';
        formData.managerId = parseInt(formData.managerId);
        formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
        formData.endDate = dayjs(endDate).format('YYYY-MM-DD');
        await fetch('https://localhost:7130/api/project/edit', {
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
            setAlertMessage(data.message);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });
    };

    const handleRowSelection = (newSelection) => {
        setSelectedProjectMembers(newSelection)
    };

    const handleDeleteMembersClick = () => {
        fetch('https://localhost:7130/api/Project/deleteProjectsMembers', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projID: selID, members: selectedProjectMembers })
        }).then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    throw new Error(errorData);
                });
            }
            return response.text();
        }).then(data => {
            setAlertMessage(data.message);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });
        window.location.reload();
    };

    const handleChangeMembersList = (e) => {
        setNewMembersList(e.target.value)
    };

    const handleAddMembersClick = () => {
        fetch('https://localhost:7130/api/Project/addProjectsMembers', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ projID: selID, members: newMembersList })
        }).then(response => {
            if (!response.ok) {
                return response.text().then(errorData => {
                    throw new Error(errorData);
                });
            }
            return response.text();
        }).then(data => {
            setAlertMessage(data.message);
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });
        window.location.reload();
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
            <h1>Project ID: {selID}</h1>
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
                <br />
                <Button type="submit" variant="contained" color="primary" onClick={onSubmit}>
                    Confirm
                </Button>
            </Box>
            <h2>Project Members:</h2>
            <FormControl sx={{ m: 1, minWidth: 200 }} required={true}>
                <InputLabel id="newMembers-label">Add new Members</InputLabel>
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
            <Button variant="contained" onClick={handleAddMembersClick} disabled={newMembersList.length == 0}>Add members</Button>
            <DataGrid
                tablesort
                rows={rows}
                columns={columns}
                autoHeight
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            LP: false
                        },
                    },
                    pagination: {
                        paginationModel: { page: 0, pageSize: 15 },
                    },
                }}
                pageSizeOptions={[5, 10, 15]}
            />
            <Button variant="contained" onClick={handleDeleteMembersClick} disabled={selectedProjectMembers.length == 0}>Delete members</Button>
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
