import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const ApprovalRequest = () => {
    const navigate = useNavigate();
    const [selectedAR, setSelectedAR] = useState({});
    const [ARs, setARs] = useState([]);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

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
        if (ARs.length == 0) {
            fetch('https://localhost:7130/api/approvalRequest', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                setARs(data)
            }).catch(error => {
                console.error('Error:', error);
            });
        }
    }, [setARs]);

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
        navigate('/approvalrequests/edit', { state: { selectedAR } });
    };


    return (
        <div>
            <h1>
                Approval Request ID: {selID}
            </h1>
            <Button variant="contained" onClick={handleEditClick} disabled={selLineNumber != 0 ? false : true}>Edit</Button>
            <div style={{ height: '50%', width: '100%' }}>
                <DataGrid
                    tablesort
                    rows={rows}
                    columns={columns}
                    autoHeight
                    onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
                    initialState={{
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
