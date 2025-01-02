import React, { useState, useEffect } from 'react';
// import menuConficJson from 'menuConfig.json';

import {
  Box,
  Heading,
  Button,
  Tag,
  Select,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './TeamManagement.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import TeamMembers from './TeamMembers'; 
import { useToast, Tooltip } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';

const TeamManagement = () => {
  const [activeView, setActiveView] = useState('TeamManagement'); 
  const [selectedTeam, setSelectedTeam] = useState({
    teamName: 'Mavericks',
    manager: 'Sridhar Seshan',
    members: [
      { name: 'Praveen', role: 'Developer' },
      { name: 'Nandhini', role: 'Developer' },
      { name: 'Rithika', role: 'Designer' },
      { name: 'Ranjini', role: 'Developer' },
      { name: 'Dhinakaran', role: 'QA' },
    ],
  });

  const [teams, setTeams] = useState([
    {
      id: 1,
      manager: 'Sridhar Seshan',
      project: 'Sage300',
      team: 'Mavericks',
      department: 'Development',
      status: 'Active',
    },
    {
      id: 2,
      manager: 'Selvakumaran V',
      project: 'Yellowstone',
      team: 'dardevils',
      department: 'Design',
      status: 'Active',
    },
    {
      id: 3,
      manager: 'Balasubramaniyan R',
      project: 'Rubicube',
      team: 'Team A',
      department: 'Marketing',
      status: 'Inactive',
    },
    {
      id: 4,
      manager: 'Antony Janiva A',
      project: 'Silver Greeks',
      team: 'Team D',
      department: 'Design',
      status: 'Active',
    },
    {
      id: 5,
      manager: 'Chandramohan T S',
      project: 'Sage HRMS',
      team: 'Team E',
      department: 'Marketing',
      status: 'Inactive',
    },
    {
      id: 6,
      manager: 'Emily Davis',
      project: 'Project Zeta',
      team: 'Team F',
      department: 'Development',
      status: 'Active',
    },
    {
      id: 7,
      manager: 'Chris Evans',
      project: 'Project Eta',
      team: 'Team G',
      department: 'Design',
      status: 'Inactive',
    },
    {
      id: 8,
      manager: 'Sophia Brown',
      project: 'Project Theta',
      team: 'Team H',
      department: 'Marketing',
      status: 'Active',
    },
    {
      id: 9,
      manager: 'David Wilson',
      project: 'Project Iota',
      team: 'Team I',
      department: 'Development',
      status: 'Active',
    },
    {
      id: 10,
      manager: 'Amy Adams',
      project: 'Project Kappa',
      team: 'Team J',
      department: 'Marketing',
      status: 'Inactive',
    },
  ]);

  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: '',
  });

  const toast = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit Modal visibility
  const [teamToDelete, setTeamToDelete] = useState(null); // Store team to be deleted
  const [teamToEdit, setTeamToEdit] = useState(null); // Store team to be edited
  const [isAddModalOpen, setIsAddModalOpen] = useState(null);

  const [newTeam, setNewTeam] = useState({
    manager: '',
    project: '',
    team: '',
    department: '',
    status: 'Active',
  }); // New Team Data

  // Filter logic
  const filteredTeams = teams.filter((team) => {
    const matchesDepartment =
      !filters.department || team.department === filters.department;
    const matchesStatus =
      !filters.status ||
      team.status.toLowerCase() === filters.status.toLowerCase();
    const matchesSearch =
      !filters.search ||
      team.manager.toLowerCase().includes(filters.search.toLowerCase()) ||
      team.team.toLowerCase().includes(filters.search.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  // const [accessRights, setAccessRights] = useState(null);

  // useEffect(() => {
  //   const storedAccessRights = JSON.parse(localStorage.getItem('accessDetails'));
  //   if (storedAccessRights) {
  //     const accessMap = {};
  //     storedAccessRights.forEach((screen) => {
  //       accessMap[screen.screenId] = screen;
  //     });
  //     setAccessRights(accessMap);
  //   }
  // }, []);

  // const screenId = menuConficJson.find((screen) => screen.name === 'Team Management')?.screenId;
  // const currentAccess = accessRights?.[screenId] || {};
  
  // const hasFullAccess = currentAccess?.fullAccess === 1;
  // const canAdd = hasFullAccess;
  // const canEdit = hasFullAccess;
  // const canDelete = hasFullAccess;

  const handleAddTeam = () => {
    if (
      !newTeam.manager ||
      !newTeam.team ||
      !newTeam.project ||
      !newTeam.department
    ) {
      toast({
        title: 'please fill all the required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    // Add new team to the list
    const newId = Math.max(...teams.map((team) => team.id), 0) + 1;
    setTeams([{ id: newId, ...newTeam }, ...teams]);
    toast({
      title: 'Team Added',
      description: `Team ${newTeam.team} has been added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-end',
    });
    // Reset form and close modal
    setIsAddModalOpen(false);
    setNewTeam({ manager: '', team: '', department: '', status: 'Active' });
  };

  const onAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleViewDetails = (team) => {
    setSelectedTeam(team);
    setActiveView('TeamMembers');
  };

  const handleBackToManagement = () => {
    setActiveView('TeamManagement');
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setActiveView('TeamMembers');
  };

  // Handle Edit Team
  const handleEditUser = (team) => {
    setTeamToEdit(team);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    setTeams(
      teams.map((team) => (team.id === teamToEdit.id ? teamToEdit : team)),
    );
    setIsEditModalOpen(false);
  };

  // Handle Delete Team
  const handleDeleteUser = (teamId) => {
    setTeamToDelete(teams.find((team) => team.id === teamId));
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = () => {
    setTeams(teams.filter((team) => team.id !== teamToDelete.id));
    toast({
      title: 'Team Deleted',
      description: `${teamToDelete?.team} has been removed successfully.`,
      status: 'error', 
      duration: 3000,
      isClosable: true,
      position: 'top-end',
    });
    setIsDeleteModalOpen(false); 
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false); 
  };

  const onEditModalClose = () => {
    setIsEditModalOpen(false); 
  };

  return (
    <div>
      {activeView === 'TeamManagement' && (
        <Box p={8} bg="white" minH="94vh">
          <Heading mb={5} padding="10px" marginTop="-3.5">
            Team Management
          </Heading>

          {/* Filters */}
          <Box display="flex" gap={4} mb={6}>
            <Select
              placeholder="All Departments"
              focusBorderColor="gray.500"
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              bg="white"
              size="sm"
              width="150px" 
              fontSize="14px" 
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Select
              placeholder="All Status"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              bg="white"
              focusBorderColor="gray.500"
              size="sm"
              width="150px"
              fontSize="14px"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Input
              placeholder="🔍Search Teams..."
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              bg="white"
              focusBorderColor="gray.500"
              size="sm"
              width="180px"
              fontSize="14px"
            />
            <Button
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<MdGroups style={{ width: '25px', height: 'auto' }} />}
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="6px 12px"
              _hover={{ bg: 'gray.200' }}
              display="flex"
              alignItems="center"
              // disabled={!canAdd}
            >
              Add Team
            </Button>
          </Box>
          {/* AG Grid */}
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: '100%' }}
          >
            <AgGridReact
              rowData={filteredTeams}
              columnDefs={[
                {
                  headerName: 'Manager Name',
                  field: 'manager',
                  filter: true,
                  sortable: true,
                },
                { headerName: 'Project Name', field: 'project' },
                {
                  headerName: 'Team Name',
                  field: 'team',
                  filter: true,
                  sortable: true,
                },
                { headerName: 'Department', field: 'department' },
                {
                  headerName: 'Status',
                  field: 'status',
                  cellRenderer: (params) => (
                    <Tag
                      className="Badge-lables"
                      colorScheme={params.value === 'Active' ? 'green' : 'red'}
                    >
                      {params.value}
                    </Tag>
                  ),
                },
                {
                  headerName: 'Actions',
                  cellRenderer: (params) => (
                    <Box display="flex" justifyContent="left">
                      <Tooltip label="View Team Details" placement="top">
                        <button
                          className="icon-button"
                          onClick={() => handleTeamClick(params.data)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </Tooltip>
                      <Tooltip label="Edit Team" placement="top">
                        <button
                          className="icon-button"
                          // disabled={!canEdit}
                          onClick={() => handleEditUser(params.data)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </Tooltip>
                      <Tooltip label="Delete Team" placement="top">
                        <button
                          className="icon-button"
                          // disabled={!canDelete}
                          onClick={() => handleDeleteUser(params.data.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </Tooltip>
                    </Box>
                  ),
                },
              ]}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
          {/* Delete Team Modal */}
          <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>Are you sure you want to delete this team?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="red.500"
                  color="white"
                  _hover={{ bg: 'red.700' }}
                  onClick={handleDeleteProject}
                >
                  Confirm Delete
                </Button>
                <Button colorScheme="gray" onClick={onDeleteModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Add Team Modal */}
          <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl position="relative" mb={4}>
                  <FormLabel
                    position="absolute"
                    top={newTeam.team ? '-10px' : '5px'}
                    left="10px"
                    fontSize={newTeam.team ? '12px' : 'sm'}
                    color={newTeam.team ? 'gray.500' : 'gray.500'}
                    pointerEvents="none"
                    transition="all 0.2s ease"
                    zIndex={1}
                    bg="white"
                  >
                    Team Name
                  </FormLabel>
                  <InputGroup>
                    <Input
                      value={newTeam.team}
                      onChange={(e) =>
                        setNewTeam({ ...newTeam, team: e.target.value })
                      }
                      size="sm"
                      focusBorderColor="gray.500"
                      borderRadius="5px"
                      zIndex={2}
                    />
                  </InputGroup>
                </FormControl>
                <Select
                  placeholder="Select Manager"
                  mb={4}
                  focusBorderColor="gray.500"
                  value={newTeam.manager}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, manager: e.target.value })
                  }
                >
                  <option value="Development">Sridhar Seshan</option>
                  <option value="Design">Selvakumaran V</option>
                  <option value="Marketing">Balasubramaniyan R</option>
                  <option value="Marketing">Antony Janiva A</option>
                  <option value="Marketing">Chandramohan T S</option>
                  <option value="Marketing">Balasubramaniyan R</option>
                </Select>
                <Select
                  placeholder="Select Project"
                  mb={4}
                  focusBorderColor="gray.500"
                  value={newTeam.project}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, project: e.target.value })
                  }
                >
                  <option value="Development">Sage300</option>
                  <option value="Design">Yellowstone</option>
                  <option value="Marketing">Rubicube</option>
                  <option value="Marketing">Silver Greeks</option>
                  <option value="Marketing">Sage HRMS</option>
                </Select>
                <Select
                  placeholder="Select Department"
                  mb={4}
                  focusBorderColor="gray.500"
                  value={newTeam.department}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, department: e.target.value })
                  }
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </Select>
                <Select
                  mb={4}
                  value={newTeam.status}
                  focusBorderColor="gray.500"
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleAddTeam}>
                  Add Team
                </Button>
                <Button colorScheme="gray" onClick={onAddModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Edit Project Modal */}
          <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Manager Name"
                  focusBorderColor="gray.500"
                  value={teamToEdit?.manager}
                  onChange={(e) =>
                    setTeamToEdit({ ...teamToEdit, manager: e.target.value })
                  }
                  mb={3}
                />
                <Input
                  placeholder="Project Name"
                  focusBorderColor="gray.500"
                  mb={3}
                  value={teamToEdit?.project}
                  onChange={(e) =>
                    setTeamToEdit({ ...teamToEdit, project: e.target.value })
                  }
                />
                <Input
                  placeholder="Team Name"
                  focusBorderColor="gray.500"
                  value={teamToEdit?.team}
                  onChange={(e) =>
                    setTeamToEdit({ ...teamToEdit, team: e.target.value })
                  }
                  mb={3}
                />
                <Select
                  placeholder="Select Department"
                  focusBorderColor="gray.500"
                  value={teamToEdit?.department}
                  onChange={(e) =>
                    setTeamToEdit({ ...teamToEdit, department: e.target.value })
                  }
                  mb={3}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </Select>
                <Select
                  placeholder="Select Status"
                  focusBorderColor="gray.500"
                  value={teamToEdit?.status}
                  onChange={(e) =>
                    setTeamToEdit({ ...teamToEdit, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleEditSave}>
                  Save Changes
                </Button>
                <Button colorScheme="gray" onClick={onEditModalClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
      {activeView === 'TeamMembers' && (
        <TeamMembers team={selectedTeam} onBack={handleBackToManagement} />
      )}
    </div>
  );
};

export default TeamManagement;
