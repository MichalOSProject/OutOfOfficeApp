import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const LeaveRequest = () => {
    const navigate = useNavigate();
    const [selLR, setSelLR] = useState({});
    const [LRs, setLRs] = useState([]);
    const [data, setData] = useState([]);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

    function statusDecode(status) {
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

    useEffect(() => {
        if (data.length == 0) {
            fetch('https://localhost:7130/api/employee', {
                method: 'GET',
                mode: 'cors',
                headers: {
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
                setData(data)
            }).catch(error => {
                alert(error.message)
            });
        }
        if (LRs.length == 0) {
            fetch('https://localhost:7130/api/leaveRequest', {
                method: 'GET',
                mode: 'cors',
                headers: {
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
                setLRs(data)
            }).catch(error => {
                alert(error.message)
            });
        }
    }, [data, setLRs]);

    const columns = [
        { field: 'LP', headerName: 'LP', hide: true },
        { field: 'id', headerName: 'ID:' },
        { field: 'employee', headerName: 'Employee:' },
        { field: 'absenceReason', headerName: 'Absence Reason:' },
        { field: 'startDate', headerName: 'Start Date:' },
        { field: 'endDate', headerName: 'End Date:' },
        { field: 'comment', headerName: 'Comment:' },
        { field: 'requestStatus', headerName: 'Request Status:' },
    ];

    const rows = LRs.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        employee: item.employee,
        absenceReason: item.absenceReason,
        startDate: item.startDate,
        endDate: item.endDate,
        comment: item.comment,
        requestStatus: statusDecode(item.requestStatus)
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = LRs.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setSelLR(selectedRow);
    };

    const handleOpenClick = () => {
        navigate('/leaverequests/open', { state: selLR });
    };
    const handleAddClick = () => {
        setSelLR(null)
        navigate('/leaverequests/add', { state: selLR });
    };


    return (
        <div>
            <h1>
                Leave Request ID: {selID}
            </h1>
            <Button variant="contained" onClick={handleOpenClick} disabled={selLineNumber != 0 ? false : true}>Open</Button>
            <Button variant="contained" onClick={handleAddClick}>Add</Button>
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
export default LeaveRequest;
