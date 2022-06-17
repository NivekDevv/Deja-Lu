import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useFonts } from "expo-font";

import MainBottomBar from "./screens/MainBottomBar";
import HomeScreen from "./screens/HomeScreen";
import BookDetail from "./screens/BookDetails";
import DetailsLu from "./screens/DetailsLu";
import DetailsPasLu from "./screens/DetailsPasLu";
import DetailsGiven from "./screens/DetailsGiven";
import DetailsAllList from "./screens/DetailsAllList";
import MySearchScreen from "./screens/MySearchScreen";

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import token from "./reducers/token";
import user from "./reducers/user";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  },
};

const store = createStore(combineReducers({ token, user }));

const Stack = createStackNavigator();

function App() {
  const [loaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-BoldItalic": require("./assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("./assets/fonts/Roboto-Italic.ttf"),
    "Caramel-and-Vanilla": require("./assets/fonts/Caramel-and-Vanilla.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BookDetail" component={BookDetail} />
          <Stack.Screen name="DetailsLu" component={DetailsLu} />
          <Stack.Screen name="DetailsPasLu" component={DetailsPasLu} />
          <Stack.Screen name="DetailsGiven" component={DetailsGiven} />
          <Stack.Screen name="DetailsAllList" component={DetailsAllList} />
          <Stack.Screen name="Search" component={MySearchScreen} />
          <Stack.Screen name="MainBottomBar" component={MainBottomBar} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
