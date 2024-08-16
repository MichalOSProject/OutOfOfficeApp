import { useEffect, useState } from 'react';
import { Box, TextField, Button, Alert, AlertTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const LeaveRequestsAdd = () => {
    const location = useLocation();
    const selLR = location.state || {};
    const navigate = useNavigate();
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const token = localStorage.getItem('token');

    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    useEffect(() => {
    }, []);

    const onSubmit = async () => {
        let isError = false;
        let newLrId = null

            const formData = getValues();
            formData.EmployeeId = 0;
            formData.RequestStatus = 0
            formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
            formData.endDate = dayjs(endDate).format('YYYY-MM-DD');

            await fetch('https://localhost:7130/api/leaverequest/add', {
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
                newLrId = data
                setAlertMessage(data.message);
                setAlertTitle('success');
                setOpenAlert(true);
            }).catch(error => {
                isError = true;
                setAlertMessage(error.message);
                setAlertTitle('error');
                setOpenAlert(true);
            });

        if (!isError) {
            formData.id = parseInt(newLrId)
            formData.requestStatus = 0
            const selLR = formData
            navigate('/leaverequests/open', { state: selLR });
        }
    };

    return (
        <div>
            <h1>Add New Leave Request</h1>
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
                    required={true}
                    name="absenceReason"
                    label="Absence Reason"
                    defaultValue={selLR.absenceReason}
                    {...register("absenceReason", { required: true })}
                    error={!!errors.absenceReason}
                    helpertext={errors.absenceReason ? 'Absence Reason is required' : ''}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        required={true}
                        name="startDate"
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue)
                        }}
                        disablePast={true}
                    />
                    <DatePicker
                        required={true}
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
                <TextField
                    name="comment"
                    label="Comment"
                    defaultValue={selLR.comment}
                    {...register("comment", { required: false })}
                />
                <br />
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

export default LeaveRequestsAdd;
