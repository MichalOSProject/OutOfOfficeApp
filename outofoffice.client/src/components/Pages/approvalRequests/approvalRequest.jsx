import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const ApprovalRequest = () => {
    const navigate = useNavigate();
    const [selLR, setSelLR] = useState({});
    const [ARs, setARs] = useState([]);
    const [data, setData] = useState([]);
    const [employee, setEmployee] = useState([]);
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
        if (ARs.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://localhost:7130/api/approvalRequest');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log('Data fetched:', result);
                    setARs(result);
                } catch (error) {
                    setError(error);
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [data, setARs]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'approverId', headerName: 'Approver:' },
        { field: 'approverType', headerName: 'Approver Position:' },
        { field: 'leaveRequestId', headerName: 'Leave Request Id:' },
        { field: 'requestStatus', headerName: 'Request Status:' },
        { field: 'comment', headerName: 'Comment:' }
    ];

    const employeeInfo = (employeeID) => {
        const employee = data.find(emplo => emplo.id === employeeID);
        if (employee) {
            return employee.name + ' ' + employee.surname;
        } else {
            return 'Requires attention';
        }
    };

    const employeePostition = (employeeID) => {
        const employee = data.find(emplo => emplo.id === employeeID);
        if (employee && (employee.position === 'HR' || employee.position === 'Project Manager')) {
            return employee.position;
        } else {
            return 'Requires attention';
        }
    };

    const rows = ARs.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        approverId: employeeInfo(item.approverId),
        approverType: employeePostition(item.approverId),
        leaveRequestId: item.leaveRequestId,
        requestStatus: item.requestStatus,
        comment: item.comment
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = ARs.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setSelLR(selectedRow);

        console.log('Selected Approval Request:', selectedRow);
    };

    const handleEditClick = () => {
        setEmployee(data.filter(emplo => emplo.id === selID));
        navigate('/approvalrequests/edit', { state: { selLR, employee } });
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
