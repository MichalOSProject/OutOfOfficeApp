import { useEffect, useState } from 'react';
import { Box, TextField, Button, Alert, AlertTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';

const EmployeesEdit = () => {
    const location = useLocation();
    const selectedAR = location.state?.selectedAR || {};
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(0);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const handleAlertClose = () => {
        setOpenAlert(false);
        setStartDate(selectedAR.startDate)
        setEndDate(selectedAR.endDate)
    };

    useEffect(() => {
        setSelID(selectedAR.id)
    }, []);

    const onSubmit = async () => {
        const formData = getValues();
        formData.ID = parseInt(selID)
        formData.status = parseInt(event.submitter.value)

        fetch('https://localhost:7130/api/approvalrequest/edit', {
            method: 'POST',
            mode: 'cors',
            headers: {
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

    return (
        <div>
            <Box
                component="form"
                id="form-id"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    label="Employee"
                    defaultValue={selectedAR.name + ' ' + selectedAR.surname}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        readOnly
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        readOnly
                    />
                </LocalizationProvider>
                <TextField
                    label="Comment"
                    defaultValue={selectedAR.comment}
                    {...register("comment", { required: false })}
                />
                <br />
                <Button type="submit" value='2' variant="contained" color="primary" style={{ background: 'green' }}>
                    Approve
                </Button>
                <Button type="submit" value='1' variant="contained" color="primary" style={{ background: 'red' }}>
                    Reject
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
