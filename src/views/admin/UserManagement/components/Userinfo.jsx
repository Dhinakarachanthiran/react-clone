import React, { useState , useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Avatar,
  Tab,
  toast,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  HStack,
  FormLabel,
  useToast,
  ModalCloseButton,
  Grid,
  GridItem,
  Select,
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaPhone,
  FaTransgender,
  FaMapMarkerAlt,
  FaNetworkWired,
  FaUserEdit,
  FaBirthdayCake,
  FaHeart,
  FaCalendar,
  FaUserTie,
  FaUsers,
  FaTrash,
  FaIdBadge,
  FaCamera,
  FaHeartbeat,
  FaBarcode, // Added for employee code
} from 'react-icons/fa';
import { MdPhone,MdPhotoCamera } from "react-icons/md"; // Sleeker icon alternative
 
export default function UserDetailsPage({ onBack }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [userDetails, setUserDetails] = useState({
    // Personal Information
    name: "Praveen D",
    email: "praveen.d@company.com",
    phone: "+91 9876543210",
    location: "Chennai, India",
    dateOfBirth: "1990-05-15",
    maritalStatus: "UnMarried",
    gender: "Male", // Added gender field
    profilePhoto: "/path/to/profile/image", // Add this line AFTER the last existing field
   
   
    // Professional Details
    employeeCode: "EMP-2019-0325", // Added employee code
    designation: "Senior Software Developer",
    jobTitle: "Senior Software Developer",
    department: "IT",
    team: "Mavericks",
    teamManager: "Sridhar",
    joiningDate: "2019-03-15",
   
   
    // Emergency Contact
    emergencyContactName: "Deepa D",
    emergencyContactRelation: "Sister",
    emergencyContactPhone: "+91 9887766554"

    
  });

  const [isProfilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);

const handleOpenProfilePhotoModal = () => setProfilePhotoModalOpen(true);
const handleCloseProfilePhotoModal = () => setProfilePhotoModalOpen(false);

const deleteProfilePhoto = () => {
  setUserDetails(prev => ({
    ...prev,
    profilePhoto: "/path/to/profile/image", // Reset to default photo
  }));
  toast({
    title: "Profile Photo Removed",
    description: "Your profile photo has been reset to the default image.",
    status: "warning",
    duration: 3000,
    position: "top-end",
    isClosable: true,
  });
  handleCloseProfilePhotoModal();
};



  // Add these new functions
const fileInputRef = useRef(null);

const uploadProfilePhoto = (event) => {
  const file = event.target.files[0];
  // Check if a file was actually selected
  if (!file) {
    toast({
      title: "No File Selected",
      description: "Please choose an image to upload.",
      status: "warning",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }
  
  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File Too Large",
      description: "Please upload an image smaller than 5MB.",
      status: "error",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid File Type",
      description: "Please upload a JPEG, PNG, or GIF image.",
      status: "error",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }

  // Create a file reader to generate preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setUserDetails(prev => ({
      ...prev,
      profilePhoto: reader.result
    }));

    // Clear the file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show success toast
    toast({
      title: "Profile Photo Updated",
      description: "Your profile photo has been successfully uploaded.",
      status: "success",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
  };

  // Read the file
  reader.readAsDataURL(file);
};

