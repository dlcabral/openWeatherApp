/* eslint-disable prettier/prettier */
import React, {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './app/screens/Home';
import CityDetailsScreen from './app/screens/CityDetailsScreen';
import LoadingScreen from './app/screens/Loading';

const Stack = createStackNavigator();
const App: FC = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
          <Stack.Screen name="CityDetailsScreen" component={CityDetailsScreen} options={{title: 'City Details'}} />
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
