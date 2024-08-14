import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Projects = () => {
    const navigate = useNavigate();
    const [selProj, setSelProj] = useState({});
    const [projects, setprojects] = useState([]);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

    useEffect(() => {
        if (projects.length == 0) {
            fetch('https://localhost:7130/api/project', {
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
                setprojects(data)
            }).catch(error => {
                alert(error.message)
            });
        }
    }, [projects]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'projectType', headerName: 'Project Type:' },
        { field: 'startDate', headerName: 'Start Date:' },
        { field: 'endDate', headerName: 'End Date:' },
        { field: 'manager', headerName: 'Project Manager:' },
        { field: 'managerId', headerName: 'Project Manager ID:' },
        { field: 'comment', headerName: 'Comment:' },
        { field: 'projectStatus', headerName: 'Project Status:' },
    ];

    const rows = projects.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        projectType: item.projectType,
        startDate: item.startDate,
        endDate: item.endDate,
        manager: item.manager,
        managerId: item.managerId,
        comment: item.comment,
        projectStatus: item.projectStatus ? 'Active' : 'Inactive'
    }));

    const handleRowSelection = (newSelection) => {
        const selectedId = parseInt(newSelection[0]);
        const selectedRow = projects.find(row => row.id === selectedId);
        const selectedLineNumber = rows.findIndex(row => row.id === selectedId) + 1;

        setSelID(selectedId);
        setSelLineNumber(selectedLineNumber);
        setSelProj(selectedRow);
    };

    const handleEditClick = () => {
        navigate('/projects/edit', { state: selProj });
    };
    const handleAddClick = () => {
        setSelProj(null)
        navigate('/projects/add', { state: selProj });
    };


    return (
        <div>
            <h1>
                Project ID: {selID}
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
                                managerId: false
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

export default Projects;
