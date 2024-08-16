import { useEffect, useState } from 'react';
import { Box, TextField, Button, Alert, AlertTitle, Backdrop, CircularProgress, Fade } from "@mui/material";
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const LeaveRequestsOpen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selLR = location.state || {};
    const { register, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [approverDetails, setApproverDetails] = useState([]);
    const [adLoaded, setAdLoaded] = useState(false);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [fadeTime, setFadeTime] = useState(0);


    const handleAlertClose = () => {
        setOpenAlert(false);
    };

    function statusDecodeLR(status) {
        switch (status) {
            case 0:
                return 'New';
            case 1:
                return 'Rejected';
            case 2:
                return 'Approved';
            case 3:
                return 'Cancelled';
            default:
                return 'Error Status';
        }
    }

    function statusDecodeAP(status) {
        switch (status) {
            case 0:
                return 'New';
            case 1:
                return 'Rejected';
            case 2:
                return 'Approved';
            default:
                return 'Error Status';
        }
    }

    useEffect(() => {
        setSelID(selLR.id)
        setStartDate(dayjs(selLR.startDate))
        setEndDate(dayjs(selLR.endDate))
        if (!adLoaded) {
            fetch('https://localhost:7130/api/approvalrequest/approveStatus', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selLR.id)
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(errorData => {
                        throw new Error(errorData);
                    });
                }
                return response.json();
            }).then(data => {
                setApproverDetails(data)
                setAdLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        } else {
            setFadeTime(700)
            setLoading(false);
        }

    }, [approverDetails, selLR]);

    const columns = [
        { field: 'id', headerName: 'ID:' },
        { field: 'approver', headerName: 'Approver:' },
        { field: 'status', headerName: 'Status:' },
        { field: 'comment', headerName: 'Comment:' }
    ];

    const rows = approverDetails.map((item) => ({
        id: item.id,
        approver: item.approver,
        status: statusDecodeAP(item.status),
        comment: item.comment == null ? "No comment" : item.comment
    }));

    const handleCancelRequest = async () => {
        let isError = false;
        await fetch('https://localhost:7130/api/leaverequest/cancel', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selID)
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
            isError = true;
            setAlertMessage(error.message);
            setAlertTitle('error');
            setOpenAlert(true);
        });
        if (!isError) {
            navigate('/leaverequests');
        }
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
            <h1>Leave Request ID: {selID}</h1>
            <h1>Employee: {selLR.employee}</h1>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    name="absenceReason"
                    label="Absence Reason"
                    defaultValue={selLR.absenceReason}
                    {...register("absenceReason", { required: true })}
                    error={!!errors.absenceReason}
                    helpertext={errors.absenceReason ? 'Absence Reason is required' : ''}
                    readOnly={true}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        name="startDate"
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue)
                        }}
                        readOnly={true}
                    />
                    <DatePicker
                        name="endDate"
                        label="End Date"
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => {
                            setEndDate(newValue)
                        }}
                        readOnly={true}
                    />
                </LocalizationProvider>
                <TextField
                    name="comment"
                    label="Comment"
                    defaultValue={selLR.comment}
                    {...register("comment", { required: false })}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    name="RequestStatus"
                    label="Request Status - Read Only"
                    defaultValue={statusDecodeLR(selLR.requestStatus)}
                    {...register("RequestStatus", { required: false })}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <br />
                <Button onClick={handleCancelRequest} variant="contained" color="primary" style={{ background: 'red' }}>
                    Cancel Request
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
            {approverDetails && (
                <DataGrid
                    tablesort
                    rows={rows}
                    columns={columns}
                    autoHeight
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                />)}
        </div>
    );
};

export default LeaveRequestsOpen;
