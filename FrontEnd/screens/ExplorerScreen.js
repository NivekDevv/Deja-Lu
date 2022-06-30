import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IconButton, Colors, TextInput } from "react-native-paper";
import { GoogleBookSearch } from "react-native-google-books";
import SearchBar from "react-native-dynamic-search-bar";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import { ScrollView } from "react-native-virtualized-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Icon } from "react-native-elements";
//.APPEL DB TOUT LES LIVRES DU USER -> boucle -> save ds etat
const LineDivider = () => {
  return (
    <View style={{ width: 1, paddingVertical: 18 }}>
      <View
        style={{
          flex: 1,
          borderLeftColor: COLORS.lightGray,
          borderLeftWidth: 1,
        }}
      ></View>
    </View>
  );
};

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ExplorerScreen = (props, navigation) => {
  const profileData = {
    name: props.user.username,
    point: 200,
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooks() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books?token=${JSON.parse(
              data
            )}`
          );
          findBooks = await body.json();
          setBooksList(findBooks.books);
        }
        loadBooks();
      }
    });
    wait(1000).then(() => setRefreshing(false));
  };

  /*  useEffect(() => {
    const findBooks = async () => {
      const data = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=j+k+rowling&key%3D=AIzaSyBsEkyjEORPuQYR2d8CbqL2GQv8mnDNPLk&langRestrict=fr`
      );
      const body = await data.json();
      console.log(body, "OUAIS OUAIS OUAIS LAPIII");
    };

    findBooks();
  }, []); */

  /*  const saveAPI = (text) => {
    setMySearch(text);
    props.navigation.navigate("MainBottomBar", {
      screen: "MyProfile",
      text: mySearch,
    });
  }; */

  const [profile, setProfile] = React.useState(profileData);

  const [booksList, setBooksList] = useState([]);
  const [mySearch, setMySearch] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadUser() {
          var user = await fetch(
            `https://backend-dejalu.herokuapp.com/getUser?token=${JSON.parse(
              data
            )}`
          );
          console.log(data, "UTILISATEUR PAGE EXPLO");
        }
        loadUser();
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooks() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books?token=${JSON.parse(
              data
            )}`
          );
          findBooks = await body.json();
          setBooksList(findBooks.books);
        }
        loadBooks();
      }
    });
  }, []);

  function renderHeader(profile) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: SIZES.padding,
          alignItems: "center",
        }}
      >
        {/* Greetings */}
        <View style={{ flex: 1 }}>
          <View style={{ marginRight: SIZES.padding }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Bonjour</Text>
            <Text style={{ ...FONTS.h2, color: COLORS.white }}>
              {profile.name}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Ionicons
            name="ios-book-outline"
            color="white"
            style={{ marginLeft: "70%", fontSize: 50 }}
          ></Ionicons>
        </View>
      </View>
    );
  }

  function renderMyBookSection(booksList) {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: index == 0 ? SIZES.padding : 0,
            marginRight: SIZES.radius,
          }}
          onPress={() =>
            props.navigation.navigate("MainBottomBar", {
              screen: "MyBooks",
            })
          }
        >
          {/* Book Cover */}
          <Image
            source={{
              uri:
                item.cover + `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
            }}
            resizeMode="cover"
            style={{
              width: 180,
              height: 250,
              borderRadius: 20,
            }}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: SIZES.padding,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...FONTS.h2, color: COLORS.white }}>Mes Livres</Text>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyBooks",
              })
            }
          >
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.lightGray,
                alignSelf: "flex-start",
                textDecorationLine: "underline",
              }}
            >
              voir plus
            </Text>
          </TouchableOpacity>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <FlatList
            data={
              booksList.sort((a, b) => a.title.localeCompare(b.title)) &&
              booksList.slice(0, 7)
            }
            renderItem={renderItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Header Section */}

      <View style={{ height: 120 }}>{renderHeader(profile)}</View>
      <GoogleBookSearch
        apikey={"AIzaSyBsEkyjEORPuQYR2d8CbqL2GQv8mnDNPLk"}
        interval={100}
        onResultPress={(book) =>
          props.navigation.navigate("BookDetail", {
            book: book,
          })
        }
      />

      {/* Body Section */}
      <ScrollView
        nestedScrollEnabled={true}
        style={{ marginTop: SIZES.radius }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Books Section */}
        <View style={{ marginTop: "10%" }}>
          {renderMyBookSection(booksList)}
        </View>
        <View style={styles.centeredView1}>
          <Text style={{ ...FONTS.h2, color: COLORS.white, marginLeft: 10 }}>
            Tu as {booksList.length} livres dans ta liste
          </Text>
        </View>
        <View style={styles.centeredView}>
          <Pressable
            style={{ backgroundColor: "#4B230B" }}
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyProfile",
              })
            }
          >
            <Text
              style={{
                color: COLORS.white,
                padding: 15,
              }}
            >
              Détails
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button1: {
    padding: "3%",
    width: "20%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#4B230B",
  },
});

function mapStateToProps(state) {
  return { token: state.token, user: state.user };
}

export default connect(mapStateToProps, null)(ExplorerScreen);

//{renderMyBookSection(myBooks)}
