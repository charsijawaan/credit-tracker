import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, LogBox } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

var Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

export default function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	function changeLoginStateCallback(newValue) {
		setIsLoggedIn(newValue);
	}

	const checkIfUserWasLoggedIn = async () => {		
		var jsonValue = await SecureStore.getItemAsync("user");
		if(JSON.parse(jsonValue).user_id) {
			setIsLoggedIn(true);
		}
		else {
			setIsLoggedIn(false);
		}
	}

	useEffect(() => {
		checkIfUserWasLoggedIn();
	}, []);

	return(		
		<NavigationContainer>			
			{isLoggedIn &&
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="HomeScreen" children={() => <HomeScreen changeLoginStateCallback={changeLoginStateCallback} />}></Stack.Screen>
			</Stack.Navigator>			
			}
			{!isLoggedIn &&
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LoginScreen" children={() => <LoginScreen changeLoginStateCallback={changeLoginStateCallback} />}></Stack.Screen>
			</Stack.Navigator>			
			}
		</NavigationContainer>		
	); 
}
