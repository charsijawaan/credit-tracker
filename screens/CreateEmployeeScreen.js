import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import axios from 'axios';
import config from '../config';

var statusBarHeight = StatusBar.currentHeight;

export default function CreateCustomerScreen() {

    // Field States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [townCity, setTownCity] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Design States
    const [firstNameIsFocused, setFirstNameIsFocused] = useState(false);
	const [lastNameIsFocused, setLastNameIsFocused] = useState(false);
    const [contactNumberIsFocused, setContactNumberIsFocused] = useState(false);
	const [townCityIsFocused, setTownCityIsFocused] = useState(false);
    const [usernameIsFocused, setUsernameIsFocused] = useState(false);
	const [passwordIsFocused, setPasswordIsFocused] = useState(false);
    const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);

    // Keyboard Listeners (Related To Design)
    Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardIsOpen(false);
        Keyboard.dismiss();        
		setFirstNameIsFocused(false);
        setLastNameIsFocused(false);
        setContactNumberIsFocused(false);
        setTownCityIsFocused(false);
        setUsernameIsFocused(false);
        setPasswordIsFocused(false);
	});

    Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardIsOpen(true);
	});

    // Create Employee Handler
    createEmployeeHandler = () => {
        // Perform Validations
        if(firstName !== "" && lastName !== "" && contactNumber !== "" && townCity !== "" && username !== "" && password !== "") {
            // Send Request to API
            axios.post(config.API_URL + "create_employee", {
                firstName: firstName,
                lastName: lastName,
                contactNumber: contactNumber,
                townCity: townCity,
                username: username,
                password: password
            })
            .then((response) => {
                if(response.data.status === 400) {
                    alert(config.INTERNET_ISSUE_MSG);
                }
                // If Employee is Created
                else {
                    setFirstName("");setLastName("");setContactNumber("");setTownCity("");setUsername("");setPassword("");
                    alert("Employee Created");        
                }
            })
            .catch((error) => {
                console.log(error);
                alert(config.INTERNET_ISSUE_MSG);
            })
        }
        // If Validation Fails
        else {
            alert(config.FIELDS_MISSING_MSG);
        }
    }


    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={keyboardIsOpen ? {...styles.createEmployeeWrapper, justifyContent: "flex-start"} : {...styles.createEmployeeWrapper, justifyContent: "center"}}>                    
                <View>
                    <Text style={firstNameIsFocused ? styles.fieldNameSelected : styles.fieldName}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onFocus={() => {setFirstNameIsFocused(true)}}
                        onBlur={() => {setFirstNameIsFocused(false)}}
                        onChangeText={(firstName) => {setFirstName(firstName)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={lastNameIsFocused ? styles.fieldNameSelected : styles.fieldName}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onFocus={() => {setLastNameIsFocused(true)}}
                        onBlur={() => {setLastNameIsFocused(false)}}
                        onChangeText={(lastName) => {setLastName(lastName)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={contactNumberIsFocused ? styles.fieldNameSelected : styles.fieldName}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        value={contactNumber}
                        onFocus={() => {setContactNumberIsFocused(true)}}
                        onBlur={() => {setContactNumberIsFocused(false)}}
                        onChangeText={(contactNumber) => {setContactNumber(contactNumber)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={townCityIsFocused ? styles.fieldNameSelected : styles.fieldName}>Town / City</Text>
                    <TextInput
                        style={styles.input}
                        value={townCity}
                        onFocus={() => {setTownCityIsFocused(true)}}
                        onBlur={() => {setTownCityIsFocused(false)}}
                        onChangeText={(townCity) => {setTownCity(townCity)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={usernameIsFocused ? styles.fieldNameSelected : styles.fieldName}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onFocus={() => {setUsernameIsFocused(true)}}
                        onBlur={() => {setUsernameIsFocused(false)}}
                        onChangeText={(username) => {setUsername(username)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={passwordIsFocused ? styles.fieldNameSelected : styles.fieldName}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.input}
                        value={password}
                        onFocus={() => {setPasswordIsFocused(true)}}
                        onBlur={() => {setPasswordIsFocused(false)}}
                        onChangeText={(password) => {setPassword(password)}}
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <TouchableOpacity style={styles.createEmployeeBtn}
                        onPress={async () => {
                            Keyboard.dismiss();
                            createEmployeeHandler();
                        }}>
                        <Text style={{color: "#ffffff"}}>Create Employee</Text>
                    </TouchableOpacity>
                </View>
            </View>                
        </ScrollView>            
    );
}

const styles = StyleSheet.create({
	createEmployeeWrapper: {
        marginTop: statusBarHeight,        
        padding: "10%",
    },
	input: {
		height: 40,
		paddingLeft: 10,
		borderRadius: 5,
		width: '100%',
		backgroundColor: "#f7f7f7"
	},
	fieldName: {
		color: "#bababa"
	},
	fieldNameSelected: {
		color: "#007aff"
	},
	createEmployeeBtn: {
		backgroundColor: "#007aff",
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	}
});