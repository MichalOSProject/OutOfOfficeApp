import { useEffect, useState } from 'react';
import { Box, TextField, Button, Alert, AlertTitle } from '@mui/material';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { jwtDecode } from "jwt-decode";

const LeaveRequestsEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selLR = location.state || {};
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [selID, setSelID] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const isAddMode = location.pathname.includes('/add');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [approverDetails, setApproverDetails] = useState([]);

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
        if (!isAddMode) {
            setStartDate(dayjs(selLR.startDate))
            setEndDate(dayjs(selLR.endDate))
            if (approverDetails.length == 0) {
                fetch('https://localhost:7130/api/approvalrequest/approveStatus', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
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
                }).catch(error => {
                    alert(error.message)
                });
            }
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

    const onSubmit = async () => {
        let isError = false;
        let newLRId = null

        if (isAddMode) {
            const formData = getValues();
            const decodedToken = jwtDecode(localStorage.getItem('token'));
            formData.EmployeeId = parseInt(decodedToken.id)
            formData.RequestStatus = 0
            formData.startDate = dayjs(startDate).format('YYYY-MM-DD');
            formData.endDate = dayjs(endDate).format('YYYY-MM-DD');

            await fetch('https://localhost:7130/api/leaverequest/add', {
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
                newLRId = data
                setAlertMessage(data.message);
                setAlertTitle('success');
                setOpenAlert(true);
            }).catch(error => {
                isError = true;
                setAlertMessage(error.message);
                setAlertTitle('error');
                setOpenAlert(true);
            });

            if (!isError && isAddMode) {
                formData.id = parseInt(newLRId);
                formData.requestStatus = 0;
                const selLR = formData
                navigate('/leaverequests/open', { state: selLR });
            }
        }
    };

    const handleCancelRequest = async() => {
        let isError = false;
        if (!isAddMode) {

            await fetch('https://localhost:7130/api/leaverequest/cancel', {
                method: 'POST',
                mode: 'cors',
                headers: {
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
        }
    };

    return (
        <div>
            <h1>{isAddMode ? 'Add New Leave Request' : 'Leave Request ID: ' + selID}</h1>
            {!isAddMode && (<h1>Employee: {selLR.employee}</h1>)}
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
                    required={isAddMode}
                    name="absenceReason"
                    label="Absence Reason"
                    defaultValue={selLR.absenceReason}
                    {...register("absenceReason", { required: true })}
                    error={!!errors.absenceReason}
                    helpertext={errors.absenceReason ? 'Absence Reason is required' : ''}
                    InputProps={{
                        readOnly: !isAddMode,
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        required={isAddMode}
                        name="startDate"
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue)
                        }}
                        readOnly={!isAddMode}
                        disablePast={isAddMode}
                    />
                    <DatePicker
                        required={isAddMode}
                        name="endDate"
                        label="End Date"
                        value={endDate}
                        disablePast={isAddMode}
                        minDate={startDate}
                        onChange={(newValue) => {
                            setEndDate(newValue)
                        }}
                        readOnly={!isAddMode}
                    />
                </LocalizationProvider>
                <TextField
                    name="comment"
                    label="Comment"
                    defaultValue={selLR.comment}
                    {...register("comment", { required: false })}
                    InputProps={{
                        readOnly: !isAddMode,
                    }}
                />
                {!isAddMode && (
                    <TextField
                        name="RequestStatus"
                        label="Request Status - Read Only"
                        defaultValue={statusDecodeLR(selLR.requestStatus)}
                        {...register("RequestStatus", { required: false })}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                )}
                <br />
                {isAddMode && (
                    <Button type="submit" variant="contained" color="primary">
                        Add
                    </Button>
                )}
                {!isAddMode && (
                    <Button onClick={handleCancelRequest} variant="contained" color="primary" style={{ background: 'red' }}>
                        Cancel Request
                    </Button>
                )}
            </Box>
            <Alert
                severity={alertTitle}
                onClose={handleAlertClose}
                sx={{ mt: 2, display: openAlert ? 'block' : 'none' }}
            >
                <AlertTitle>{alertTitle == 'error' ? 'Error' : 'Success'}</AlertTitle>
                {alertMessage}
            </Alert>
            {!isAddMode && approverDetails && (
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

export default LeaveRequestsEdit;
