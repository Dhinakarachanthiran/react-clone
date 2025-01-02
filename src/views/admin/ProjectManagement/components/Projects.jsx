import React, { useState,useEffect } from 'react';
import './Project.css';
// import menuConficJson from 'menuConfig.json';

import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Tag,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Text,
  InputGroup,
  FormControl,
  FormLabel,
  HStack,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Editproject from './Editproject';
import { FaUsers } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Projects = () => {
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isViewModalOpen,
    onOpen: onViewmodalOpen,
    onClose: onViewModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const toast = useToast();

  const [activeView, setActiveView] = useState('Projects');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      department: 'Design',
      status: 'Future',
      progress: 0,
    },
    {
      id: 2,
      name: 'Marketing Campaign',
      department: 'Marketing',
      status: 'Future',
      progress: 0,
    },
    {
      id: 3,
      name: 'Sage',
      department: 'Marketing',
      status: 'To Do',
      progress: 0,
    },
    {
      id: 4,
      name: 'Management',
      department: 'Design',
      status: 'In Process',
      progress: 88,
    },
    {
      id: 5,
      name: 'Campaign',
      department: 'Marketing',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 6,
      name: 'Quality',
      department: 'Marketing',
      status: 'In Process',
      progress: 56,
    },
    {
      id: 7,
      name: 'Sage300',
      department: 'Design',
      status: 'In Process',
      progress: 90,
    },
    {
      id: 8,
      name: 'yellow stone',
      department: 'Marketing',
      status: 'In Process',
      progress: 56,
    },
  ]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    department: '',
    status: 'Future',
    progress: 0,
    startDate: '',
    dueDate: '',
  });

  const clientsData = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' },
  ];

  const projectData = {
    projectName: 'Sage 300',
    teamName1: 'Mavericks',
    teamName: 'CodeMates',
    tasks: [
      { task: 'UI/UX Design', status: 'InProgress', progress: 80 },
      { task: 'Analysis', status: 'InProgress', progress: 10 },
      { task: 'Rithika', status: 'Developer', progress: '70' },
      { task: 'QA 1', status: 'Done', progress: 'Done' },
      { task: 'QA 2', status: 'QA', progress: '90' },
      { task: 'QA 1', status: 'QA', progress: '80' },
      { task: 'QA 1', status: 'QA', progress: 'Done' },
      { task: 'QA 1', status: 'QA', progress: '33' },
      { task: 'QA 1', status: 'QA', progress: '63' },
      { task: 'QA 2', status: 'QA', progress: '56' },
    ],
  };

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

  // const screenId = menuConficJson.find((screen) => screen.name === 'Project Management')?.screenId;
  // const currentAccess = accessRights?.[screenId] || {};
  
  // const hasFullAccess = currentAccess?.fullAccess === 1;
  // const canAdd = hasFullAccess;
  // const canEdit = hasFullAccess;
  // const canDelete = hasFullAccess;

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((project) =>
      selectedFilter ? project.status === selectedFilter : true,
    )
    .filter((project) =>
      selectedDepartment ? project.department === selectedDepartment : true,
    );

  const handleAddProject = () => {
    if (!newProject.name) {
      toast({
        title: 'Please provide the project name',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    if (!newProject.startDate) {
      toast({
        title: 'Please provide the start date',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    setProjects([{ id: projects.length + 1, ...newProject }, ...projects]);
    toast({
      title: 'Project Added',
      description: `Project ${newProject.name} has been added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-end',
    });
    setNewProject({ name: '', department: '', status: '', progress: 0 });
    onAddModalClose();
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter((proj) => proj.id !== selectedProject.id));
    toast({
      title: 'Project Deleted',
      description: `${selectedProject?.name} has been removed successfully.`,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-end',
    });
    onDeleteModalClose();
  };

  const handleFilterChange = (e) => setSelectedFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDepartmentChange = (e) => setSelectedDepartment(e.target.value);

  const handleEditViewDetails = (project) => {
    setSelectedProject(project);
    setActiveView('Editproject');
  };

  const handleBackToManagement = () => {
    setActiveView('Projects');
  };

  const alreadySelectedTeams = ['Gladiators', 'Warriors'];
  //team names
  const managerTeams = {
    Sridhar: ['Mavericks', 'Spartans', 'Gladiators'],
    Selva: ['Titans', 'Warriors', 'Eagles'],
    Bala: ['Panthers', 'Wolves', 'Lions'],
  };
  const styles = {
    container: {
      padding: '20px',
    },
    button: {
      marginRight: '7px',
      borderRadius: '5px',
      padding: '5px 10px',
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontSize: '16px',
      border: '1px solid #dee2e6',
      cursor: 'pointer',
    },
    projectHeader: {
      textAlign: 'left',
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    teamSection: {
      marginBottom: '20px',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    teamTitle: {
      fontWeight: 'bold',
      marginRight: '10px',
    },
    teamNameContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f9fafc',
      padding: '5px 10px',
      borderRadius: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    avatar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d9e8ff',
      color: '#3578e5',
      fontSize: '14px',
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      marginRight: '8px',
    },
    teamName: {
      color: '#333',
      fontWeight: 500,
    }
  };
  const columns = [
    { headerName: 'Project Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'Department',
      field: 'department',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ({ value }) => (
        <Tag
          className="Badge-lables"
          colorScheme={
            {
              Future: 'yellow',
              'To Do': 'red',
              'In Process': 'blue',
              Completed: 'green',
            }[value]
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      headerName: 'Progress',
      field: 'progress',
      cellRenderer: ({ value }) => {
        const progressColor =
          value === 0 ? '#d3d3d3' : value === 100 ? 'green' : '#3965FF';
        return (
          <Tooltip label={`Progress: ${value}%`}>
            <div
              style={{
                margin: '15px 0px 5px 0px',
                position: 'relative',
                width: '100%',
                height: '4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${value}%`,
                  height: '100%',
                  backgroundColor: progressColor,
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <Box display="flex" justifyContent="left">
          <Tooltip label="View Team Details" placement="top">
            <button className="icon-button" onClick={onViewmodalOpen}>
              <i className="fas fa-eye"></i>
            </button>
          </Tooltip>
          <Tooltip label="Edit Team" placement="top">
            <button
              className="icon-button"
              // disabled={!canEdit}
              onClick={() => handleEditViewDetails(params.data)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </Tooltip>
          <Tooltip label="Delete Team" placement="top">
            <button
              className="icon-button"
              // disabled={!canDelete}
              onClick={() => {
                setSelectedProject(params.data);
                onDeleteModalOpen();
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div>
      {activeView === 'Projects' && (
        <Box p={8} bg="white" minH="94vh">
          <Heading mb={5} padding="10px" marginTop="-3.5">
            Project Management
          </Heading>
          <Box display="flex" gap={4} mb={6}>
            <Select
              placeholder="All Departments"
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
              onChange={handleDepartmentChange}
            >
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Select
              placeholder="All Status"
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
              onChange={handleFilterChange}
            >
              <option value="Future">Future</option>
              <option value="To Do">To Do</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </Select>
            <Input
              placeholder="🔍 Search projects..."
              bg="white"
              size="sm"
              width="170px"
              variant="outline"
              borderColor="gray.300"
              focusBorderColor="blue.500"
              borderRadius="md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="6px 12px"
              _hover={{ bg: 'gray.200' }}
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              // disabled={!canAdd}
              onClick={onAddModalOpen}
            >
              Add Project
            </Button>
          </Box>
          {/* Ag Grid */}
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: '100%' }}
          >
            <AgGridReact
              rowData={filteredProjects}
              columnDefs={columns}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Box>
      )}
      {activeView === 'Editproject' && selectedProject && (
        <Editproject
          project={selectedProject}
          onBack={handleBackToManagement}
        />
      )}
      {/* Add Project Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4} maxWidth="500px">
          <ModalHeader textAlign="left" fontSize="2xl" fontWeight="bold">
            {' '}
            Create Project{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl position="relative" maxWidth="250px" mb={5}>
              <FormLabel
                position="absolute"
                top={newProject.name ? '-10px' : '5px'}
                left="10px"
                fontSize={newProject.name ? '12px' : 'sm'}
                color="gray.500"
                pointerEvents="none"
                transition="all 0.2s ease"
                zIndex={1}
                bg="white"
              >
                Project Name
                <span style={{ color: 'red', fontSize: '14px' }}> * </span>
              </FormLabel>
              <InputGroup>
                <Input
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  size="sm"
                  borderRadius="5px"
                  focusBorderColor="gray.500"
                  zIndex={2}
                />
              </InputGroup>
            </FormControl>
            {/* Client and Category in One Line */}
            <Flex mb={5} gap={4}>
              <Select
                placeholder="Select Client"
                value={newProject.client}
                onChange={(e) =>
                  setNewProject({ ...newProject, client: e.target.value })
                }
                width="44%"
                size="sm"
                focusBorderColor="gray.500"
                borderRadius="5px"
              >
                {clientsData.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Category"
                value={newProject.category}
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
                focusBorderColor="gray.500"
                width="44%"
                size="sm"
                borderRadius="5px"
              >
                <option value="Work">Work</option>
                {/* Add more category options */}
              </Select>
            </Flex>
            {/* Dates */}
            <HStack alignItems="flex-start" mb={5}>
              <FormControl position="relative" maxWidth="200px">
                <FormLabel
                  position="absolute"
                  top={newProject.startDate ? '-10px' : '5px'}
                  left="10px"
                  fontSize={newProject.startDate ? '12px' : 'sm'}
                  color="gray.500"
                  pointerEvents="none"
                  transition="all 0.2s ease"
                  zIndex={1}
                  bg="white"
                >
                  Start Date{' '}
                  <span style={{ color: 'red', fontSize: '14px' }}> * </span>
                </FormLabel>
                {/* <InputGroup> */}
                <DatePicker
                  selected={newProject.startDate}
                  onChange={(date) =>
                    setNewProject({ ...newProject, startDate: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="react-datepicker-input"
                  customInput={
                    <Input
                      width="100%"
                      focusBorderColor="gray.200"
                      size="sm"
                      borderRadius="5px"
                    />
                  }
                />
                {/* </InputGroup> */}
              </FormControl>
              {/* Due Date Field */}
              <FormControl position="relative" maxWidth="200px">
                <FormLabel
                  position="absolute"
                  top={newProject.dueDate ? '-10px' : '5px'}
                  left="10px"
                  fontSize={newProject.dueDate ? '12px' : 'sm'}
                  color="gray.500"
                  pointerEvents="none"
                  transition="all 0.2s ease"
                  zIndex={1}
                  bg="white"
                >
                  Due Date
                </FormLabel>
                <DatePicker
                  selected={newProject.dueDate}
                  onChange={(date) =>
                    setNewProject({ ...newProject, dueDate: date })
                  }
                  dateFormat="dd-MM-yyyy"
                  className="react-datepicker-input"
                  customInput={
                    <Input
                      width="100%"
                      focusBorderColor="gray.200"
                      size="sm"
                      borderRadius="5px"
                    />
                  }
                />
              </FormControl>
            </HStack>
            {/* Department and Status in One Line */}
            <Flex mb={5} gap={4}>
              <Select
                placeholder="Select Department"
                value={newProject.department}
                onChange={(e) =>
                  setNewProject({ ...newProject, department: e.target.value })
                }
                width="100%"
                maxWidth="350px"
                size="sm"
                focusBorderColor="gray.500"
                borderRadius="5px"
              >
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                {/* Add more departments as needed */}
              </Select>
            </Flex>
            <Select
              placeholder="Select Project Manager"
              value={newProject.manager}
              onChange={(e) => {
                const selectedManager = e.target.value;
                const teams = managerTeams[selectedManager] || [];
                setNewProject({
                  ...newProject,
                  manager: selectedManager,
                  selectedTeams: [],
                  availableTeams: teams,
                });
              }}
              mb={3}
              width="100%"
              maxWidth="350px"
              focusBorderColor="gray.500"
              borderRadius="5px"
              size="sm"
            >
              {Object.keys(managerTeams).map((manager) => (
                <option key={manager} value={manager}>
                  {manager}
                </option>
              ))}
            </Select>
            {/* Only show Teams after selecting a Manager */}
            {newProject.manager &&
              newProject.availableTeams &&
              newProject.availableTeams.length > 0 && (
                <>
                  <Text fontSize="md" fontWeight="bold" mb={2}>
                    Teams:
                  </Text>
                  <SimpleGrid columns={[2, 3]} spacing={4} mb={3}>
                    {newProject.availableTeams.map((team) => {
                      const isTeamSelected =
                        newProject.selectedTeams.includes(team);
                      const isTeamAssigned =
                        newProject.assignedTeams &&
                        newProject.assignedTeams.includes(team); // Check if the team is assigned already

                      return (
                        <Box
                          key={team}
                          p={3}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={
                            isTeamSelected
                              ? 'green.400'
                              : isTeamAssigned
                                ? 'gray.400'
                                : 'gray.300'
                          } // Use a different color for assigned teams
                          bg={
                            isTeamSelected
                              ? 'green.50'
                              : isTeamAssigned
                                ? 'gray.100'
                                : 'white'
                          } // Light gray background for assigned teams
                          _hover={{
                            borderColor: isTeamAssigned
                              ? 'gray.400'
                              : 'teal.500',
                            cursor: isTeamAssigned ? 'not-allowed' : 'pointer',
                          }} // Disable hover for assigned teams
                          onClick={() => {
                            if (isTeamAssigned) return; // Prevent selecting already assigned teams

                            const updatedTeams = isTeamSelected
                              ? newProject.selectedTeams.filter(
                                  (t) => t !== team,
                                )
                              : [...newProject.selectedTeams, team];
                            setNewProject({
                              ...newProject,
                              selectedTeams: updatedTeams,
                            });
                          }}
                        >
                          {isTeamSelected ? (
                            <Tooltip
                              label="This team is already selected"
                              aria-label="Team already selected"
                            >
                              <div>
                                <Flex justify="start" align="center">
                                  <FaUsers
                                    style={{
                                      marginRight: '5px',
                                      color: 'gray',
                                    }}
                                  />
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {team}
                                  </Text>
                                </Flex>
                              </div>
                            </Tooltip>
                          ) : isTeamAssigned ? (
                            <Tooltip
                              label="This team is already assigned"
                              aria-label="Team already assigned"
                            >
                              <div>
                                <Flex justify="start" align="center">
                                  <FaUsers
                                    style={{
                                      marginRight: '5px',
                                      color: 'gray',
                                    }}
                                  />
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {team}
                                  </Text>
                                </Flex>
                              </div>
                            </Tooltip>
                          ) : (
                            <Flex justify="start" align="center">
                              <FaUsers
                                style={{ marginRight: '5px', color: 'gray' }}
                              />
                              <Text fontSize="sm" fontWeight="semibold">
                                {team}
                              </Text>
                            </Flex>
                          )}
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </>
              )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAddProject} colorScheme="blue" size="md">
              Add project
            </Button>
            <Button onClick={onAddModalClose} ml={3} variant="ghost" size="md">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Model */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose}>
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4} maxWidth="700px" height="550px">
          <ModalHeader
            textAlign="left"
            fontSize="20px"
            fontWeight="bold"
            borderBottom="1px solid #e1e4e8"
          >
            Project Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={styles.projectHeader}>
              <h1>Project Name : {projectData.projectName}</h1>
            </div>

            <div style={styles.teamSection}>
              <span style={styles.teamTitle}>Team Names :</span>
              <div style={styles.teamNameContainer}>
                <div style={styles.avatar}>
                  <i className="fas fa-user"></i>
                </div>
                <span style={styles.teamName}>{projectData.teamName1}</span>
              </div>
              <div style={styles.teamNameContainer}>
                <div style={styles.avatar}>
                  <i className="fas fa-user"></i>
                </div>
                <span style={styles.teamName}>{projectData.teamName}</span>
              </div>
            </div>
              <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                <AgGridReact
                  rowData={projectData.tasks}
                  columnDefs={[
                    { headerName: 'Task', field: 'task', sortable: true, filter: true },
                    { headerName: 'Status', field: 'status', sortable: true, filter: true },
                    {
                      headerName: 'Progress',
                      field: 'progress',
                      cellRenderer: ({ value }) => {
                        const progress = value === 'Done' ? 100 : parseInt(value, 10) || 0;
                        const progressColor = progress === 100 ? 'green' : '#3965FF';
                        return (
                          <Tooltip label={`Progress: ${progress}%`} aria-label="Progress Tooltip">
                            <div
                              style={{
                                margin: '15px 0px 5px 0px',
                                position: 'relative',
                                width: '100%',
                                height: '4px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '2px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${progress}%`,
                                  height: '100%',
                                  backgroundColor: progressColor,
                                  transition: 'width 0.3s ease',
                                }}
                              ></div>
                            </div>
                          </Tooltip>
                        );
                      },
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
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to delete {selectedProject?.name}?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDeleteProject} colorScheme="red">
              Delete
            </Button>
            <Button onClick={onDeleteModalClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Projects;
