import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Divider
} from '@chakra-ui/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Dashboard = () => {
  // Mock Data for Charts
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 2000, profit: 9800 },
    { month: 'Apr', revenue: 2780, profit: 3908 },
    { month: 'May', revenue: 1890, profit: 4800 },
    { month: 'Jun', revenue: 2390, profit: 3800 },
  ];

  const projectStatusData = [
    { name: 'Completed', value: 400, color: '#48BB78' },
    { name: 'In Progress', value: 300, color: '#4299E1' },
    { name: 'Pending', value: 200, color: '#ED8936' }
  ];

  const departmentPerformanceData = [
    { department: 'Developer', projects: 12, efficiency: 85 },
    { department: 'QA', projects: 8, efficiency: 75 },
    { department: 'Sales', projects: 15, efficiency: 90 },
    { department: 'HR', projects: 5, efficiency: 65 }
  ];

  return (
    <Box 
      p="32px" 
      bg="#FFFFFF" 
      minH="100vh" 
      borderRadius="lg" 
      shadow="sm"
    >
      <Heading mb={6} borderBottom="1px solid" borderColor="gray.200" pb={4}>
         Dashboard
      </Heading>

      {/* Key Metrics */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Projects</StatLabel>
                <StatNumber>24</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Projects</StatLabel>
                <StatNumber>12</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  15.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <StatNumber>8</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  10.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Team Size</StatLabel>
                <StatNumber>42</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5.36%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Charts Section */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {/* Monthly Revenue Chart */}
        <GridItem>
          <Card h="400px">
            <CardHeader>
              <Heading size="md">Monthly Revenue</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </GridItem>

        {/* Project Status Pie Chart */}
        <GridItem>
          <Card h="400px">
            <CardHeader>
              <Heading size="md">Project Status</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </GridItem>

        {/* Department Performance Bar Chart */}
        <GridItem colSpan={2}>
          <Card h="400px">
            <CardHeader>
              <Heading size="md">Department Performance</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#4299E1" />
                  <Bar dataKey="efficiency" fill="#48BB78" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Recent Projects */}
      <Card mt={6}>
        <CardHeader>
          <Heading size="md">Recent Projects</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <Box borderWidth="1px" borderRadius="lg" p={4}>
              <Heading size="sm" mb={2}>Web Redesign</Heading>
              <HStack>
                <Badge colorScheme="green">Completed</Badge>
                <Text>Progress: 100%</Text>
              </HStack>
            </Box>
            <Box borderWidth="1px" borderRadius="lg" p={4}>
              <Heading size="sm" mb={2}>Marketing Campaign</Heading>
              <HStack>
                <Badge colorScheme="blue">In Progress</Badge>
                <Text>Progress: 65%</Text>
              </HStack>
            </Box>
            <Box borderWidth="1px" borderRadius="lg" p={4}>
              <Heading size="sm" mb={2}>Product Launch</Heading>
              <HStack>
                <Badge colorScheme="yellow">Pending</Badge>
                <Text>Progress: 30%</Text>
              </HStack>
            </Box>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;
