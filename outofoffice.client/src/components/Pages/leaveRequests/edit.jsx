import { useEffect, useState } from 'react';
import { Box, TextField, Button, Alert, AlertTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { jwtDecode } from "jwt-decode";

const LeaveRequestsEdit = () => {
    const location = useLocation();
    const selLR = location.state?.selLR || {};
    const employee = location.state?.employee || {};
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
        setSelID(selLR.id)
        if (!isAddMode) {
            setStartDate(dayjs(selLR.startDate))
            setEndDate(dayjs(selLR.endDate))
        }
    }, []);

    const onSubmit = async () => {
        const formData = getValues();

        if (isAddMode) {
            const decodedToken = jwtDecode(localStorage.getItem('token'));
            formData.EmployeeId = parseInt(decodedToken.id)
            formData.requestStatus = "New Request"
        } else {
            formData.ID = parseInt(selID)
            formData.EmployeeId = parseInt(selLR.employeeId)
        }
        formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
        formData.endDate = dayjs(endDate).format('YYYY-MM-DD');
        var formattedData = new FormData();
        for (const key in formData) {
            formattedData.append(key, formData[key]);
        }
        console.log(formData)

        fetch(isAddMode ? 'https://localhost:7130/api/leaverequest/add' : 'https://localhost:7130/api/leaverequest/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            return response.text();
        }).then(data => {
            console.log('Success:', data);
            setAlertMessage(isAddMode ? 'Leave Request added successfully' : 'Leave Request update successfully');
            setAlertTitle('success');
            setOpenAlert(true);
        }).catch(error => {
            console.error('Error:', error);
            setAlertMessage(isAddMode ? 'Failed to add Leave Request' : 'Failed to update Leave Request');
            setAlertTitle('error');
            setOpenAlert(true);
        });
    };
    return (
        <div>
            <h1>{isAddMode ? 'Add New Leave Request' : 'Leave Request ID: ' + selID}</h1>
            {!isAddMode && (<h1>Employee: {employee}</h1>)}
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
                    name="absenceReason"
                    label="Absence Reason"
                    defaultValue={selLR.absenceReason}
                    {...register("absenceReason", { required: true })}
                    error={!!errors.absenceReason}
                    helpertext={errors.absenceReason ? 'Absence Reason is required' : ''}
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
                        disablePast={isAddMode}
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
                <TextField
                    name="comment"
                    label="Comment"
                    defaultValue={selLR.comment}
                    {...register("comment", { required: false })}
                />
                {!isAddMode && (
                    <TextField
                        name="requestStatus"
                        label="Request Status - Read Only"
                        defaultValue={selLR.requestStatus}
                        {...register("requestStatus", { required: false })}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                )}
                <Button type="submit" variant="contained" color="primary">
                    {isAddMode ? 'Add' : 'Confirm'}
                </Button>
            </Box>
            <Alert
                severity={alertTitle}false
                onClose={handleAlertClose}
                sx={{ mt: 2, display: openAlert ? 'block' : 'none' }}
            >
                <AlertTitle>{alertTitle == 'error' ? 'Error' : 'Success'}</AlertTitle>
                {alertMessage}
            </Alert>
        </div>
    );
};

export default LeaveRequestsEdit;
