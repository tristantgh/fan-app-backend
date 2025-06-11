import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import Announcements from './screens/Announcements';
import BehindTheScenes from './screens/BehindTheScenes';
import FanChat from './screens/FanChat';
import FanContent from './screens/FanContent';
import FanLeaderboard from './screens/FanLeaderboard';
import Merch from './screens/Merch';
import Perks from './screens/Perks';
import Support from './screens/Support';
import TheStory from './screens/TheStory';
import UnreleasedMusic from './screens/UnreleasedMusic';
import UpcomingShows from './screens/UpcomingShows';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Announcements" component={Announcements} />
        <Stack.Screen name="BehindTheScenes" component={BehindTheScenes} />
        <Stack.Screen name="FanChat" component={FanChat} />
        <Stack.Screen name="FanContent" component={FanContent} />
        <Stack.Screen name="FanLeaderboard" component={FanLeaderboard} />
        <Stack.Screen name="Merch" component={Merch} />
        <Stack.Screen name="Perks" component={Perks} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="TheStory" component={TheStory} />
        <Stack.Screen name="UnreleasedMusic" component={UnreleasedMusic} />
        <Stack.Screen name="UpcomingShows" component={UpcomingShows} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}