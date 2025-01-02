import React, { useState, useMemo, useEffect } from "react";
// import menuConficJson from 'menuConfig.json';
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tag,
  Tr,
  Th,
  Td,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Flex,
  Text,
  Badge,
  Stack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope,faFileExcel    } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import Userinfo from "./Userinfo";
import './Usermanagement.css';
import { useDisclosure } from "@chakra-ui/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import {FiSend} from "react-icons/fi";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Usermanagement = () => {
  const [activeView, setActiveView] = useState("Usermanagement"); 
  const [selectedTeam, setSelectedTeam] = useState(null); 
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const toast = useToast();
  const [filterStatus, setFilterStatus] = useState("All");
  const [resendingInvite, setResendingInvite] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: "Praveen", department: "Development", status: "Active", workingStatus: "On Site", dateOfJoining: "2022-11-22", teamName: "Unassigned" },
    { id: 2, name: "Nandhini", department: "Design", status: "Active", workingStatus: "On Site", dateOfJoining: "2022-11-22", teamName: "Mavericks" },
    { id: 3, name: "Rithika", department: "Marketing", status: "Inactive", workingStatus: "On Leave", dateOfJoining: "2022-11-22", teamName: "Mavericks" },
    { id: 4, name: "Ranjini", department: "Design", status: "Inactive", workingStatus: "On Leave", dateOfJoining: "2022-11-22", teamName: "Sage100" },
    { id: 5, name: "Dinakar", department: "Developer", status: "Inactive", workingStatus: "On Site", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 6, name: "Rajesh", department: "Development", status: "Active", workingStatus: "On Site", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 7, name: "Rajesh", department: "Development", status: "Active", workingStatus: "On Site", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 8, name: "Rajesh", department: "Development", status: "Active", workingStatus: "Remote", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 8, name: "Rajesh", department: "Development", status: "Active", workingStatus: "Remote", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 8, name: "Rajesh", department: "Development", status: "Active", workingStatus: "Remote", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 8, name: "Rajesh", department: "Development", status: "Active", workingStatus: "Remote", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
    { id: 8, name: "Rajesh", department: "Development", status: "Active", workingStatus: "Remote", dateOfJoining: "2022-11-22", teamName: " Mavericks" },
  ]);
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

  // const screenId = menuConficJson.find((screen) => screen.name === 'User Management')?.screenId;
  // const currentAccess = accessRights?.[screenId] || {};
  
  // const hasFullAccess = currentAccess?.fullAccess === 1;
  // const canAdd = hasFullAccess;
  // const canEdit = hasFullAccess;
  // const canDelete = hasFullAccess;
  
  const [columnDefs] = useState([
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'department', headerName: 'Department', sortable: true, filter: true },
    { field: 'teamName', headerName: 'Team Name', sortable: true },
    { field: 'workingStatus', headerName: 'Working Status', sortable: true },
    { field: 'dateOfJoining', headerName: 'Joining Date', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true,
      cellRenderer: (params) => {
        return params.value === "Active" 
          ? <Tag className="Badge-lables" colorScheme="green">{params.value}</Tag>
          : <Tag className="Badge-lables" colorScheme="red">{params.value}</Tag>
      }},
    { field: 'actions', headerName: 'Actions', width: 150,
      cellRenderer: (params) => (
        <div style={{ display: 'flex', gap: '5px' }}> 
          <Tooltip label="View User Details" placement="top">
            <button
              className="icon-button"
              onClick={() => handleViewDetails(params.data)}
            >
              <i className="fas fa-eye"></i>
            </button>
          </Tooltip>
          <Tooltip label="Edit User" placement="top">
            <button
              className="icon-button"
              // disabled={!canEdit}
              onClick={() => openModal("edit", params.data)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </Tooltip>
          <Tooltip label="Delete User" placement="top">
            <button
              className="icon-button"
              // disabled={!canDelete}
              onClick={() => openModal("delete", params.data)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Tooltip>
        </div>
      )
    }
],
);

  const [dateFilter, setDateFilter] = useState({
    type: "all", 
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear(), 
    startDate: "",
    endDate: "",
  });

  const [selectedRole, setSelectedRole] = useState("");

  const getFilteredInvitedUsers = () => {
    return invitedUsers.filter((user) => {
      // First apply status filter
      const matchesStatus = filterStatus === "All" || user.status === filterStatus;
      if (!matchesStatus) return false;
 
      const inviteDate = new Date(user.inviteDate);
 
      switch (dateFilter.type) {
        case "month":
          return (
            inviteDate.getMonth() + 1 === parseInt(dateFilter.month) &&
            inviteDate.getFullYear() === parseInt(dateFilter.year)
          );
        case "year":
          return inviteDate.getFullYear() === parseInt(dateFilter.year);
        case "custom":
          const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
          const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
         
          if (start && end) {
            return inviteDate >= start && inviteDate <= end;
          } else if (start) {
            return inviteDate >= start;
          } else if (end) {
            return inviteDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Generate array of years (e.g., last 5 years)
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
 
  // Generate array of months
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const handleResendInvite = async (email) => {
    setResendingInvite(email);
   
    // Simulate API call with setTimeout
    setTimeout(() => {
      toast({
        title: "Invite Resent",
        description: `Invitation has been resent to ${email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
      setResendingInvite(null);
    }, 1000);
  };
  const [inviteEmails, setInviteEmails] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
 
  const handleSendInvite = () => {
    // Single email invite logic
    if (inviteEmail) {
      if (!selectedRole) {
        toast({
          title: "Role Selection Required",
          description: "Please select a role before sending an invite.",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-end",
        });
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-end",
        });
        return;
      }
  
      setInvitedUsers((prevUsers) => [
        {
          email: inviteEmail,
          status: "Pending",
          inviteDate: new Date().toISOString().split("T")[0],
        },
        ...prevUsers,
      ]);
  
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteEmail} as ${selectedRole}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
  
      setInviteEmail("");
      setSelectedRole("");
      closeInviteModal();
      return;
    }
  
    // Multiple email invite logic
    if (inviteEmails.length > 0) {
      // Check if role is selected for bulk invite
      if (!selectedRole) {
        toast({
          title: "Role Selection Required",
          description: "Please select a role before sending invites.",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-end",
        });
        return;
      }
  
      // Add multiple invited users to the list
      setInvitedUsers((prevUsers) => [
        ...inviteEmails.map((item) => ({
          email: item.email,
          status: "Pending",
          inviteDate: new Date().toISOString().split("T")[0],
        })),
        ...prevUsers,
      ]);
  
      toast({
        title: "Invites Sent",
        description: `Invitations sent to all ${inviteEmails.length} emails with ${selectedRole} role`,
        status: "success",
        duration: 5000,
        position: "top-end",
        isClosable: true,
      });
  
      // Clear inviteEmails, importErrors, selectedRole, and close modal
      setInviteEmails([]);
      setImportErrors([]);
      setSelectedRole("");
      closeInviteModal();
      return;
    }
  
    toast({
      title: "No Emails",
      description: "Please enter an email address or import emails from Excel.",
      status: "warning",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
  };
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    search: "",
  });
 
  const handleViewDetails = (user) => {
    setSelectedTeam(user); // Set selected team details
    setActiveView("Userinfo"); // Switch to TeamMembers view
  };
 
  const handleBackToManagement = () => {
    setActiveView("Usermanagement"); // Switch back to TeamManagement view
  };

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
  });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
 
  const openInviteModal = () => {
    setInviteModalOpen(true);
  };
 
  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail("");
  };

  const [invitedUsers, setInvitedUsers] = useState([
    { email: "example1@example.com", status: "Pending", inviteDate: "2024-05-20" },
    { email: "example2@example.com", status: "Accepted", inviteDate: "2024-03-19" },
    { email: "example3@example.com", status: "Pending", inviteDate: "2024-02-20" },
    { email: "example4@example.com", status: "Accepted", inviteDate: "2024-11-19" },
    { email: "example5@example.com", status: "Pending", inviteDate: "2024-01-20" },
    { email: "example6@example.com", status: "Accepted", inviteDate: "2024-08-19" },
    { email: "example7@example.com", status: "Pending", inviteDate: "2024-12-20" },
  ]);
 
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    department: "",
    status: "Active",
    workingStatus: "",
    dateOfJoining: "",
  });
  const handleFileUpload = (event) => {
    
 
    const file = event.target.files[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
 
        const emails = data.flat().filter((email) => email); // Remove empty cells
        const validEmails = [];
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
        emails.forEach((email, index) => {
          if (emailRegex.test(email)) {
            validEmails.push({
              email: email,
              
            });
          } else {
            errors.push(`Row ${index + 1}: Invalid email format - ${email}`);
          }
        });
 
        setInviteEmails(validEmails);
        setImportErrors(errors);
 
        if (errors.length > 0) {
          toast({
            title: "Import Warning",
            description: `Found ${errors.length} invalid emails.`,
            status: "warning",
            duration: 5000,
            position: "top-end",
            isClosable: true,
          });
        } else {
          toast({
            title: "Import Successful",
            description: `Successfully imported ${validEmails.length} emails with ${selectedRole} role.`,
            status: "success",
            duration: 3000,
            position: "top-end",
            isClosable: true,
          });
        }
      } catch {
        toast({
          title: "Import Error",
          description: "Failed to process the Excel file.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
 
    reader.readAsBinaryString(file);
  };
 
  // Memoized filtered users
  const processedUsers = useMemo(() => {
    const filteredUsers = users.filter((user) => {
      const matchesDepartment = !filters.department || user.department === filters.department;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesSearch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.department.toLowerCase().includes(filters.search.toLowerCase());
      return matchesDepartment && matchesStatus && matchesSearch;
    });

    return { filteredUsers };
  }, [users, filters]);

  const openModal = (type, user = null) => {
    setModalState({ type, isOpen: true });
    if (user) {
      setSelectedUser({ ...user });
      if (type === 'edit') {
        setNewUser({ ...user });
      }
    }
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false });
    setSelectedUser(null);
    setNewUser({
      name: "",
      department: "",
      status: "Active",
      workingStatus: "",
      dateOfJoining: "",
    });
  };
 
  const handleAddUser = () => {
    if (!newUser.name || !newUser.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
 
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
      return;
    }
 
    const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const userToAdd = {
      ...newUser,
      id: newId,
      status: newUser.status || "Active",  
      workingStatus: newUser.workingStatus || "On Site",  
      dateOfJoining: newUser.dateOfJoining || new Date().toISOString().split('T')[0] , 
      teamName: "Unassigned", 
    };
    setUsers([userToAdd, ...users]);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-end",
    });
    closeModal();
  };
 
  // Function to get the workingStatus badge color
  const getWorkingStatusColor = (workingStatus) => {
    switch (workingStatus) {
      case "Remote":
        return "teal";
      case "On Site":
        return "green";
      case "On Leave":
        return "red";
      default:
        return "gray";
    }
  };
 
  const handleEditUser = () => {
    if (!newUser.name || !newUser.department) {
      toast({
        title: "Validation Error",
        description: "Name and Department are required",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-end",
      });
      return;
    }
 
    setUsers(users.map((u) =>
      u.id === newUser.id ? { ...newUser } : u
    ));
 
    toast({
      title: "User Updated",
      description: `${newUser.name}'s details have been updated`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-end",
    });
 
    closeModal();
  };
 
  const handleDeleteUser = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
 
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been removed`,
      status: "warning",
      duration: 3000,
      isClosable: true,
 
      position: "top-end",
    });
 
    closeModal();
  };
 
  return (
    <div id="user">
      {activeView === "Usermanagement" &&(
      <Box p={8} bg="White" minH="94vh">
        <Heading mb={5}  padding='10px' marginTop='-3.5'>User Management</Heading>
          {/* Filters */}
          <Flex mb={6} gap={4}>
            <Select
              placeholder="All Departments"
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
            >
              {["Development", "Design", "Marketing"].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
            <Select
              placeholder="All Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              bg="white"
              size="sm"
              width="150px"
              borderRadius="md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Input
              placeholder="🔍 Search Users..."
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                bg="white"
                size="sm"
                width="170px"
                variant="outline"
                borderColor="gray.300"
                focusBorderColor="blue.500"
                borderRadius="md"  // Medium rounded corners for a minimal look
              />
              <Button
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
                onClick={() => openModal('add')}
              >
              👤 Add User
              </Button>
              <Button
                colorScheme="black"
                variant="outline"
                top="-1px"
                fontSize="12px"
                height="32px"
                padding="6px 12px"
                _hover={{ bg: 'gray.200' }}
                display="flex"
                alignItems="center"
                leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
                onClick={openInviteModal}
              >
                Invite User
              </Button>
              <Button
                colorScheme="black"
                variant="outline"
                top="-1px"
                fontSize="12px"
                height="32px"
                padding="6px 12px"
                _hover={{ bg: 'gray.200' }}
                display="flex"
                alignItems="center"
                onClick={onOpen}  
              >
                Invite Status
              </Button>
          </Flex>
          {/* AG Grid */}
          <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
            <AgGridReact
              rowData={processedUsers.filteredUsers}
              columnDefs={columnDefs}
              defaultColDef={{
                resizable: true,
                width: 160, 
              }}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
          {/* Add Modal */}
          <Modal isOpen={modalState.type === 'add'}  closeOnOverlayClick={false} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent maxW="lg">
              <ModalHeader fontSize="lg" bg="gray.100" fontWeight="bold">
                Add User
              </ModalHeader>
              <ModalCloseButton color="black.700" />
              <ModalBody >
                <Stack spacing={4}>

                  {/* Name Field */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="medium">Name</FormLabel>
                    <Input
                      placeholder="Enter user name"
                      size="md"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    </FormControl>

                    {/* Email Field */}
                    <FormControl isRequired>
                        <FormLabel fontWeight="medium">Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          size="md"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </FormControl>

                    {/* Department Dropdown */}
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium">Department</FormLabel>
                      <Select
                        placeholder="Select department"
                        size="md"
                        value={newUser.department}
                        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      >
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                      </Select>
                    </FormControl>

                   
       
                    {/* Working Status Dropdown */}
                    <FormControl>
                      <FormLabel fontWeight="medium">Working Status</FormLabel>
                      <Select
                        placeholder="Select working status"
                        size="md"
                        value={newUser.workingStatus}
                        onChange={(e) => setNewUser({ ...newUser, workingStatus: e.target.value })}
                      >
                        <option value="Remote">Remote</option>
                        <option value="On Site">On Site</option>
                        <option value="On Leave">On Leave</option>
                      </Select>
                    </FormControl>
       
                    {/* Date of Joining Field */}
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium">Joining Date</FormLabel>
                      <Input
                        type="date"
                        size="md"
                        value={newUser.dateOfJoining}
                        onChange={(e) => setNewUser({ ...newUser, dateOfJoining: e.target.value })}
                      />
                    </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button size="md" colorScheme="blue" onClick={handleAddUser}>
                  Save
                </Button>
                <Button size="md" onClick={closeModal} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Edit Modal */}
          <Modal isOpen={modalState.type === 'edit'}  closeOnOverlayClick={false} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  mb={3}
                />
                <Select
                  placeholder="Department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  mb={3}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </Select>
                <Select
                  placeholder="Status"
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  mb={3}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <Select
                  placeholder="Working Status"
                  value={newUser.workingStatus}
                  onChange={(e) =>
                    setNewUser({ ...newUser, workingStatus: e.target.value })
                  }
                  mb={3}
                >
                  <option value="Remote">Remote</option>
                  <option value="On Site">On Site</option>
                  <option value="On Leave">On Leave</option>
                </Select>
                <Input
                  type="date"
                  isReadOnly
                  variant="filled"
                  value={newUser.dateOfJoining}
                
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleEditUser}>
                  Save
                </Button>
                <Button onClick={closeModal} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
 
          {/* Delete Modal */}
          <Modal isOpen={modalState.type === 'delete'}  closeOnOverlayClick={false} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={handleDeleteUser}>
                  Delete
                </Button>
                <Button onClick={closeModal} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        {/* Invite Modal */}
        <Modal isOpen={inviteModalOpen}  closeOnOverlayClick={false} onClose={closeInviteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invite New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <Select
                  placeholder=""
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  variant="filled"
                  iconColor="blue.500"
                >
                  <option value="" disabled>Select a Role</option>
                  <option value="admin">
                    Admin
                  </option>
                  <option value="manager">
                    Manager
                  </option>
                  <option value="User">
                      User  
                  </option>
                </Select>
                {selectedRole && (
                  <Box
                    bg="blue.50"
                    p={3}
                    borderRadius="md"
                    mt={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Text fontWeight="medium" mr={2}>
                      {selectedRole === 'admin' && '🔑 Admin Role:'}
                      {selectedRole === 'manager' && '👥 Manager Role:'}
                      {selectedRole === 'User' && '👤  User Role:'}
                    </Text>
                    <Text>
                      {selectedRole === 'admin' && 'Complete system control, can manage users, settings, and all permissions.'}
                      {selectedRole === 'manager' && 'Can oversee team, manage projects, but with limited system-wide access.'}
                      {selectedRole === 'User' && 'Basic access to perform daily tasks within assigned permissions.'}
                    </Text>
                  </Box>
                )}
                <Flex direction="column" gap={2}>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="excel-upload"
                  />
                  <Button
                    as="label"
                    htmlFor="excel-upload"
                    leftIcon={<FontAwesomeIcon icon={faFileExcel} />}
                    colorScheme="green"
                    variant="outline"
                    cursor="pointer"
                  >
                    Import
                  </Button>
                  {/* Improved Email Import Display */}
                  {(inviteEmails.length > 0 || importErrors.length > 0) && (
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={3}
                      mt={2}
                      maxH="250px"
                      overflowY="auto"
                    >
                    {inviteEmails.length > 0 && (
                      <Box mb={3}>
                        <Flex alignItems="center" mb={2}>
                          <Text fontWeight="bold" mr={2} color="green.600">
                            Valid Emails: {inviteEmails.length}
                          </Text>
                          <Badge colorScheme="green" borderRadius="full">
                            ✓ Ready to Invite
                          </Badge>
                        </Flex>
                        <Box
                          maxH="120px"
                          overflowY="auto"
                          bg="green.50"
                          p={2}
                          borderRadius="md"
                        >
                          {inviteEmails.map((item, index) => (
                            <Flex
                              key={index}
                              alignItems="center"
                              bg="white"
                              p={1}
                              borderRadius="sm"
                              mb={1}
                            >
                              <Text
                                fontSize="sm"
                                flex={1}
                                isTruncated
                                color="green.700"
                              >
                                {item.email}
                              </Text>
                              <Badge
                                colorScheme="blue"
                                size="sm"
                                ml={2}
                              >
                                {item.role}
                              </Badge>
                            </Flex>
                          ))}
                        </Box>
                      </Box>
                    )}
          
                    {importErrors.length > 0 && (
                      <Box>
                        <Flex alignItems="center" mb={2}>
                          <Text fontWeight="bold" mr={2} color="red.600">
                            Invalid Emails: {importErrors.length}
                          </Text>
                          <Badge colorScheme="red" borderRadius="full">
                            ⚠️ Need Correction
                          </Badge>
                        </Flex>
                        <Box
                          maxH="120px"
                          overflowY="auto"
                          bg="red.50"
                          p={2}
                          borderRadius="md"
                        >
                        {importErrors.map((error, index) => (
                          <Text
                            key={index}
                            fontSize="sm"
                            color="red.600"
                            bg="white"
                            p={1}
                            borderRadius="sm"
                            mb={1}
                          >
                            {error}
                          </Text>
                        ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={handleSendInvite}
            >
            Send Invite
            </Button>
            <Button onClick={closeInviteModal} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
 
    {/* Modal to Show Invited Users */}
    <Modal isOpen={isOpen} closeOnOverlayClick={false}  onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" bg="gray.200" fontWeight="bold">
          Invited Users
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Flex gap={4} mb={4} flexWrap="wrap">
              {/* Status Filter */}
              <Box>
                <Text fontWeight="bold" mb={2}>Status Filter:</Text>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  size="md"
                  width="200px"
                >
                  <option value="All">All Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Pending">Pending</option>
                </Select>
              </Box>
 
              {/* Date Filter Type */}
              <Box>
                <Text fontWeight="bold" mb={2}>Date Filter:</Text>
                <Select
                  value={dateFilter.type}
                  onChange={(e) => setDateFilter({ ...dateFilter, type: e.target.value })}
                  size="md"
                  width="200px"
                >
                  <option value="all">All Time</option>
                  <option value="month">By Month</option>
                  <option value="year">By Year</option>
                  <option value="custom">Custom Range</option>
                </Select>
              </Box>
            </Flex>
 
            {/* Conditional Date Filter Controls */}
            {dateFilter.type === "month" && (
              <Flex gap={4} mb={4}>
                <Select
                  value={dateFilter.month}
                  onChange={(e) => setDateFilter({ ...dateFilter, month: e.target.value })}
                  width="200px"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </Select>
                <Select
                  value={dateFilter.year}
                  onChange={(e) => setDateFilter({ ...dateFilter, year: e.target.value })}
                  width="200px"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </Flex>
            )}
 
            {dateFilter.type === "year" && (
              <Select
                value={dateFilter.year}
                onChange={(e) => setDateFilter({ ...dateFilter, year: e.target.value })}
                width="200px"
                mb={4}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            )}
 
            {dateFilter.type === "custom" && (
              <Flex gap={4} mb={4}>
                <Input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, startDate: e.target.value })
                  }
                  placeholder="Start Date"
                />
                <Input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, endDate: e.target.value })
                  }
                  placeholder="End Date"
                />
              </Flex>
            )}
          </Box>
          <Table
            variant="simple"
            bg="gray.50"
            size="sm"
            display="block" 
            maxHeight="400px" 
            overflowY="auto"
            overflowX="hidden"
            width="100%" 
          >
          <Thead
            position="sticky"
            top="0"
            bg="white"
            zIndex="1"
          >
            <Tr>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Invite Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getFilteredInvitedUsers().map((user, index) => (
              <Tr key={index}>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      user.status === "Accepted"
                        ? "green"
                        : user.status === "Pending"
                        ? "yellow"
                        : "orange"
                    }
                    borderRadius="full"
                    px={2}
                  >
                    {user.status}
                  </Badge>
                </Td>
                <Td>{new Date(user.inviteDate).toLocaleDateString()}</Td>
                <Td>
                  {user.status === "Pending" && (
                    <Tooltip label="Resend Invite" placement="top">
                      <IconButton
                        icon={<FiSend size={18} />}  
                        size="sm"
                        colorScheme="black"
                        variant="ghost"
                        isLoading={resendingInvite === user.email}
                        onClick={() => handleResendInvite(user.email)}
                        aria-label="Resend invite"
                        _hover={{ bg: "blue.50" }}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "gray.200" }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
  )}
  {activeView === "Userinfo" && (
    <Userinfo team={selectedTeam} onBack={handleBackToManagement} />
  )}
  </div>
  );
};
 
export default Usermanagement;