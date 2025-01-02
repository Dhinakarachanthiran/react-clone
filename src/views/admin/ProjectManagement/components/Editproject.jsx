import React, { useState, useCallback } from 'react';
import {
  Box,
  Badge,
  HStack,
  Button,
  Text as ChakraText,
  Grid,
  GridItem,
  Tag,
  Flex,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Heading,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EditprojectGrid = ({ onBack, projectId }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Develop Login ',
      expectedHours: '5h',
      actualHours: '4h',
      completedHours: '4h',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Optimize  Queries',
      expectedHours: '3h',
      actualHours: '2h',
      completedHours: '2h',
      status: 'In Process',
    },
    {
      id: 3,
      name: 'Bug Fixing',
      expectedHours: '2h',
      actualHours: '1h',
      completedHours: '0h',
      status: 'Hold',
    },
    {
      id: 4,
      name: 'API Documentation',
      expectedHours: '8h',
      actualHours: '7h',
      completedHours: '7h',
      status: 'Completed',
    },
    {
      id: 5,
      name: 'Implementation',
      expectedHours: '5h',
      actualHours: '4h',
      completedHours: '4h',
      status: 'Completed',
    },
    {
      id: 6,
      name: 'Code Review',
      expectedHours: '3h',
      actualHours: '2h',
      completedHours: '2h',
      status: 'Completed',
    },
    {
      id: 7,
      name: 'Fix UI Issues',
      expectedHours: '2h',
      actualHours: '1h',
      completedHours: '0h',
      status: 'Hold',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Mavericks');
  const [editingTask, setEditingTask] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const teams = [
    { id: 1, name: 'Mavericks' },
    { id: 2, name: 'CodeMates' },
  ];

  const statuses = ['Completed', 'In Process', 'Hold'];

  // Calculate task status counts
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    Completed: 'green',
    'In Process': 'blue',
    Hold: 'red',
  };

  const columnDefs = [
    {
      headerName: 'Task Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Expected Hours',
      field: 'expectedHours',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Actual Hours',
      field: 'actualHours',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Completed Hours',
      field: 'completedHours',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params) => {
        const color =
          params.value === 'Completed'
            ? 'green'
            : params.value === 'In Process'
              ? 'orange'
              : 'red';
        return (
          <Tag className="Badge-lables" colorScheme={color}>
            {params.value}
          </Tag>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1,
      cellRenderer: (params) => (
        <Box display="flex" justifyContent="left">
          <Tooltip label="Edit Team" placement="top">
            <button
              className="icon-button"
              onClick={() => handleEditTask(params.data)}
            >
              <i className="fas fa-edit"></i>
            </button>
          </Tooltip>
          <Tooltip label="Delete Team" placement="top">
            <button
              className="icon-button"
              onClick={() => handleDeleteTask(params.data.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleTeamSelection = (team) => setSelectedTeam(team);

  const handleFilterChange = (status) => setFilter(status);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleNewTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: `New Task ${tasks.length + 1}`,
      expectedHours: '0h',
      actualHours: '',
      completedHours: '',
      status: 'In Process',
    };
    setTasks([...tasks, newTask]);
    setEditingTask(newTask);
    onOpen();
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
    onOpen();
  };

  const handleSaveTask = useCallback(() => {
    if (!editingTask) return;

    // Validate input
    if (!editingTask.name || !editingTask.expectedHours) {
      toast({
        title: 'Validation Error',
        description: 'Task name and expected hours are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update or add task
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((t) => t.id === editingTask.id);
      if (index !== -1) {
        // Update existing task
        const updatedTasks = [...prevTasks];
        updatedTasks[index] = editingTask;
        return updatedTasks;
      } else {
        // Add new task
        return [...prevTasks, editingTask];
      }
    });

    toast({
      title: 'Task Saved',
      description: 'Your task has been successfully saved.',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-end',
      colorScheme: 'green',
    });

    onClose();
  }, [editingTask, onClose, toast]);

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    toast({
      title: 'Task Deleted',
      description: 'The task has been removed from the project.',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-end',
      colorScheme: 'red',
    });
  };
  const filteredTasks = tasks
    .filter((task) =>
      filter ? task.status.toLowerCase() === filter.toLowerCase() : true,
    )
    .filter((task) =>
      searchTerm
        ? task.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    );

  return (
    <Box className="edit-project-container" p={8} bg="white" minH="90vh">
      {/* Header Section */}
      <Flex direction="column" mb={6}>
        <Flex justifyContent="space-between" alignItems="center" mb={0}>
          <Flex alignItems="center" gap={1}>
            <Heading>Sage300</Heading>
            <Tag colorScheme="green" size="md">
              Active
            </Tag>
          </Flex>
          <HStack spacing={4}>
            <Button
              colorScheme="black"
              variant="outline"
              top="-1px"
              fontSize="12px"
              height="32px"
              padding="8px 14px"
              _hover={{ bg: 'gray.200' }}
              display="flex"
              alignItems="center"
              onClick={onBack}
            >
              Back
            </Button>
          </HStack>
        </Flex>
      </Flex>

      {/* Team Names and Task Status Summary */}
      <Flex mt={4} justifyContent="space-between" alignItems="center">
        {/* Team Names */}
        <HStack spacing={4}>
          <ChakraText fontWeight="bold" fontSize="2xl">
            Team Names:
          </ChakraText>
          {teams.map((team) => (
            <Badge
              key={team.id}
              px={2}
              py={2}
              fontSize="sm"
              borderRadius="2xl"
              cursor="pointer"
              onClick={() => handleTeamSelection(team.name)}
              textTransform="capitalize"
            >
              <ChakraText as="span" mr={2} fontSize="lg">
                👤
              </ChakraText>
              {team.name}
            </Badge>
          ))}
        </HStack>

        {/* Task Status Summary */}
        <SimpleGrid columns={3} spacing={2} w="35%" maxW="350px">
          {statuses.map((status) => (
            <Box
              key={status}
              p={1}
              borderWidth={1}
              borderRadius="lg"
              textAlign="center"
              boxShadow="sm"
              transition="all 0.2s ease"
              bg={`${statusColors[status]}.50`}
              borderColor={`${statusColors[status]}.200`}
              _hover={{
                transform: 'scale(1.03)',
                boxShadow: 'md',
                borderColor: `${statusColors[status]}.400`,
              }}
            >
              <VStack spacing={1}>
                <ChakraText
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="tight"
                  color={`${statusColors[status]}.700`}
                >
                  {status}
                </ChakraText>
                <ChakraText
                  fontSize="md"
                  fontWeight="bold"
                  color={`${statusColors[status]}.800`}
                >
                  {taskStatusCounts[status] || 0}
                </ChakraText>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>

      {/* Task Controls */}
      <Flex mt={6} justifyContent="space-between" alignItems="center">
        <HStack spacing={4}>
          <ChakraText fontWeight="bold">Filter Tasks:</ChakraText>
          <Select
            bg="white"
            size="sm"
            width="170px"
            variant="outline"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            borderRadius="md"
            onChange={(e) => handleFilterChange(e.target.value)}
            value={filter}
            w="200px"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Input
            placeholder="🔍 Search Task..."
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
        </HStack>
        <Button
          // leftIcon={<MdGroups style={{ width: '25px', height: 'auto' }}/>}
          colorScheme="black"
          variant="outline"
          top="-1px"
          fontSize="12px"
          height="32px"
          padding="8px 14px"
          _hover={{ bg: 'gray.200' }}
          display="flex"
          alignItems="center"
          onClick={handleNewTask}
        >
          + Assign Task
        </Button>
      </Flex>

      {/* AG Grid */}
      <Box
        className="ag-theme-alpine"
        style={{ height: 400, width: '100%', marginTop: '30px' }}
      >
        <AgGridReact
          rowData={filteredTasks}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true }}
          pagination
          paginationPageSize={5}
        />
      </Box>
      {/* Task Edit/Add Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTask?.id ? 'Edit Task' : 'Add New Task'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Task Name</FormLabel>
              <Input
                value={editingTask?.name || ''}
                onChange={(e) =>
                  setEditingTask((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter task name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Expected Hours</FormLabel>
              <Input
                value={editingTask?.expectedHours || ''}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    expectedHours: e.target.value,
                  }))
                }
                placeholder="Enter expected hours"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Actual Hours</FormLabel>
              <Input
                value={editingTask?.actualHours || ''}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    actualHours: e.target.value,
                  }))
                }
                placeholder="Enter actual hours"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Completed Hours</FormLabel>
              <Input
                value={editingTask?.completedHours || ''}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    completedHours: e.target.value,
                  }))
                }
                placeholder="Enter completed hours"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={editingTask?.status || 'In Process'}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSaveTask}>
              Save Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditprojectGrid;