// Function to trigger file input
const openFileInput = () => {
  fileInputRef.current.click();
};
  const toast = useToast();
 // Temporary state to hold changes during editing
 const handleSave = () => {
  // Validate inputs if needed
  const requiredFields = ['name', 'email', 'phone', 'designation', 'department'];
  const missingFields = requiredFields.filter(field => !userDetails[field]);
 
  if (missingFields.length > 0) {
    toast({
      title: "Validation Error",
      description: `Please fill in the following fields: ${missingFields.join(', ')}`,
      status: "error",
      duration: 3000,
      position: "top-end",
      isClosable: true,
    });
    return;
  }
 
  // Show success toast
  toast({
    title: "Profile Updated",
    description: "Your profile details have been successfully updated.",
    status: "success",
    duration: 3000,
    position: "top-end",
    isClosable: true,
  });
 
  // Close the modal
  onClose();
};
  const InfoRow = ({ icon: IconComponent, label, value, children }) => (
    <Flex
      align="center"
      py={3}
      borderBottom="1px solid"
      borderColor="gray.200"
      textAlign="left"
    >
      <Icon as={IconComponent} color="gray.500" mr={4} boxSize={5} />
      <Flex
        width="full"
        flexDirection="column"
        align="flex-start"
      >
        <Text fontWeight="medium" color="gray.600" mb={1}>
          {label}
        </Text>
        {value ? (
          <Text fontWeight="semibold" color="gray.800">
            {value}
          </Text>
        ) : (
          children
        )}
      </Flex>
    </Flex>
  );
 
  return (
    <Flex
      width="100%"
      height="94vh"
      bg="white"
      align="center"
      justify="center"
      p={6}
      overflow="hidden"  // This prevents scrolling on the page
    >
      <Box
        width="100%"
        minH="94vh"
        maxWidth="1000px"
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="lg"
      >
        {/* Header Section */}
        <Flex bg="gray.100" color="gray.900" p={6} align="center" borderBottom="1px solid" borderColor="gray.100">
        <Box position="relative" width="fit-content">
  <Avatar 
    size="xl" 
    src={userDetails.profilePhoto || "/default/path/to/image"} 
    mr={6} 
    borderWidth={2} 
    borderColor="gray.600" 
    cursor="pointer" 
  />
  {/* Improved Pencil Icon Styling */}
  <Icon 
    as={MdPhotoCamera} 
    position="absolute" 
    bottom={-2} 
    right={4} 
    borderRadius="full" 
    bg="gray.100" 
    color="gray.700" 
    p={2} 
    boxSize={8} 
    cursor="pointer" 
    onClick={handleOpenProfilePhotoModal}
    boxShadow="md"
    _hover={{
      bg: "gray.200",
      color: "gray.900"
    }}
    transition="all 0.2s"
  />
  <Input 
    type="file" 
    ref={fileInputRef} 
    style={{ display: 'none' }} 
    accept="image/jpeg,image/png,image/gif" 
    onChange={uploadProfilePhoto} 
  />
</Box>


          <VStack align="flex-start" spacing={1} flex={1}>
            <Heading size="lg" color="gray.800">{userDetails.name}</Heading>
            <Text color="gray.600">{userDetails.jobTitle}</Text>
            </VStack>
<Button
  colorScheme="black"
  variant="outline"
  _hover={{ bg: "gray.200" }}
  onClick={onOpen}
>
  <FaUserEdit />
  &nbsp; Edit Profile
</Button>
<Button
  colorScheme="black"
  variant="outline"
  _hover={{ bg: "gray.200" }}
  onClick={onBack}
  ml={4} /* Adds margin to the left of this button */
>
  Back
</Button>

        </Flex>
 
        {/* Tab Section */}
        <Tabs
          variant="line"
          colorScheme="gray"
          mt={4}
          px={6}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList>
            <Tab
              _selected={{
                borderBottomColor: "gray.600",
                color: "gray.800",
                fontWeight: "semibold"
              }}
            >
              Personal Info
            </Tab>
            <Tab
              _selected={{
                borderBottomColor: "gray.600",
                color: "gray.800",
                fontWeight: "semibold"
              }}
            >
              Professional Details
            </Tab>
          </TabList>
          <TabPanels>
            {/* Personal Info Tab */}
            <TabPanel>
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap={4}
                mt={4}
                alignItems="stretch"
              >
                 
                <GridItem>
                  <InfoRow
                    icon={FaEnvelope}
                    label="Email"
                    value={userDetails.email}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={MdPhone} // Updated icon
                    label="Phone"
                    value={userDetails.phone}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaMapMarkerAlt}
                    label="Location"
                    value={userDetails.location}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaBirthdayCake}
                    label="Date of Birth"
                    value={userDetails.dateOfBirth}
                  />
                  </GridItem>
          <GridItem>
            <InfoRow
              icon={FaTransgender} // Updated icon for gender
              label="Gender"
              value={userDetails.gender}
            />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaHeart}
                    label="Marital Status"
                    value={userDetails.maritalStatus}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaHeartbeat}
                    label="Emergency Contact"
                    value={`${userDetails.emergencyContactName}  (${userDetails.emergencyContactRelation}) ${userDetails.emergencyContactPhone}`}
                  />
                </GridItem>
              </Grid>
            </TabPanel>
 
            {/* Professional Details Tab */}
            <TabPanel>
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap={4}
                mt={4}
                alignItems="stretch"
              >
                <GridItem>
                  <InfoRow
                    icon={FaBarcode}
                    label="Employee Code"
                    value={userDetails.employeeCode}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaIdBadge}
                    label="Designation"
                    value={userDetails.designation}
                  />
                </GridItem>
               
                <GridItem>
                  <InfoRow
                    icon={FaNetworkWired}
                    label="Department"
                    value={userDetails.department}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaUsers}
                    label="Team"
                    value={userDetails.team}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaUserTie}
                    label="Team Manager"
                    value={userDetails.teamManager}
                  />
                </GridItem>
                <GridItem>
                  <InfoRow
                    icon={FaCalendar}
                    label="Joining Date"
                    value={userDetails.joiningDate}
                  />
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
 
        {/* Footer */}
        <Flex
          justify="flex-end"
          p={6}
          borderTop="1px solid"
          borderColor="gray.100"
        >
          
        </Flex>
      </Box>
      <Modal isOpen={isProfilePhotoModalOpen}closeOnOverlayClick={false} onClose={handleCloseProfilePhotoModal}>
  <ModalOverlay />
  <ModalContent  borderRadius="xl">
    <ModalHeader>Profile Picture</ModalHeader>
    <ModalCloseButton color="black.700" />
    <ModalBody>
      <VStack spacing={4}>
        {/* Display Current Profile Photo */}
        <Avatar
          size="xl"
          src={userDetails.profilePhoto || "/default/path/to/image"}
          borderWidth={2}
          borderColor="gray.600"
        />
        {/* Display Name and Email Below Profile Photo */}
        <Text   fontWeight="bold">
          {userDetails.name || "Your Name"}
        </Text>
        <Text   color="gray.500">
          {userDetails.email || "your.email@example.com"}
        </Text>

        {/* Options for Add and Remove on the Same Line */}
        <HStack spacing={4} justifyContent="center">
          <Button
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "gray.200" }}
            onClick={() => {
              openFileInput(); // Open file input for Add Photo
              handleCloseProfilePhotoModal(); // Close the modal
            }}
            leftIcon={<FaCamera />}
          >
            Change  
          </Button>
          <Button
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "gray.200" }}
            onClick={deleteProfilePhoto}
            leftIcon={<FaTrash />}
          >
            Remove 
          </Button>
        </HStack>
      </VStack>
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={handleCloseProfilePhotoModal}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
 
