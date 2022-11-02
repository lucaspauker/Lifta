import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Oswald_200ExtraLight,
  Oswald_200ExtraLight_Italic,
  Oswald_300Light,
  Oswald_300Light_Italic,
  Oswald_400Regular,
  Oswald_400Regular_Italic,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_600SemiBold_Italic,
  Oswald_700Bold,
  Oswald_700Bold_Italic,
  Oswald_900Black,
  Oswald_900Black_Italic,
} from '@expo-google-fonts/oswald';
import {
  SourceSansPro_200ExtraLight,
  SourceSansPro_200ExtraLight_Italic,
  SourceSansPro_300Light,
  SourceSansPro_300Light_Italic,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
  SourceSansPro_600SemiBold,
  SourceSansPro_600SemiBold_Italic,
  SourceSansPro_700Bold,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_900Black,
  SourceSansPro_900Black_Italic,
} from '@expo-google-fonts/source-sans-pro';

import Feed from './components/Feed';
//import Search from './Search';
import Analytics from './components/Analytics';
import Add from './components/Add';
import Splash from './components/Splash';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import EditWorkout from './components/EditWorkout';
import EditProfile from './components/EditProfile';
import UserPage from './components/UserPage';
import WorkoutPage from './components/WorkoutPage';

import gs from './components/globalStyles.js';

const Tab = createBottomTabNavigator();

function Title(props) {
  return (
    <View style={gs.titleBox}>
      <View style={styles.title}>
        <Text style={[gs.smallHeader, gs.smallNoRightLetter]}>
          L
        </Text>
        <Ionicons name="barbell-outline" size={18} style={gs.smallBarbell}/>
        <Text style={[gs.smallHeader, gs.smallNoLeftLetter]}>
          F
        </Text>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          T
        </Text>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          A
        </Text>
        {props.title && props.title === "nalytics" ? '' :
          <View style={{width: 8}} />
        }
        {props.title ? props.title.split("").map((letter) =>
          <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
            {letter.toUpperCase()}
          </Text>
        ) : ''}
      </View>
      <TouchableOpacity onPress={() => props.navigation.navigate('Add')}>
        <Ionicons name="add-outline" size={30} color={'white'} />
      </TouchableOpacity>
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
function FeedNavigator(props) {
  return (
    <FeedStack.Navigator
      initialRouteName="Feed"
      screenOptions = {{
        headerStyle: {
          backgroundColor: gs.backgroundColor,
          elevation: 0,
          shadowOffset: {
            width: 0, height: 0
          },
        },
        headerTintColor: gs.textColor,
        tabBarStyle: {
          borderTopWidth: 0,
        }
      }}
    >
      <FeedStack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerTitle: () => <Title navigation={props.navigation} title={"feed"}/>,
        }}
      />
      <FeedStack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          title: '',
          headerBackTitle: 'Back',
        }}
      />
      <FeedStack.Screen
        name="Workout"
        component={WorkoutPage}
        options={{
          title: '',
          headerBackTitle: 'Back',
        }}
      />
    </FeedStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileNavigator(props) {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions = {{
        headerStyle: {
          backgroundColor: gs.backgroundColor,
          elevation: 0,
          shadowOffset: {
            width: 0, height: 0
          },
        },
        headerTintColor: gs.textColor,
        tabBarStyle: {
          borderTopWidth: 0,
        }
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: () => <Title navigation={props.navigation} title="profile"/>,
        }}
      />
      <ProfileStack.Screen
        name="EditWorkout"
        component={EditWorkout}
        options={{
          title: '',
          headerBackTitle: 'Back',
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: '',
          headerBackTitle: 'Back',
        }}
      />
      <FeedStack.Screen
        name="Workout"
        component={WorkoutPage}
        options={{
          title: '',
          headerBackTitle: 'Back',
        }}
      />
    </ProfileStack.Navigator>
  );
}

function Home(props) {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: gs.backgroundColor,
          elevation: 0,
          shadowOffset: {
            width: 0, height: 0
          },
        },
        headerTintColor: gs.textColor,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'rocket' : 'rocket-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={'white'} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          paddingTop: 8,
          backgroundColor: gs.primaryColor,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        children={() => <FeedNavigator navigation={props.navigation} />}
        options={{ unmountOnBlur: true, headerShown: false }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Tab.Screen
        name="Analytics"
        children={() => <Analytics navigation={props.navigation} />}
        options={{
          headerTitle: () => <Title navigation={props.navigation} title="nalytics"/>,
        }}
      />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileNavigator navigation={props.navigation} />}
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
    background: gs.primaryColor,
  },
};

const Stack = createStackNavigator();

export default function App({navigation}) {
  let [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    SourceSansPro_200ExtraLight,
    SourceSansPro_200ExtraLight_Italic,
    SourceSansPro_300Light,
    SourceSansPro_300Light_Italic,
    SourceSansPro_400Regular,
    SourceSansPro_400Regular_Italic,
    SourceSansPro_600SemiBold,
    SourceSansPro_600SemiBold_Italic,
    SourceSansPro_700Bold,
    SourceSansPro_700Bold_Italic,
    SourceSansPro_900Black,
    SourceSansPro_900Black_Italic,
    'icomoon': require('./assets/fonts/icomoon.ttf'),
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#9E9E9E"/>;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: gs.backgroundColor,
              elevation: 0,
              shadowOffset: {
                width: 0, height: 0
              },
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Add"
            component={Add}
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
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
    </GestureHandlerRootView>
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
    marginBottom: 10,
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
