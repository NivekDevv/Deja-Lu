import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";

import ExplorerScreen from "./ExplorerScreen";
import MyBooksScreen from "./MyBooksScreen";
import MyProfileScreen from "./MyProfileScreen";

const Tab = createMaterialBottomTabNavigator();

function MainBottomBar() {
  return (
    <Tab.Navigator
      initialRouteName="ExplorerScreen"
      activeColor="#fff"
      barStyle={{ backgroundColor: "#490B08" }}
    >
      <Tab.Screen
        name="Explorer"
        component={ExplorerScreen}
        options={{
          tabBarLabel: "Explorer",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{
          tabBarLabel: "Mes Livres",
          tabBarColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-book" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          tabBarLabel: "Statistiques",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainBottomBar;