{/* Modal for Editing */}
<Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="xl">
  <ModalOverlay />
  <ModalContent
    borderRadius="lg"
    maxHeight="82vh"  // Set maximum height to 90% of the viewport height
    boxShadow="lg"
    p={0}
    overflow="hidden"  // Prevent overflow and scroll
  >
    <ModalHeader textAlign="center" p={2} fontWeight="bold" fontSize="lg">
      Edit User Details
    </ModalHeader>
    <ModalCloseButton color="black.700" />
    <ModalBody paddingY={0}> {/* Remove vertical padding to optimize space */}
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab
            _selected={{
              borderBottomColor: "blue.500",
              color: "blue.600",
              fontWeight: "semibold",
            }}
          >
            Personal Info
          </Tab>
          <Tab
            _selected={{
              borderBottomColor: "blue.500",
              color: "blue.600",
              fontWeight: "semibold",
            }}
          >
            Professional Details
          </Tab>
        </TabList>
        <TabPanels>
          {/* Personal Info Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {/* Name and Email in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Name</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails.name} />
                </Box>
                <Box flex={1}>
                  <FormLabel>Email</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails.email} />
                </Box>
              </Flex>
              {/* Date of Birth and Gender in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input isReadOnly variant="filled" type="date" value={userDetails.dateOfBirth} />
                </Box>
                <Box flex={1}>
                  <FormLabel>Gender</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails.gender} />
                </Box>
              </Flex>
              {/* Phone and Location in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    placeholder="Enter phone number"
                    type="tel"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                  />
                </Box>
                <Box flex={1}>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="Enter location"
                    value={userDetails.location}
                    onChange={(e) => setUserDetails({ ...userDetails, location: e.target.value })}
                  />
                </Box>
              </Flex>

              {/* Marital Status replaced the previous Location line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Marital Status</FormLabel>
                  <Select
                    placeholder="Select marital status"
                    value={userDetails.maritalStatus}
                    onChange={(e) => setUserDetails({ ...userDetails, maritalStatus: e.target.value })}
                  >
                    <option value="Single">UnMarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Select>
                </Box>
                <Box flex={1}>
                  <FormLabel>Emergency Contact Name</FormLabel>
                  <Input
                    placeholder="Enter emergency contact name"
                    value={userDetails.emergencyContactName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        emergencyContactName: e.target.value,
                      })
                    }
                  />
                </Box>
              </Flex>

              <Flex gap={4}>
                {/* Emergency Contact Relation */}
                <Box flex={1}>
                  <FormLabel>Emergency Contact Relation</FormLabel>
                  <Input
                    placeholder="Enter emergency contact relation"
                    value={userDetails.emergencyContactRelation}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        emergencyContactRelation: e.target.value,
                      })
                    }
                  />
                </Box>

                {/* Emergency Contact Phone */}
                <Box flex={1}>
                  <FormLabel>Emergency Contact Phone</FormLabel>
                  <Input
                    placeholder="Enter emergency contact phone"
                    value={userDetails.emergencyContactPhone}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                  />
                </Box>
              </Flex>
            </VStack>
          </TabPanel>
          {/* Professional Details Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {/* Employee Code and Joining Date in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Employee Code</FormLabel>
                  <Input isReadOnly variant="filled" value={userDetails.employeeCode} />
                </Box>
                <Box flex={1}>
                  <FormLabel>Joining Date</FormLabel>
                  <Input isReadOnly variant="filled" type="date" value={userDetails.joiningDate} />
                </Box>
              </Flex>

              {/* Designation and Department in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Designation</FormLabel>
                  <Input
                    placeholder="Enter designation"
                    value={userDetails.designation}
                    onChange={(e) => setUserDetails({ ...userDetails, designation: e.target.value })}
                  />
                </Box>
                <Box flex={1}>
                  <FormLabel>Department</FormLabel>
                  <Input
                    placeholder="Enter department"
                    value={userDetails.department}
                    onChange={(e) => setUserDetails({ ...userDetails, department: e.target.value })}
                  />
                </Box>
              </Flex>

              {/* Team Name and Team Manager Name in the same line */}
              <Flex gap={4}>
                <Box flex={1}>
                  <FormLabel>Team</FormLabel>
                  <Input placeholder="Enter team" value={userDetails.team} isReadOnly />
                </Box>
                <Box flex={1}>
                  <FormLabel>Team Manager</FormLabel>
                  <Input placeholder="Enter team manager" value={userDetails.teamManager} isReadOnly />
                </Box>
              </Flex>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" variant="solid"   mr={3} onClick={handleSave}>
        Save
      </Button>
      <Button variant="outline"   onClick={onClose}>
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

</Flex>
  );
}