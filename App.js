import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts, Oswald_400Regular, } from '@expo-google-fonts/oswald';

import Feed from './components/Feed';
//import Search from './Search';
import Add from './components/Add';
import Splash from './components/Splash';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import EditWorkout from './components/EditWorkout';
import EditProfile from './components/EditProfile';
import UserPage from './components/UserPage';

import gs from './components/globalStyles.js';

const Tab = createBottomTabNavigator();

function Title() {
  return (
    <View style={styles.title}>
      <Ionicons name="barbell-outline" size={30} style={styles.titleText}/>
      <Text style={styles.titleText}>Lifta</Text>
      <Ionicons name="barbell-outline" size={30} style={styles.titleText}/>
    </View>
  );
}

const screenOptions = () => ({
  headerStyle: {
    backgroundColor: gs.backgroundColor,
  },
  headerTintColor: gs.textColor,
});

const FeedStack = createStackNavigator();
function FeedNavigator() {
  return (
    <FeedStack.Navigator
      initialRouteName="Feed"
      screenOptions = {screenOptions}
    >
      <FeedStack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
      <FeedStack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
    </FeedStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions = {screenOptions}
    >
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
      <ProfileStack.Screen
        name="EditWorkout"
        component={EditWorkout}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
    </ProfileStack.Navigator>
  );
}

function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Add"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: gs.backgroundColor,
        },
        headerTintColor: gs.textColor,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={gs.backgroundColor} />;
        },
        tabBarActiveTintColor: gs.primaryColor,
        tabBarInactiveTintColor: gs.primaryColor,
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{ unmountOnBlur: true, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          headerTitle: (props) => <Title {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ unmountOnBlur: true, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
    </Tab.Navigator>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: gs.lightBackgroundColor,
  },
};

const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Oswald_400Regular,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9E9E9E"/>;
  }
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: gs.backgroundColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: gs.textColor,
    fontSize: 20,
    marginRight: 5,
    marginLeft: 5,
    fontFamily: "Oswald_400Regular",
    letterSpacing: 1,
  },
});
