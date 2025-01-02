import React, { useState, useEffect, useRef } from 'react';
import './Timesheet.css';
import { FaLightbulb, FaCalendarAlt } from 'react-icons/fa';
import {
  Box,
  Tooltip,
  Button,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
const taskData = [
  { id: 1, TaskName: 'Develop Login Module', description: 'Design and implement login functionality.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 2, TaskName: 'Optimize Database Queries', description: 'Improve database performance.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 3, TaskName: 'Bug Fixing - API Errors', description: 'Fix issues with API endpoints.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 4, TaskName: 'Update API Documentation', description: 'Add new endpoints and update the API documentation to reflect recent changes.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 5, TaskName: 'Implement User Role Management', description: 'Develop functionality to manage user roles and permissions.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 6, TaskName: 'Code Review for Payment Module', description: 'Conduct code reviews for the payment module to ensure best practices.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 7, TaskName: 'Fix UI Issues', description: 'Investigate and resolve alignment and responsiveness issues in the UI.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 8, TaskName: 'Write Unit Tests', description: 'Create and execute unit tests for critical application components.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 9, TaskName: 'Set Up CI/CD Pipeline', description: 'Configure a CI/CD pipeline for automated deployment and testing.' ,hours: [0, 0, 0, 0, 0, 0, 0]},
  { id: 10, TaskName: 'Refactor Authentication Code', description: 'Improve code structure and readability for the authentication module.',hours: [0, 0, 0, 0, 0, 0, 0] },
  { id: 11, TaskName: 'Integrate Third-party APIs', description: 'Integrate external APIs for real-time data synchronization.',hours: [0, 0, 0, 0, 0, 0, 0] },
];
const Timesheet = () => {
  const getWeekKey = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    return startOfWeek.toISOString().slice(0, 10);
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    const currentWeekKey = getWeekKey(new Date());
    return savedTasks[currentWeekKey] || [];
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [showWeekends, setShowWeekends] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [rowData, setRowData] = useState(taskData);

  const filteredTasks = tasks.filter((task) =>
    task.name && task.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Modal handling functions
  const closeAddtaskModal = () => {
    setSearchTerm(''); // Reset search on close
    setSelectedTasks([]); // Clear selected tasks
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  let toastTimeout;
  const showToast = (message, type = '') => {
    clearTimeout(toastTimeout);
    setToastMessage(message);
    setToastType(type);
    toastTimeout = setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 3000);
  };

  const dateInputRef = useRef(null);

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    setCurrentDate(selected);
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    const currentWeekKey = getWeekKey(currentDate);
    const savedTasksByWeek =
      JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    setTasks(savedTasksByWeek[currentWeekKey] || []);
  }, [currentDate]);

  useEffect(() => {
    const currentWeekKey = getWeekKey(currentDate);
    const savedTasksByWeek =
      JSON.parse(localStorage.getItem('tasksByWeek')) || {};
    savedTasksByWeek[currentWeekKey] = tasks;
    localStorage.setItem('tasksByWeek', JSON.stringify(savedTasksByWeek));
  }, [tasks, currentDate]);

  const handleTaskNameChange = (e) => {
    setNewTaskName(e.target.value);
  };
  const addTask = () => {
    if (selectedTasks.length === 0) {
      alert('Please select at least one task!');
      return;
    }
    const validTasks = selectedTasks.filter((task) =>task && task.TaskName && task.description);
  
  if (validTasks.length === 0) {
    alert('Selected tasks are invalid!');
    return;
  }
    setTasks((prevTasks) => [...prevTasks, ...validTasks]);
    setSelectedTasks([]); 
    closeAddtaskModal(); 
  };

  const handleToggleWeekends = (state) => {
    setShowWeekends(state);
  };

  const submitWeek = () => {
    showToast('Week submitted successfully!', 'success');
  };

  const savedraft = () => {
    showToast('Draft submitted successfully!', 'success');
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showToast('Task deleted successfully!', 'success');
  };

  const handleHourChange = (taskId, dayIndex, value) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedHours = [...task.hours];
        updatedHours[dayIndex] = parseFloat(value) || 0;
        return { ...task, hours: updatedHours };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const closeModal = () => setIsModalOpen(false);

  const weekDays = [...Array(7)].map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i + 1);
    return date;
  });

  const filteredWeekDays = Array.isArray(weekDays)
    ? showWeekends
      ? weekDays
      : weekDays.filter((day) => day.getDay() !== 0 && day.getDay() !== 6)
    : [];

  // const calculateProgress = (dayIndex) => {
  //   const totalHours = tasks.reduce(
  //     (sum, task) => sum + task.hours[dayIndex],
  //     0,
  //   );
  //   const regularHours = Math.min(totalHours, 8);
  //   const overtime = Math.max(totalHours - 8, 0);
  //   return { regularHours, overtime, totalHours };
  // };

  const calculateProgress = (dayIndex) => {
    const totalHours = tasks.reduce((sum, task) => {
      // Ensure task.hours is defined and is an array with a value for dayIndex
      const hoursForTask = task.hours || Array(7).fill(0);  // Default to an array of zeros if hours is missing
      return sum + (hoursForTask[dayIndex] || 0); // Default to 0 if no hour value for that day
    }, 0);
  
    const regularHours = Math.min(totalHours, 8);
    const overtime = Math.max(totalHours - 8, 0);
    return { regularHours, overtime, totalHours };
  };

  const calculateWeeklyProgress = () => {
    const totalWeeklyHours = tasks.reduce(
      (sum, task) => sum + task.hours.reduce((subSum, h) => subSum + h, 0),
      0,
    );
    const maxWeeklyHours = 7 * 8;
    return Math.min((totalWeeklyHours / maxWeeklyHours) * 100, 100);
  };

  const getFormattedWeekRange = () => {
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];

    const startFormatted = startOfWeek.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const endFormatted = endOfWeek.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    { headerName: 'Task Name', field: 'TaskName', sortable: true, filter: true },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
    },
  ];
  const handleSelectionChanged = (e) => {
    const selectedNodes = e.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
  
    // Filter out any invalid tasks (undefined, null, or tasks without a name)
    const validSelectedTasks = selectedData.filter(
      (task) => task && task.TaskName && task.description);
  
    setSelectedTasks(validSelectedTasks); // Update the selected tasks with valid data
  };
  // AG-Grid rowData
  const rowData = taskData;

  return (
    <Box p={8} bg="white" minH="94vh" minW="100vh">
      <Heading mb={5} padding="10px" marginTop="-3.5">
        Timesheet
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
            My Timesheet
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: 'gray.600',
              color: 'gray.800',
              fontWeight: 'semibold',
            }}
          >
            Timesheets
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={10} align="stretch">
              <div>
                  <div className="timesheet-container">
                    {toastMessage && (
                      <div className={`toast ${toastType}`}>{toastMessage}</div>
                    )}
                    {/* navigation button controls   */}
                    <div className="timesheet-header">
                      <h3>{getFormattedWeekRange()}</h3>
                      <div
                        className="week-controls"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <button
                          onClick={() =>
                            setCurrentDate(
                              new Date(
                                currentDate.setDate(currentDate.getDate() - 7),
                              ),
                            )
                          }
                          id="head"
                        >
                          ◀️ Previous
                        </button>
                        <input
                          ref={dateInputRef}
                          type="date"
                          value={
                            selectedDate ||
                            currentDate.toISOString().slice(0, 10)
                          }
                          onChange={handleDateChange}
                          style={{
                            position: 'absolute',
                            opacity: 0,
                            width: 0,
                            height: 0,
                            pointerEvents: 'none',
                          }}
                        />
                        {/* Calendar Icon */}
                        <FaCalendarAlt
                          size={20}
                          style={{ cursor: 'pointer', color: '#495057' }}
                          onClick={() => dateInputRef.current.showPicker()}
                        />
                        <button
                          onClick={() =>
                            setCurrentDate(
                              new Date(
                                currentDate.setDate(currentDate.getDate() + 7),
                              ),
                            )
                          }
                          id="head"
                        >
                          Next▶️
                        </button>
                      </div>
                    </div>

                    {/* Add Task */}
                    <div className="task-addition">
                      <button onClick={onOpen}>+ Add Task</button>
                      {/* toggle slider */}
                      <div
                        style={{
                          marginLeft: '20px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={showWeekends}
                            onChange={(e) =>
                              handleToggleWeekends(e.target.checked)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                        <label style={{ marginLeft: '10px', fontSize: '12px' }}>
                          Show Weekends
                        </label>
                      </div>
                      {/* timeoff model */}
                      <div>
                        <button id="timeoff">Timeoff</button>
                      </div>
                      <div>
                        <button onClick={submitWeek}>Submit Week</button>
                      </div>
                    </div>

                    {/* Timesheet table */}
                    <table className="timesheet-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center' }}>Tasks</th>
                          {filteredWeekDays.map((day, index) => {
                            const { regularHours, overtime, totalHours } =
                              calculateProgress(index);
                            const progressColor =
                              totalHours < 8
                                ? '#c93434'
                                : totalHours === 8
                                  ? '#85e085'
                                  : '#85e085';

                            return (
                              <th key={index}>
                                {day.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: 'numeric',
                                })}
                                <div
                                  className="progress-bar"
                                  title={`Regular: ${regularHours}h, Overtime: ${overtime}h, Total: ${totalHours}h`}
                                >
                                  {/* Regular Hours */}
                                  <div
                                    className="progress regular"
                                    style={{
                                      width: `${(regularHours / 8) * 100}%`,
                                      backgroundColor: progressColor,
                                    }}
                                  ></div>

                                  {/* Overtime Hours */}
                                  {overtime > 0 && (
                                    <div
                                      className="progress overtime"
                                      style={{
                                        width: `${(overtime / 8) * 100}%`,
                                        backgroundColor: '#ffa500',
                                      }}
                                    ></div>
                                  )}
                                </div>
                              </th>
                            );
                          })}
                          <th>
                            Total
                            <div className="progress-bar">
                              <div
                                className="progress"
                                style={{
                                  width: `${calculateWeeklyProgress()}%`,
                                  backgroundColor: '#85e085',
                                }}
                              ></div>
                            </div>
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id}>
                            <td id="col1">
                              {/* Info Icon */}
                              <div
                                className="task-wrapper"
                                style={{ position: 'relative' }}
                              >
                                <span className="task-name">{task.TaskName || 'Untitled Task'}</span>
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '5px',
                                    fontSize: '14px',
                                    display: 'contents',
                                    alignItems: 'center',
                                    position: 'absolute',
                                  }}
                                  onMouseEnter={() => setHoveredTaskId(task.id)}
                                  onMouseLeave={() => setHoveredTaskId(null)}
                                >
                                  <FaLightbulb
                                    style={{
                                      marginRight: '4px',
                                      color: '#FFD700',
                                    }}
                                  />{' '}
                                  {/* Bulb Icon */}
                                </span>
                                {/* Popup for Task Description */}
                                {hoveredTaskId === task.id && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '100%',
                                      left: '0',
                                      backgroundColor: 'white',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                      padding: '10px',
                                      zIndex: 1000,
                                      borderRadius: '4px',
                                      marginTop: '5px',
                                      minWidth: '200px',
                                    }}
                                  >
                                    <p>
                                      {/* {task.description
                                        ? task.description
                                        : 'Tsk description will show here.'} */}
                                       {task.description || 'Task description will show here.'} 
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                            {/* Hour Inputs for Each Day */}
                            {filteredWeekDays.map((_, dayIndex) => (
                              <td key={dayIndex}>
                                <input
                                  type="number"
                                  min="0"
                                  value={task.hours[dayIndex] || 0}
                                  onChange={(e) =>
                                    handleHourChange(
                                      task.id,
                                      dayIndex,
                                      e.target.value,
                                    )
                                  }
                                  className={
                                    task.hours[dayIndex] === 0
                                      ? 'disabled-input'
                                      : 'normal-input'
                                  }
                                  onFocus={(e) =>
                                    (e.target.style.border = '1px solid gray')
                                  }
                                  onBlur={(e) =>
                                    (e.target.style.border = 'none')
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              {task.hours.reduce((sum, h) => sum + h, 0)}h
                            </td>
                            <td>
                              <Tooltip label="Delete Task" placement="top">
                                <button
                                  className="icon-button"
                                  onClick={() => deleteTask(task.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td id="col1">Total</td>
                          {filteredWeekDays.map((_, dayIndex) => (
                            <td key={dayIndex}>
                              {tasks.reduce(
                                (sum, task) => sum + task.hours[dayIndex],
                                0,
                              )}
                              h
                            </td>
                          ))}
                          <td>
                            {tasks.reduce(
                              (sum, task) =>
                                sum +
                                task.hours.reduce((subSum, h) => subSum + h, 0),
                              0,
                            )}
                            h
                          </td>
                          <td>
                            <button id="savedraft" onClick={savedraft}>
                              Save Draft
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Modal for Add Task */}
                    {/* Add Task Modal */}
                    <Modal isOpen={isOpen} onClose={closeAddtaskModal}>
                      <ModalOverlay />
                      <ModalContent borderRadius="md" p={4} maxWidth="700px" maxHeight="650px">
                        <ModalHeader textAlign="left" fontSize="2xl" fontWeight="bold">Add a New Task</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                          <div
                            className="ag-theme-alpine"
                            style={{
                              height: '300px',
                              width: '100%',
                              marginTop: '10px',
                            }}
                          >
                              <AgGridReact
                                columnDefs={columnDefs}
                                rowData={rowData}
                                rowSelection="multiple"
                                onSelectionChanged={handleSelectionChanged}
                              />
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme="blue" onClick={addTask}>
                            Add Task
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={closeAddtaskModal}
                            ml={3}
                          >
                            Cancel
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
              </div>
            </VStack>
          </TabPanel>
          <TabPanel>
            <p>This is another tab's content.</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Timesheet;
