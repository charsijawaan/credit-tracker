import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import config from '../config';

export default function LoginScreen( props ) {

    // Field States
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

    // Design States
	const [usernameIsFocused, setUsernameIsFocused] = useState(false);
	const [passwordIsFocused, setPasswordIsFocused] = useState(false);


    // Callback Wrapper
    function changeLoginState(state) {
		props.changeLoginStateCallback(state);
	}


    // Keyboard Listeners (Related To Design)
    Keyboard.addListener("keyboardDidHide", () => {
        Keyboard.dismiss();
		setUsernameIsFocused(false);
		setPasswordIsFocused(false);
	});

    // Helper Functions (can be placed in a seperate file later)
    async function storeUserData(value) {
        await SecureStore.setItemAsync("user", value);
    }

    // Login Handler
    loginHandler = () => {

        // Perform Validation
        if(username !== "" && password !== "") {
            // Send Request to API
            axios.post(config.API_URL + "check_login", {
                username: username,
                password: password
            })
            .then((response) => {
                if(response.data.status === 400) {
                    alert(config.INTERNET_ISSUE_MSG);
                }
                // If wrong username or password
                else if(!response.data.user) {
                    setUsername("");setPassword("");
                    alert("Login Failed");
                }
                // if Login is Found
                else {
                    storeUserData(response.data.user);
                    setUsername("");setPassword("");
                    // Function that calls the callback function to move to next screen
                    changeLoginState(true);
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

	return (
		<View style={styles.container}>

            <View>
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
                <TouchableOpacity style={styles.loginBtn}
                    onPress={async () => {
                        Keyboard.dismiss();   
                        loginHandler();
                    }}>
                    <Text style={{color: "#ffffff"}}>Login</Text>
                </TouchableOpacity>
            </View>
        
        </View>
	);

}

const styles = StyleSheet.create({
	container: {
		padding: '10%',
		flex: 1,
		justifyContent: 'center',
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
	loginBtn: {
		backgroundColor: "#007aff",
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	}
});