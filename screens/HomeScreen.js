import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, SafeAreaView, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import config from '../config';
import { Ionicons } from '@expo/vector-icons';

import CreateCustomerScreen from './CreateCustomerScreen';
import CreateEmployeeScreen from './CreateEmployeeScreen';
import ManageCreditScreen from './ManageCreditScreen';
import { useEffect } from 'react/cjs/react.development';

var Tab = createBottomTabNavigator();

export default function HomeScreen(props) {

    const [isAdmin, setIsAdmin] = useState(false);

    // Helper Functions (can be placed in a seperate file later)
    const getCurrentUserType = async () => {

      let jsonValue = await SecureStore.getItemAsync("user");
      if(JSON.parse(jsonValue).user_type === "admin") {
        setIsAdmin(true);
      }
      else {
        setIsAdmin(false);
      }
    }

    useEffect(() => {
        getCurrentUserType();
    }, []);

    return(
        <Tab.Navigator>
            {/* If user is admin then only show create employee tab */}
            {isAdmin && <Tab.Screen name="Create Employee" component={CreateEmployeeScreen} options={{tabBarIcon: () => <TabBarIcon name="people-outline" size={30}></TabBarIcon>}} />  }                        
            <Tab.Screen name="Create Customer" component={CreateCustomerScreen} options={{tabBarIcon: () => <TabBarIcon name="add-outline" size={30}></TabBarIcon>}} />
            <Tab.Screen name="Manage Credit" component={ManageCreditScreen} options={{tabBarIcon: () => <TabBarIcon name="cash-outline" size={30}></TabBarIcon>}} />
            <Tab.Screen name="Logout" children={() => <Logout changeLoginStateCallback={props.changeLoginStateCallback} />} options={{tabBarIcon: () => <TabBarIcon name="log-out-outline" size={30}></TabBarIcon>}}></Tab.Screen>
        </Tab.Navigator>
    );
}

function TabBarIcon(props) {
    return(
        <Ionicons name={props.name} size={props.size}></Ionicons>
    );
}


// Logout Screen. Code is small thats why created in same file
// Can be created separately
function Logout(props) {

    const removeUserData = async () => {
        try {
          await SecureStore.deleteItemAsync("user")
          props.changeLoginStateCallback(false);
        }
        catch(error) {
          console.log(error);
        }
    }

    useEffect(() => {
        removeUserData();
    }, []);

    return(
        <View>
            
        </View>
    );
}

