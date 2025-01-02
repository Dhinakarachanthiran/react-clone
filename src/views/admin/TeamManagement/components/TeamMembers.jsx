import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './TeamMembers.css';
import { Box, Button } from '@chakra-ui/react';

const TeamMembers = ({ team, onBack }) => {
  const [teamData, setTeamData] = useState({
    teamName: 'Mavericks',
    manager: 'Sridhar Seshan',
    members: [
      {
        id: 1,
        name: 'Dhinakaran',
        email: 'Dhinakaran@gmail.com',
        role: 'Tester',
      },
      {
        id: 2,
        name: 'Nandhini',
        email: 'Nandhini@gmail.com',
        role: 'Designer',
      },
      { id: 3, name: 'Praveen', email: 'Praveen@gmail.com', role: 'Developer' },
      { id: 4, name: 'Ranjini', email: 'Ranjini@gmail.com', role: 'Tester' },
      { id: 5, name: 'Nithis', email: 'Nithis@gmail.com', role: 'Developer' },
      { id: 6, name: 'Lokesh', email: 'Lokesh@gmail.com', role: 'Designer' },
      {
        id: 7,
        name: 'Dhinakaran',
        email: 'Dhinakaran@gmail.com',
        role: 'Tester',
      },
      {
        id: 8,
        name: 'Nandhini',
        email: 'Nandhini@gmail.com',
        role: 'Designer',
      },
      { id: 9, name: 'Praveen', email: 'Praveen@gmail.com', role: 'Developer' },
      { id: 10, name: 'Ranjini', email: 'Ranjini@gmail.com', role: 'Tester' },
      { id: 11, name: 'Nithis', email: 'Nithis@gmail.com', role: 'Developer' },
      { id: 12, name: 'Lokesh', email: 'Lokesh@gmail.com', role: 'Designer' },
    ],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 7;

  const additionalMembers = [
    {
      id: 1,
      name: 'Dhinakaran',
      email: 'Dhinakaran@gmail.com',
      role: 'Tester',
    },
    { id: 2, name: 'Nandhini', email: 'Nandhini@gmail.com', role: 'Designer' },
    { id: 3, name: 'Praveen', email: 'Praveen@gmail.com', role: 'Developer' },
    { id: 4, name: 'Ranjini', email: 'Ranjini@gmail.com', role: 'Tester' },
    { id: 5, name: 'Nithis', email: 'Nithis@gmail.com', role: 'Developer' },
    { id: 6, name: 'Lokesh', email: 'Lokesh@gmail.com', role: 'Designer' },
  ];
  // AG Grid Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Role',
        field: 'role',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Actions',
        cellRenderer: (params) => (
          <button
            className="icon-button2"
            onClick={() => handleDeleteUser(params.data.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        ),
      },
    ],
    [],
  );

  const filteredMembers = additionalMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedMembers = teamData.members.slice(
    (currentPage - 1) * teamsPerPage,
    currentPage * teamsPerPage,
  );

  const totalPages = Math.ceil(teamData.members.length / teamsPerPage);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id],
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteUser = (id) => {
    const updatedMembers = teamData.members.filter(
      (member) => member.id !== id,
    );
    setTeamData((prevData) => ({
      ...prevData,
      members: updatedMembers,
    }));
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === additionalMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(additionalMembers.map((member) => member.id));
    }
  };

  const handleSave = () => {
    const selected = additionalMembers.filter((member) =>
      selectedMembers.includes(member.id),
    );
    setTeamData({
      ...teamData,
      members: [...teamData.members, ...selected],
    });
    setIsDropdownOpen(false);
    setSelectedMembers([]);
  };

  // AG Grid Default Column Properties
  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
    }),
    [],
  );

  return (
    <Box p={8} bg="white" minH="94vh">
      <div className="team-container">
        {/* Header Section */}
        <div className="team-header">
          <h1 className="team-name">{teamData.teamName}</h1>
          <div className="header-actions">
            <button onClick={onBack} className="backbtn">
              Back
            </button>
          </div>
        </div>

        {/* Team Manager */}
        <div className="manager-section">
          <div className="manager">
            <div className="manager-title">Project Manager:</div>
            <div className="manager-label">
              <div className="manager-avatar"></div>
              <span className="manager-name">{teamData.manager}</span>
            </div>
          </div>

          <div className="multi-select-container">
            <button className="dropdown-trigger" onClick={toggleDropdown}>
              Members:{' '}
              {selectedMembers.length > 0 ? selectedMembers.length : 'All'} ▼
            </button>
            {isDropdownOpen && (
              <div className="multi-select-dropdown">
                <div className="dropdown-header">
                  <input
                    type="text"
                    placeholder="Filter by Members"
                    className="dropdown-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="close-button"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    ✖
                  </button>
                </div>
                <ul className="dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          selectedMembers.length === additionalMembers.length
                        }
                        onChange={handleSelectAll}
                      />
                      Select All
                    </label>
                  </li>
                  {filteredMembers.map((member) => (
                    <li key={member.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                        />
                        <span className="member-icon">
                          {member.name[0].toUpperCase()}
                        </span>
                        {member.name} ({member.email})
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="dropdown-actions">
                  <button className="save-button" onClick={handleSave}>
                    Add
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={teamData.members}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={teamsPerPage}
          />
        </div>
      </div>
    </Box>
  );
};

export default TeamMembers;
