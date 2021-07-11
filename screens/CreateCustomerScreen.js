import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, CheckBox } from 'react-native';
import axios from 'axios';
import config from '../config';

var statusBarHeight = StatusBar.currentHeight;

export default function CreateCustomerScreen() {

    // Field States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [addressOne, setAddressOne] = useState("");
    const [addressTwo, setAddressTwo] = useState("");
    const [townCity, setTownCity] = useState("");
    const [credit, setCredit] = useState("");
    const [customerDetails, setCustomerDetails] = useState("");
    const [isBlocked, setIsBlocked] = useState(false);

    // Design States
    const [firstNameIsFocused, setFirstNameIsFocused] = useState(false);
	const [lastNameIsFocused, setLastNameIsFocused] = useState(false);
    const [contactNumberIsFocused, setContactNumberIsFocused] = useState(false);
    const [addressOneIsFocused, setAddressOneIsFocused] = useState(false);
    const [addressTwoIsFocused, setAddressTwoIsFocused] = useState(false);
	const [townCityIsFocused, setTownCityIsFocused] = useState(false);
    const [creditIsFocused, setCreditIsFocused] = useState(false);
    const [customerDetailsIsFocused, setCustomerDetailsIsFocused] = useState(false);
    const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);

    // Keyboard Listeners (Related To Design)
    Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardIsOpen(false);
        Keyboard.dismiss();
        setFirstNameIsFocused(false);
        setLastNameIsFocused(false);
        setContactNumberIsFocused(false);
        setAddressOneIsFocused(false);
        setAddressTwoIsFocused(false);
        setTownCityIsFocused(false);
        setCreditIsFocused(false);
        setCustomerDetailsIsFocused(false);        
	});

    Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardIsOpen(true);
	});

    // Add Customer Handler
    addCustomerHandler = () => {
        // Perform Validations
        if(firstName !== "" && lastName !== "" && contactNumber !== "" && addressOne !== "" && addressTwo !== "" && townCity !== "" && credit !== "" && customerDetails !== "") {
            // Send Request to API
            axios.post(config.API_URL + "add_customer", {
                firstName: firstName,
                lastName: lastName,
                contactNumber: contactNumber,
                addressOne: addressOne,
                addressTwo: addressTwo,
                townCity: townCity,
                credit: credit,
                customerDetails: customerDetails,
                isBlocked: isBlocked
            })
            .then((response) => {
                if(response.data.status === 400) {
                    alert(config.INTERNET_ISSUE_MSG);
                }
                // If Customer is Created
                else {
                    setFirstName("");setLastName("");setContactNumber("");setAddressOne("");setAddressTwo("");setTownCity("");setCredit("");setCustomerDetails("");setIsBlocked(false);
                    alert("Customer Added");        
                }
            })
            .catch((error) => {
                console.log(error);
                alert(config.INTERNET_ISSUE_MSG);
            })
        }
        // If Validations Fails
        else {
            alert(config.FIELDS_MISSING_MSG);
        }
    }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={keyboardIsOpen ? {...styles.createCustomerWrapper, justifyContent: "flex-start"} : {...styles.createCustomerWrapper, justifyContent: "center"}}>                    
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
                    <Text style={addressOneIsFocused ? styles.fieldNameSelected : styles.fieldName}>First Line of Address</Text>
                    <TextInput
                        style={styles.input}
                        value={addressOne}
                        onFocus={() => {setAddressOneIsFocused(true)}}
                        onBlur={() => {setAddressOneIsFocused(false)}}
                        onChangeText={(addressOne) => {setAddressOne(addressOne)}}
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={addressTwoIsFocused ? styles.fieldNameSelected : styles.fieldName}>Second Line of Address</Text>
                    <TextInput
                        style={styles.input}
                        value={addressTwo}
                        onFocus={() => {setAddressTwoIsFocused(true)}}
                        onBlur={() => {setAddressTwoIsFocused(false)}}
                        onChangeText={(addressTwo) => {setAddressTwo(addressTwo)}}
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
                    <Text style={creditIsFocused ? styles.fieldNameSelected : styles.fieldName}>Customer Credit</Text>
                    <TextInput                        
                        style={styles.input}
                        value={credit}
                        onFocus={() => {setCreditIsFocused(true)}}
                        onBlur={() => {setCreditIsFocused(false)}}
                        onChangeText={(credit) => {setCredit(credit)}}
                        keyboardType="numeric"
                    />
                </View>

                <View style={{marginTop: 10}}>
                    <Text style={customerDetailsIsFocused ? styles.fieldNameSelected : styles.fieldName}>Customer Details</Text>
                    <TextInput
                        style={styles.input}
                        value={customerDetails}
                        onFocus={() => {setCustomerDetailsIsFocused(true)}}
                        onBlur={() => {setCustomerDetailsIsFocused(false)}}
                        onChangeText={(customerDetails) => {setCustomerDetails(customerDetails)}}
                    />
                </View>

                <View style={styles.checkboxWrapper}>
                    <Text>Also Add To Block List</Text>
                    <CheckBox
                        value={isBlocked}
                        onValueChange={() => {setIsBlocked(!isBlocked)}}
                        style={styles.checkbox}
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <TouchableOpacity style={styles.addCustomerBtn}
                        onPress={async () => {
                            Keyboard.dismiss();
                            addCustomerHandler();
                        }}>
                        <Text style={{color: "#ffffff"}}>Add Customer</Text>
                    </TouchableOpacity>
                </View>
            </View>                
        </ScrollView>            
    );
}

const styles = StyleSheet.create({
	createCustomerWrapper: {
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
	addCustomerBtn: {
		backgroundColor: "#007aff",
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	},
    checkbox: {
        alignSelf: "center",
    },
    checkboxWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    }
});