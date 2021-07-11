import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard,  ScrollView, Alert, Modal, Button, CheckBox, Dimensions } from 'react-native';
import { Checkbox, DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import mime from "mime";
import axios from 'axios';
import config from '../config';

var statusBarHeight = StatusBar.currentHeight;

export default function ManageCreditScreen({ navigation }) {

    // States
    const [customers, setCustomers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [increaseCreditAmount, setIncreaseCreditAmount] = useState(0);
    const [decreaseCreditAmount, setDecreaseCreditAmount] = useState(0);
    const [imageURI, setImageURI] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("name");
    const [searchText, setSearchText] = useState("");
    const [showOnHoldMenu, setShowOnHoldMenu] = useState(false);
    const [onHoldCustomer, setOnHoldCustomer] = useState({});
    const [onHoldCustomerBlocked, setOnHoldCustomerBlocked] = useState();
    const [onHoldCustomerArchived, setOnHoldCustomerArchived] = useState();
    const [authName, setAuthName] = useState("");
    const [showMailMenu, setShowMailMenu] = useState(false);
    const [email, setEmail] = useState("");
    const [showArchived, setShowArchived] = useState(false);


    // Get Customers When First Time this component is created
    useEffect(() => {
        getAllCustomers();
    }, [])

    // Get Customers When this Tab is pressed after first time creation
    useEffect(() => {
        // Adding Listener to Tab Press
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            getAllCustomers();  
        });
        return unsubscribe;
    }, [navigation]);


    // Helper Functions (can be placed in a seperate file later)
    const getCurrentUserID = async () => {
        try {
            var jsonValue = await SecureStore.getItemAsync("user");
            return JSON.parse(jsonValue).user_id;
        }
        catch (error) {
          console.log(error);
        }
    }

    const getAllCustomers = async () => {
        axios.post(config.API_URL + "get_all_customers", {

        })
        .then((response) => {
            setCustomers(response.data.customers);
        })
        .catch((error) => {
            console.log(error);
        })
    }


    // Update Credit Handler
    const updateCustomerCredit = async () => {
        // Perform Validations
        if(Number(increaseCreditAmount) > 0 && Number(decreaseCreditAmount) > 0) {
            alert("Enter only in 1 Field at a time");
            return;
        }
        else if(Number(increaseCreditAmount) == 0 && Number(decreaseCreditAmount) == 0) {
            alert("Enter Some Amount to Update");
            return;
        }
        else if(Number(increaseCreditAmount) < 0 || Number(decreaseCreditAmount) < 0) {
            alert("Negative Values Not Allowed");
            return;
        }
        else if(imageURI === "") {
            alert("Attach a Receipt");
            return;
        }
        else if(authName === "") {
            alert("Enter Authorizer Name");
            return;
        }

        // If Validation Passed and case = IncreaseCredit
        else if(Number(increaseCreditAmount) > 0) {  

            // Create Form and append data        
            const formdata = new FormData();

            formdata.append("customer_id", selectedCustomer.customer_id);
            formdata.append("increase_amount", increaseCreditAmount);
            formdata.append("decrease_amount", null);
            formdata.append("changed_by_id", await getCurrentUserID());
            formdata.append("date", new Date().toISOString().slice(0, 19).replace('T', ' '));
            formdata.append("auth_name", authName);
            formdata.append("image", {uri: imageURI, name: imageURI.split('/').pop(), type: mime.getType(imageURI)});
            
            // Request To API
            axios.post(config.API_URL + "increase_customer_credit", formdata)
            .then((response) => {
                // If credit is increased
                if(response.data.status === 100) {
                    setIncreaseCreditAmount(0);
                    setDecreaseCreditAmount(0);
                    setModalVisible(false);
                    getAllCustomers();
                }
                else if(response.data.status === 400) {
                    alert("Some Error Occured");
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }

        // If Validation Passed and case = DecreaseCredit
        else if(Number(decreaseCreditAmount) > 0) {
            
            // Create Form and append data
            const formdata = new FormData();

            formdata.append("customer_id", selectedCustomer.customer_id);
            formdata.append("increase_amount", null);
            formdata.append("decrease_amount", decreaseCreditAmount);
            formdata.append("changed_by_id", await getCurrentUserID());
            formdata.append("date", new Date().toISOString().slice(0, 19).replace('T', ' '));
            formdata.append("auth_name", authName);
            formdata.append("image", {uri: imageURI, name: imageURI.split('/').pop(), type: mime.getType(imageURI)});

            // Request To API
            axios.post(config.API_URL + "decrease_customer_credit", formdata)
            .then((response) => {
                // If credit is decreased
                if(response.data.status === 100) {
                    setIncreaseCreditAmount(0);
                    setDecreaseCreditAmount(0);
                    setModalVisible(false);
                    getAllCustomers();
                }
                else if(response.data.status === 400) {
                    alert("Some Error Occured");
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }

    }


    // Only call the below function after search text state has been chaged
    useEffect(() => {
        updateTableOnSearch();
    }, [searchText]);

    // Update Table after search
    const updateTableOnSearch = async () => {            
        // If search Field is not empty
        if(searchText !== "") {
            // If search type is Name
            if(selectedSearchType === "name") {            
                axios.post(config.API_URL + "search_customer_by_name", {
                    name: searchText
                })
                .then((response) => {
                    setCustomers(response.data.customers);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            // If search type is Phone
            else if(selectedSearchType === "phone") {
                axios.post(config.API_URL + "search_customer_by_phone", {
                    phone: searchText
                })
                .then((response) => {
                    setCustomers(response.data.customers);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
        // If search Field is empty show all customers
        else {
            axios.post(config.API_URL + "get_all_customers", {

            })
            .then((response) => {
                setCustomers(response.data.customers);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    const openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });
        
        let localUri = result.uri;        
        setImageURI(localUri);
    }


    // Archive or Block a Customer
    const updateBlockedAndArchived = () => {
        axios.post(config.API_URL + "update_blocked_and_archived", {
            customer_id: onHoldCustomer.customer_id,
            is_blocked: onHoldCustomerBlocked, 
            is_archived: onHoldCustomerArchived
        })
        .then((response) => {
            if(response.data.status === 100) {
                getAllCustomers();
                setShowOnHoldMenu(false);
            }
            else if(response.data.status === 400) {
                alert(config.INTERNET_ISSUE_MSG);
                return;
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // Download CSV File to Phone
    const downloadCSVFile = () => {
        console.log("download csv file");
        axios.post(config.API_URL + "generate_csv_file", {
            customer_id: selectedCustomer.customer_id
        })
        .then((response) => {
            if(response.data.status === 100) {
                WebBrowser.openBrowserAsync(config.API_URL + response.data.fileName);
            }
            else if(response.data.status === 400) {
                alert("Some Error Occured Please Try Again.");
                return;
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    // Mail CSV File to an Email
    const sendEmail = () => {
        if(email !== "") {
            axios.post(config.API_URL + "send_csv_file", {
                customer_id: selectedCustomer.customer_id,
                email: email
            })
            .then((response) => {
                if(response.data.status === 100) {
                    alert("Email Sent");
                    setShowMailMenu(!showMailMenu);
                }
                else if(response.data.status === 400) {
                    alert(config.INTERNET_ISSUE_MSG);
                }
            })
            .catch((error) => {
                console.log(errpr);
            });
        }
        else {
            alert(config.FIELDS_MISSING_MSG);
        }        
    }

    return(
        <View style={styles.tableWrapper}>

            {/* Modal that is Shown when customer row is clicked */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.fieldName}>Name : <Text style={{color: "#000", textTransform: "capitalize"}}>{selectedCustomer.first_name} {selectedCustomer.last_name}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>Contact Number : <Text style={{color: "#000"}}>{selectedCustomer.contact_number}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>First Line of Address : <Text style={{color: "#000"}}>{selectedCustomer.address_one}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>Second Line of Address : <Text style={{color: "#000"}}>{selectedCustomer.address_two}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>Town / City : <Text style={{color: "#000"}}>{selectedCustomer.town_city}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>Credit : <Text style={{color: "#000"}}>{selectedCustomer.customer_credit}</Text></Text>
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text style={styles.fieldName}>Details : <Text style={{color: "#000"}}>{selectedCustomer.customer_details}</Text></Text>
                        </View>

                        <View style={{marginTop: 5}}>
                            <Text>Authorizer Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(name) => {setAuthName(name)}}
                            >                                
                            </TextInput>
                        </View>

                        <View style={{marginTop: 5}}>
                            <Text>Increase Credit</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(amount) => {setIncreaseCreditAmount(amount)}}
                            />
                        </View>
                        <View style={{marginTop: 5}}>
                            <Text>Decrease Credit</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                onChangeText={(amount) => {setDecreaseCreditAmount(amount)}}
                            />
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => {
                                openGallery();
                            }}>
                                <Text style={{color: "#ffffff"}}>Attach Receipt</Text>
                            </TouchableOpacity>                            
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={updateCustomerCredit}>
                                <Text style={{color: "#ffffff"}}>Update Credit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={downloadCSVFile}>
                                <Text style={{color: "#ffffff"}}>Download CSV File</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => {
                                setModalVisible(!modalVisible);
                                setShowMailMenu(true);
                            }}>
                                <Text style={{color: "#ffffff"}}>Mail CSV File</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => {setModalVisible(!modalVisible)}}>
                                <Text style={{color: "#ffffff"}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Customers Table */}
            <ScrollView>
                <DataTable>

                    <DataTable.Header>
                        <DataTable.Title>Customer ID</DataTable.Title>
                        <DataTable.Title>Customer Name</DataTable.Title>
                        <DataTable.Title numeric>Credit</DataTable.Title>
                    </DataTable.Header>

                    {customers.map((customer, index) => {
                        return(
                            <View key={index}>
                                {showArchived &&
                                    <DataTable.Row
                                        style={customer.is_blocked === 'true' && {backgroundColor: "#dc5a5a"}}
                                        key={index}
                                        onLongPress={() => {
                                            setOnHoldCustomer(customer);
                                            setOnHoldCustomerBlocked(customer.is_blocked);
                                            setOnHoldCustomerArchived(customer.is_archived);
                                            setShowOnHoldMenu(true);
                                        }}
                                        onPress={() => {
                                            setSelectedCustomer(customer);
                                            setModalVisible(true);
                                        }}>
                                        
                                        <DataTable.Cell>{customer.customer_id}</DataTable.Cell>
                                        <DataTable.Cell><Text style={{textTransform: 'capitalize'}}>{customer.first_name} {customer.last_name}</Text></DataTable.Cell>
                                        <DataTable.Cell numeric>{customer.customer_credit}</DataTable.Cell>
                                    </DataTable.Row>
                                }
                                {!showArchived && customer.is_archived === "false" &&
                                    <DataTable.Row
                                    style={customer.is_blocked === 'true' && {backgroundColor: "#dc5a5a"}}
                                    key={index}
                                    onLongPress={() => {
                                        setOnHoldCustomer(customer);
                                        setOnHoldCustomerBlocked(customer.is_blocked);
                                        setOnHoldCustomerArchived(customer.is_archived);
                                        setShowOnHoldMenu(true);
                                    }}
                                    onPress={() => {
                                        setSelectedCustomer(customer);
                                        setModalVisible(true);
                                    }}>
                                    
                                    <DataTable.Cell>{customer.customer_id}</DataTable.Cell>
                                    <DataTable.Cell><Text style={{textTransform: 'capitalize'}}>{customer.first_name} {customer.last_name}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric>{customer.customer_credit}</DataTable.Cell>
                                </DataTable.Row>
                                }                                             
                            </View>
                            
                        );
                    })}                          

                </DataTable>                
            </ScrollView> 

            {/* Bottom Search Bar */}
            <View style={{position: "absolute", bottom: 0, backgroundColor: "#ffffff", width: "100%", padding: 10, display: "flex"}}>

                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

                    {/* Search Bar */}
                    <View style={{width: "50%"}}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Search"
                            onChangeText={(text) => {
                                setSearchText(text);
                            }}
                        />
                    </View>

                    {/* Search Type Picker */}
                    <View style={{width: "30%"}}>
                        <Picker                
                            selectedValue={selectedSearchType}
                            onValueChange={(itemValue, itemIndex) => setSelectedSearchType(itemValue)
                        }>
                            <Picker.Item label="Name" value="name" />
                            <Picker.Item label="Phone Number" value="phone" />
                        </Picker>
                    </View>

                    <View style={[styles.checkboxWrapper, {width: "20%"}]}>
                        <Text>Show Archived</Text>
                        <CheckBox
                            value={showArchived}
                            style={styles.checkbox}
                            onValueChange={() => {setShowArchived(!showArchived)}}
                        />
                    </View>
                </View>


            </View>

            
            {/* Menu That is Shown on Long Press */}
            {showOnHoldMenu && 
                <View style={styles.holdMenuWrapper}>

                    <View style={styles.checkboxWrapper}>
                        <Text>Blocked</Text>
                        <CheckBox
                            value={JSON.parse(onHoldCustomerBlocked)}
                            onValueChange={() => {setOnHoldCustomerBlocked(!JSON.parse(onHoldCustomerBlocked))}}
                            style={styles.checkbox}
                        />
                    </View>

                    <View style={styles.checkboxWrapper}>
                        <Text>Archived</Text>
                        <CheckBox
                            value={JSON.parse(onHoldCustomerArchived)}
                            onValueChange={() => {setOnHoldCustomerArchived(!JSON.parse(onHoldCustomerArchived))}}
                            style={styles.checkbox}
                        />
                    </View>

                    <View style={{marginTop: 8}}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => {
                            updateBlockedAndArchived();
                        }}>
                            <Text style={{color: "#ffffff"}}>Update</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 8}}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => {setShowOnHoldMenu(false)}}>
                            <Text style={{color: "#ffffff"}}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            }


            {/* Menu Shen Main CSV is Clicked */}
            {showMailMenu &&
                <View style={styles.mailMenuWrapper}>

                    <View>
                        <View style={{marginTop: 8}}>
                            <Text style={{textAlign: "center"}}>Enter Email</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Enter Email"
                                onChangeText={(email) => {setEmail(email)}}
                            />
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => {
                                sendEmail();
                            }}>
                                <Text style={{color: "#ffffff"}}>Send</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop: 8}}>
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => {setShowMailMenu(!showMailMenu)}}>
                                <Text style={{color: "#ffffff"}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            }

            
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    fieldName: {
		color: "#bababa"
	},
	tableWrapper: {
        marginTop: statusBarHeight,
        paddingTop: 20,
        flex: 1,
        justifyContent: "center",
    },
    input: {
		height: 40,
		paddingLeft: 10,
		borderRadius: 5,
		width: '100%',
		backgroundColor: "#f7f7f7"
	},
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
      },
      closeModalBtn: {
		backgroundColor: "#007aff",
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,        
	},
    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    checkbox: {
        alignSelf: "center",
    },
    holdMenuWrapper: {
        position: "absolute",
        top: "50%",
        left:"50%",
        marginLeft: -70,
        backgroundColor:"#fff",
        borderRadius: 10,
        padding: 20
    },
    mailMenuWrapper: {
        width: "50%",
        position: "absolute",
        transform: [
            {translateX: windowWidth / 2 - 100}
        ],
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20
    }
});