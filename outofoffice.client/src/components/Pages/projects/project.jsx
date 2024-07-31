import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Projects = () => {
    const navigate = useNavigate();
    const [selProj, setSelProj] = useState({});
    const [projects, setprojects] = useState([]);
    const [PM, setPM] = useState([]);
    const [error, setError] = useState(null);
    const [selID, setSelID] = useState(0);
    const [selLineNumber, setSelLineNumber] = useState(0);

    useEffect(() => {
        if (PM.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://localhost:7130/api/employee');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log('Data fetched:', result);
                    const filteredPM = result.filter(emplo => emplo.position === 'Project Manager');
                    setPM(filteredPM);
                    console.log('Filtered PM employees:', PM);
                } catch (error) {
                    setError(error);
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
        if (projects.length == 0) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://localhost:7130/api/project');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log('Data fetched:', result);
                    setprojects(result);
                } catch (error) {
                    setError(error);
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [PM,projects]);

    const columns = [
        { field: 'LP', headerName: 'LP' },
        { field: 'id', headerName: 'ID:' },
        { field: 'projectType', headerName: 'Project Type:' },
        { field: 'startDate', headerName: 'Start Date:' },
        { field: 'endDate', headerName: 'End Date:' },
        { field: 'managerId', headerName: 'Project Manager:' },
        { field: 'comment', headerName: 'Comment:' },
        { field: 'projectStatus', headerName: 'Project Status:' },
    ];

    const managerInfo = (managerID) => {
        const manager = PM.find(PM => PM.id === managerID);
        if (manager) {
            return manager.name + ' ' + manager.surname;
        } else {
            return 'Requires attention';
        }
    };

    const rows = projects.map((item, index) => ({
        LP: index + 1,
        id: item.id,
        projectType: item.projectType,
        startDate: item.startDate,
        endDate: item.endDate,
        managerId: managerInfo(item.managerId),
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

        console.log('Selected Project:', selectedRow);
    };

    const handleEditClick = () => {
        navigate('/projects/edit', { state: { selProj, PM } });
    };
    const handleAddClick = () => {
        setSelProj(null)
        navigate('/projects/add', { state: { selProj, PM } });
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
