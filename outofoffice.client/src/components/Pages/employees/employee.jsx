import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Employees = () => {
    const navigate = useNavigate();
    const [selEmplo, setselEmplo] = useState({});
    const [data, setData] = useState([]);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

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
        { field: 'employeePartnerId', headerName: 'Employee Partner ID:' },
        { field: 'freeDays', headerName: 'Free Days:' },
    ];

    const rows = data.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        name: item.name,
        surname: item.surname,
        position: item.position,
        subdivision: item.subdivision,
        employeeStatus: item.employeeStatus ? 'Active':'Inactive',
        employeePartner: item.employeePartner,
        employeePartnerId: item.employeePartnerID,
        freeDays: item.freeDays,
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = data.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setselEmplo(selectedRow);
    };

    const handleEditClick = () => {
        navigate('/employees/edit', { state: selEmplo });
    };
    const handleAddClick = () => {
        setselEmplo(null)
        navigate('/employees/add', { state: selEmplo });
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
                        sorting: {
                            sortModel: [{ field: 'id', sort: 'desc' }],
                        },
                        columns: {
                            columnVisibilityModel: {
                                LP: false,
                                employeePartnerId: false
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
}

export default Employees;
