import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const LeaveRequest = () => {
    const navigate = useNavigate();
    const [selLR, setSelLR] = useState({});
    const [LRs, setLRs] = useState([]);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

    useEffect(() => {
        if (data.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://localhost:7130/api/employee');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log('Data fetched:', result);
                    setData(result);
                } catch (error) {
                    setError(error);
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
        if (LRs.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://localhost:7130/api/leaveRequest');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log('Data fetched:', result);
                    setLRs(result);
                } catch (error) {
                    setError(error);
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [data, setLRs]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'employeeId', headerName: 'Employee:' },
        { field: 'absenceReason', headerName: 'Absence Reason:' },
        { field: 'startDate', headerName: 'Start Date:' },
        { field: 'endDate', headerName: 'End Date:' },
        { field: 'comment', headerName: 'Comment:' },
        { field: 'requestStatus', headerName: 'Request Status:' },
    ];

    const employeeInfo = (employeeID) => {
        const employee = data.find(emplo => emplo.id === employeeID);
        if (employee) {
            return employee.name + ' ' + employee.surname;
        } else {
            return 'Requires attention';
        }
    };

    const rows = LRs.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        employeeId: employeeInfo(item.employeeId),
        absenceReason: item.absenceReason,
        startDate: item.startDate,
        endDate: item.endDate,
        comment: item.comment,
        requestStatus: item.requestStatus
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = LRs.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setSelLR(selectedRow);

        console.log('Selected Leave Request:', selectedRow);
    };

    const handleEditClick = () => {
        const employee = employeeInfo(selLR.employeeId)
    navigate('/leaverequests/edit', { state: { selLR, employee } });
    };
    const handleAddClick = () => {
        setSelLR(null)
        const employee = null
        navigate('/leaverequests/add', { state: { selLR, employee } });
    };


    return (
        <div>
            <h1>
                Leave Request ID: {selID}
            </h1>
            <Button variant="contained" onClick={handleEditClick} disabled={selLineNumber != 0 ? false : true}>Edit</Button>
            <Button variant="contained" onClick={handleAddClick}>Add</Button>
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
export default LeaveRequest;