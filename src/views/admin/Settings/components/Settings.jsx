import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Heading, VStack, Tab, TabList, TabPanel, TabPanels,
  Tabs, useToast, useDisclosure, Input, FormLabel, Tooltip, Table, Tbody,
  Td, Th, Thead, Tr, Select, Switch, AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader,AlertDialogContent,AlertDialogOverlay,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import { MdGroups } from 'react-icons/md';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Settings.css';

import { fetchClients,
  fetchRoles,
  fetchAccessRights,
  saveAccessRights,
  fetchDepartments,
  fetchCategories,
  addClient,
  addDepartment,
  addCategories,
  addRole} from 'utils/api';

export default function SettingsScreen() {

  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  // client
  const [clientList, setClientList] = useState([]);
  const [clientData, setClientData] = useState({
    clientName: '',
    clientLocation: '',
  });
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  // Fetch client data from API
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const data = await fetchClients();
        setClientList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch clients.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position:'top-end',
        });
      }
    };

    fetchClientData();
  }, []);

    // Handle Add Client
    const handleAddClient = async () => {
      if (!clientData.clientName || !clientData.clientLocation) {
        toast({
          title: "Validation Error",
          description: "All fields are required.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
        return;
      }
   
      try {
        await addClient(clientData);
        const UpdatedClientList = await fetchClients();
        setClientList(UpdatedClientList);
        toast({
          title: "Client Added",
          description: "The client has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
        setClientData({ clientName:" ", clientLocation:" " });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add client.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };

  const handleDeleteClient = () => {
    if (selectedClientIndex !== null) {
      const updatedList = clientList.filter(
        (_, i) => i !== selectedClientIndex,
      );
      setClientList(updatedList);
      toast({
        title: 'Client Deleted',
        description: 'The client has been successfully deleted.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setSelectedClientIndex(null);
    }
    onClose();
  };

  const handleDeleteButtonClick = (index) => {
    setSelectedClientIndex(index);
    onOpen();
  };


  //department
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentData, setDepartmentData] = useState({
    departmentName: '',
    departmentDescription: '',
  });
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(null);
  // Fetch departments data from the API
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      try {
        const data = await fetchDepartments();
        setDepartmentList(data);
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error.message || 'There was an error fetching department data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
 
    fetchDepartmentsData();
  }, []);
  
  const handleAddDepartment = async() =>{
    if(!departmentData.departmentName || !departmentData.departmentDescription){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addDepartment(departmentData);
      const UpdatedDepartmentList = await fetchDepartments();
      setDepartmentList(UpdatedDepartmentList);
      toast({
        title: "Client Added",
        description: "The client has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ departmentName:" ", departmentDescription:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
  
  const confirmDeleteDepartment = (index) => {
    setSelectedDepartmentIndex(index);
    onOpen();
  };

  const handleDeleteDepartment = () => {
    const updatedList = departmentList.filter(
      (_, i) => i !== selectedDepartmentIndex,
    );
    const deletedDepartment = departmentList[selectedDepartmentIndex];
    setDepartmentList(updatedList);
    onClose();
    toast({
      title: 'Department Deleted',
      description: `Department "${deletedDepartment.name}" has been deleted successfully.`,
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position:'top-end',
    });
  };

  //category
  const [categoryList, setCategoryList] = useState([]);
  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    categoryDescription: '',
  });

   // Fetch categories data from the API
   useEffect(() => {
    const fetchCategorieData = async () => {
      try {
        const data = await fetchCategories();
        setCategoryList(data);
      } catch (error) {
        toast({
          title: 'Error fetching categories',
          description: 'There was an error fetching category data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-end',
        });
      }
    };
    fetchCategorieData();
  }, []);
  
  const handleAddCategory = async() =>{
    if(!categoryData.categoryName || !categoryData.categoryDescription){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addCategories(categoryData);
      const UpdatedCategoryList = await fetchCategories();
      setCategoryList(UpdatedCategoryList);
      toast({
        title: "Client Added",
        description: "The client has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ categoryName:" ", categoryDescription:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };

  const handleDeleteCategory = (index) => {
    setCategoryList(categoryList.filter((_, i) => i !== index));
  };


  //role
  const [roleList, setRoleList] = useState([]);
  const [roleData, setRoleData] = useState({
    roleTitle: '',
    rolePermissions: '',
  });

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const data = await fetchRoles();
        setRoleList(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch roles.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position:'top-end',
        });
      }
    };

    fetchRoleData();
  }, []);

  const handleAddRole = async() =>{
    if(!roleData.roleTitle || !roleData.rolePermissions){
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      return;
    }
    try {
      await addRole(roleData);
      const UpdatedRoleList = await fetchRoles();
      setRoleList(UpdatedRoleList);
      toast({
        title: "Client Added",
        description: "The client has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
      setDepartmentData({ roleTitle:" ", rolePermissions:" " });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: 'top-end',
      });
    }
  };
  const handleDeleteRole = (index) => {
    setRoleList(roleList.filter((_, i) => i !== index));
  };

  //access rights
  const [role, setRole] = useState(null);
  const [accessData, setAccessData] = useState([
    {
      screenName: 'Dashboard',
      screenId: 101,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Timesheet',
      screenId: 102,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Project Managment',
      screenId: 103,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'User Managment',
      screenId: 104,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Team Management',
      screenId: 105,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Task Managment',
      screenId: 106,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
    {
      screenName: 'Settings',
      screenId: 107,
      hideShow: false,
      fullAccess: false,
      readOnly: false,
    },
  ]);

  // Fetch Access Data from API
  useEffect(() => {
    const fetchAccess = async () => {
      if (role) {
        try {
          const data = await fetchAccessRights(role);
          setAccessData(data);
          console.log(fetchAccessRights);
        } catch (error) {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch access rights.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position:'top-end',
          });
        }
      }
    };

    fetchAccess();
  }, [role]);

  const payload = {
    role: role,
    accessData: accessData.map((item) => {
      return {
        screenName: item.screenName,
        screenId: item.screenId,
        hideShow: item.hideShow,
        fullAccess: item.fullAccess,
        readOnly: item.readOnly,
      };
    }),
  };

  console.log('Sending payload:', payload);

  const handleSaveAccessRights = async () => {
    const payload = {
      role,
      accessData :accessData.map((item) => ({
        screenName: item.screenName,
        screenId: item.screenId ? item.screenId.toString() : null,
        hideShow: item.hideShow,
        fullAccess: item.fullAccess,
        readOnly: item.readOnly,
      })),
    };

    try {
      await saveAccessRights(payload);
      toast({
        title: "Access Rights Saved",
        description: "Access rights saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position:'top-end',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save access rights.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position:'top-end',
      });
    }
  };

  // Handle Toggle Change for Switches
  const handleToggleChange = (index, field, value) => {
    const updatedData = [...accessData];
    updatedData[index][field] = value;
    setAccessData(updatedData);
  };

  return (
    <Box p={8} bg="white" minH="94vh" minW="100vh">
      <Heading mb={5} padding="10px" marginTop="-3.5">
        Settings
      </Heading>

      <Tabs variant="line" colorScheme="gray" mt={4} px={6}>
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Client
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Department
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Category
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Roles
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Access Rights
          </Tab>
        </TabList>

        <TabPanels>
          {/* Client Tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* ID Input */}
                    <Box>
                      {/* <FormLabel htmlFor="client-id">ID</FormLabel>
                      <Input
                        id="client-id"
                        placeholder="Enter client ID"
                        size="sm"
                        value={clientData.clientId}
                        isReadOnly
                      /> */}
                    </Box>

                    {/* Name Input */}
                    <Box>
                      <FormLabel htmlFor="client-name">Name</FormLabel>
                      <Input
                        id="client-name"
                        placeholder="Enter client name"
                        size="sm"
                        value={clientData.clientName}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            clientName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Location Input */}
                    <Box>
                      <FormLabel htmlFor="client-location">Location</FormLabel>
                      <Input
                        id="client-location"
                        placeholder="Enter client location"
                        size="sm"
                        value={clientData.clientLocation}
                        onChange={(e) =>
                          setClientData({
                            ...clientData,
                            clientLocation: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-client-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-client-id"
                        placeholder="🔍 Search "
                        size="sm"
                        // width="-moz-min-content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Client Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddClient}
                      >
                        Add Client
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? clientList.filter((client) =>
                          client.id.includes(searchQuery),
                        )
                      : clientList
                  }
                  columnDefs={[
                    {
                      headerName: 'Client Id',
                      field: 'clientId',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Client Name',
                      field: 'clientName',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Client Location',
                      field: 'clientLocation',
                      filter: true,
                      sortable: true,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Team" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                handleDeleteButtonClick(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                              }}
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
                  paginationPageSize={7}
                />
              </div>
            </VStack>

            {/* Confirmation Dialog */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Client
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to delete this client?
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleDeleteClient}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </TabPanel>

          {/* Department tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* Department ID */}
                    <Box>
                      {/* <FormLabel htmlFor="department-id">ID</FormLabel> */}
                      {/* <Input
                        id="department-id"
                        placeholder="Enter client ID"
                        size="sm"
                        value={departmentData.id}
                        isReadOnly
                      /> */}
                    </Box>

                    {/* Department Input */}
                    <Box>
                      <FormLabel htmlFor="department-name">Name</FormLabel>
                      <Input
                        id="department-name"
                        placeholder="Enter Department name"
                        size="sm"
                        value={departmentData.departmentName}
                        onChange={(e) =>
                          setDepartmentData({
                            ...departmentData,
                            departmentName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* description Input */}
                    <Box>
                      <FormLabel htmlFor="department-description">
                        Description
                      </FormLabel>
                      <Input
                        id="department-description"
                        placeholder="Enter description"
                        size="sm"
                        value={departmentData.departmentDescription}
                        onChange={(e) =>
                          setDepartmentData({
                            ...departmentData,
                            departmentDescription: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-client-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-client-id"
                        placeholder="🔍 Search "
                        size="sm"
                        // width="-moz-min-content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Client Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddDepartment}
                      >
                        Add Department
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? departmentList.filter((departmentData) =>
                          departmentData.id.includes(searchQuery),
                        )
                      : departmentList
                  }
                  columnDefs={[
                    {
                      headerName: 'Department ID',
                      field: 'departmentId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Department Name',
                      field: 'departmentName',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Description',
                      field: 'departmentDescription',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="left">
                          <Tooltip label="Delete Department" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                confirmDeleteDepartment(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                alignItems: 'flex-start',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ color: 'black' }}
                              ></i>
                            </button>
                          </Tooltip>
                        </Box>
                      ),
                      resizable: true,
                      flex: 1,
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  pagination={true}
                  paginationPageSize={7}
                />
              </div>
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>Delete Department</AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to delete this department? This
                      action cannot be undone.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={handleDeleteDepartment}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </VStack>
          </TabPanel>

          {/* Category Tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* ID Input */}
                    <Box>
                      {/* <FormLabel htmlFor="category-id">ID</FormLabel>
                      <Input
                        id="client-id"
                        placeholder="Enter client ID"
                        size="sm"
                        value={categoryData.id}
                        isReadOnly
                      /> */}
                    </Box>

                    {/* Name Input */}
                    <Box marginRight="10px">
                      <FormLabel htmlFor="category-name">Category</FormLabel>
                      <Input
                        id="category-name"
                        placeholder="Enter Category name"
                        size="sm"
                        value={categoryData.categoryName}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            categoryName: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* description Input */}
                    <Box>
                      <FormLabel htmlFor="category-description">
                        Description
                      </FormLabel>
                      <Input
                        id="category-description"
                        placeholder="description"
                        size="sm"
                        value={categoryData.categoryDescription}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            categoryDescription: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-client-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-client-id"
                        placeholder="🔍 Search "
                        size="sm"
                        // width="-moz-min-content"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Client Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddCategory}
                      >
                        Add Category
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? categoryList.filter((categoryData) =>
                          categoryData.id.includes(searchQuery),
                        )
                      : categoryList
                  }
                  columnDefs={[
                    {
                      headerName: 'Category ID',
                      field: 'categoryId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Category Name',
                      field: 'categoryName',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Description',
                      field: 'categoryDescription',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Category" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                handleDeleteCategory(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ color: 'black' }}
                              ></i>
                            </button>
                          </Tooltip>
                        </Box>
                      ),
                      resizable: true,
                      flex: 1,
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  pagination={true}
                  paginationPageSize={7}
                />
              </div>
            </VStack>
          </TabPanel>

          {/* Role Tab */}
          <TabPanel>
            <VStack spacing={5} align="stretch">
              <div>
                <div>
                  <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                    {/* ID Input */}
                    <Box>
                      {/* <FormLabel htmlFor="role-id">ID</FormLabel>
                      <Input
                        id="role-id"
                        placeholder="Enter role ID"
                        size="sm"
                        value={roleData.id}
                        isReadOnly
                      /> */}
                    </Box>

                    {/* Role Input */}
                    <Box>
                      <FormLabel htmlFor="role-title">Role</FormLabel>
                      <Input
                        id="role-title"
                        placeholder="Enter role title"
                        size="sm"
                        value={roleData.roleTitle}
                        onChange={(e) =>
                          setRoleData({ ...roleData, roleTitle: e.target.value })
                        }
                      />
                    </Box>

                    {/* Permission Input */}
                    <Box>
                      <FormLabel htmlFor="role-permissions">
                        Permission
                      </FormLabel>
                      <Input
                        id="role-permissions"
                        placeholder="Enter permissions"
                        size="sm"
                        value={roleData.rolePermissions}
                        onChange={(e) =>
                          setRoleData({
                            ...roleData,
                            rolePermissions: e.target.value,
                          })
                        }
                      />
                    </Box>

                    {/* Search Input */}
                    <Box>
                      <FormLabel htmlFor="search-client-id">
                        Search by ID
                      </FormLabel>
                      <Input
                        id="search-client-id"
                        placeholder="🔍 Search"
                        size="sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </Box>

                    {/* Add Role Button */}
                    <Box alignSelf="flex-end">
                      <Button
                        leftIcon={
                          <MdGroups style={{ width: '20px', height: 'auto' }} />
                        }
                        colorScheme="black"
                        variant="outline"
                        fontSize="12px"
                        height="32px"
                        padding="6px 12px"
                        _hover={{ bg: 'gray.200' }}
                        onClick={handleAddRole}
                      >
                        Add Role
                      </Button>
                    </Box>
                  </Flex>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: 350, width: '100%' }}
              >
                <AgGridReact
                  rowData={
                    searchQuery
                      ? roleList.filter((roleDataData) =>
                          roleDataData.id.includes(searchQuery),
                        )
                      : roleList
                  }
                  columnDefs={[
                    {
                      headerName: 'Role ID',
                      field: 'roleId',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Role Title',
                      field: 'roleTitle',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Permissions',
                      field: 'rolePermissions',
                      filter: true,
                      sortable: true,
                      resizable: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Actions',
                      cellRenderer: (params) => (
                        <Box display="flex" justifyContent="center">
                          <Tooltip label="Delete Role" placement="top">
                            <button
                              className="icon-button"
                              onClick={() =>
                                handleDeleteRole(params.node.rowIndex)
                              }
                              style={{
                                padding: '4px',
                                fontSize: '12px',
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ color: 'black' }}
                              ></i>
                            </button>
                          </Tooltip>
                        </Box>
                      ),
                      resizable: true,
                      flex: 1,
                    },
                  ]}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true,
                  }}
                  pagination={true}
                  paginationPageSize={7}
                />
              </div>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={5} align="stretch">
              <Flex align="center" wrap="wrap" gap={4} marginBottom="10px">
                {/* Role Selection */}
                <Box>
                  <FormLabel htmlFor="role-title">Role</FormLabel>
                  <Select
                    id="role-title"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    size="sm"
                  >
                    <option value="superadmin">SuperAdmin</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </Select>
                </Box>

                {/* Save Button */}
                <Box alignSelf="flex-end">
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    fontSize="12px"
                    height="32px"
                    padding="6px 12px"
                    onClick={handleSaveAccessRights}
                  >
                    Save
                  </Button>
                </Box>
              </Flex>

              {/* Access Rights Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Screen Name</Th>
                      <Th textAlign="center">Hide/Show</Th>
                      <Th textAlign="center">Full Access</Th>
                      <Th textAlign="center">Read</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {accessData.map((item, index) => (
                      <Tr key={index}>
                        <Td>{item.screenName}</Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.hideShow}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'hideShow',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.fullAccess}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'fullAccess',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                        <Td textAlign="center">
                          <Switch
                            isChecked={item.read}
                            onChange={(e) =>
                              handleToggleChange(
                                index,
                                'read',
                                e.target.checked,
                              )
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
