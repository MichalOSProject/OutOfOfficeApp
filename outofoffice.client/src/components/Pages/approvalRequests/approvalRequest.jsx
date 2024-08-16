import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Button, Backdrop, CircularProgress, Fade } from "@mui/material";   

const ApprovalRequest = () => {
    const navigate = useNavigate();
    const [selectedAR, setSelectedAR] = useState({});
    const [ARs, setARs] = useState([]);
    const [ARsLoaded, setARsLoaded] = useState(false);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [fadeTime, setFadeTime] = useState(0);


    function statusDecode(status){
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
        if (!ARsLoaded) {
            fetch('https://localhost:7130/api/approvalRequest', {
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
                setARs(data)
                setARsLoaded(true)
            }).catch(error => {
                alert(error.message)
            });
        } else {
            setFadeTime(700)
            setLoading(false);
        }

    }, [ARs]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'leaveRequestId', headerName: 'Leave Request Id:' },
        { field: 'employee', headerName: 'Employee:' },
        { field: 'startDate', headerName: 'Start Date:' },
        { field: 'endDate', headerName: 'End Date:' },
        { field: 'status', headerName: 'Status:' },
        { field: 'comment', headerName: 'Comment:' }
    ];

    const rows = ARs.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        leaveRequestId: item.leaveRequestId,
        employee: item.name + ' ' + item.surname,
        startDate: item.startDate,
        endDate: item.endDate,
        status: statusDecode(item.status),
        comment: item.comment
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = ARs.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setSelectedAR(selectedRow);
    };

    const handleEditClick = () => {
        navigate('/approvalRequests/resolve', { state: { selectedAR } });
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
            <h1>
                Approval Request ID: {selID}
            </h1>
            <Button variant="contained" onClick={handleEditClick} disabled={selLineNumber != 0 ? false : true}>Resolve</Button>
            <div style={{ height: '50%', width: '100%' }}>
                <DataGrid
                    tablesort
                    rows={rows}
                    columns={columns}
                    autoHeight
                    onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'id', sort: 'desc' }],
                        },
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
            </div>
        </div>
    );
};
export default ApprovalRequest;
