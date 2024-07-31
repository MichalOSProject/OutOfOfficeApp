import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Employees = () => {
    const navigate = useNavigate();
    const [selEmplo, setselEmplo] = useState({});
    const [data, setData] = useState([]);
    const [HR, setHR] = useState([]);
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
        const filteredHR = data.filter(emplo => emplo.position === 'HR');
        setHR(filteredHR);
        console.log('Filtered HR employees:', HR);
    }, [data]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'name', headerName: 'Name:' },
        { field: 'surname', headerName: 'Surname:' },
        { field: 'subdivision', headerName: 'Subdivision:' },
        { field: 'position', headerName: 'Position:' },
        { field: 'employeeStatus', headerName: 'Status:' },
        { field: 'employeePartner', headerName: 'Employee Partner:' },
        { field: 'freeDays', headerName: 'Free Days:' },
    ];

    const hrInfo = (hrID) => {
        const hr = HR.find(HRs => HRs.id === hrID);
        if (hr) {
            return hr.name + ' ' + hr.surname;
        } else {
            return 'Requires attention';
        }
    };

    const rows = data.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        name: item.name,
        surname: item.surname,
        position: item.position,
        subdivision: item.subdivision,
        employeeStatus: item.employeeStatus ? 'Active':'Inactive',
        employeePartner: hrInfo(item.employeePartner),
        freeDays: item.freeDays,
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = data.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setselEmplo(selectedRow);

        console.log('Selected Employee:', selectedRow);
    };

    const handleEditClick = () => {
        navigate('/employees/edit', { state: { selEmplo, HR } });
    };
    const handleAddClick = () => {
        setselEmplo(null)
        navigate('/employees/add', { state: { selEmplo, HR } });
    };


    return (
        <div>
            <h1>
                Employee ID: {selID}
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
}

export default Employees;
