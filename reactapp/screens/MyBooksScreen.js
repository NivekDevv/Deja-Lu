import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "react-native-dynamic-search-bar";
import { Ionicons } from "@expo/vector-icons";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function MyBooksScreen(props) {
  /*   useEffect(() => {
    const findBooks = async () => {
      const books = await fetch(
        `http://192.168.1.7:3000/my-books/${props.token}`
      );
      const body = await books.json();
      console.log(body);
    };
    findBooks();
  }, []); */
  const [refreshing, setRefreshing] = React.useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const onRefresh = () => {
    setRefreshing(true);
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadUser() {
          var findBooks = await fetch(
            `http://192.168.1.7:3000/my-books?token=${JSON.parse(data)}`
          );
          books = await findBooks.json();
          console.log(books.books, "les books de l'utilisateur");
          setMyBooks(books.books);
        }
        loadUser();
      }
    });
    wait(1000).then(() => setRefreshing(false));
  };

  const [filterdData, setFilterdData] = useState([]);
  const [search, setSearch] = useState("");

  /*   const bookClicked = () => {
    setTitleClicked(item.title);
    props.navigation.navigate("DetailsLu", { titleClicked: titleClicked });
  }; */

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadUser() {
          var findBooks = await fetch(
            `http://192.168.1.7:3000/my-books?token=${JSON.parse(data)}`
          );
          books = await findBooks.json();
          console.log(books.books, "les books de l'utilisateur");
          setMyBooks(books.books);
          setFilterdData(books.books);
        }
        loadUser();
      }
    });
  }, []);

  const searchFilter = (text) => {
    if (text) {
      const newData = filterdData.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const authorData = item.author
          ? item.author.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();

        return (
          itemData.indexOf(textData) > -1 || authorData.indexOf(textData) > -1
        );
      });
      setMyBooks(newData);
      setSearch(text);
    } else {
      setMyBooks(filterdData);
      setSearch(text);
    }
  };

  function renderHeader() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: SIZES.padding,
          alignItems: "center",
          marginBottom: -20,
        }}
      >
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={{
                ...FONTS.h1,
                color: COLORS.white,
                marginLeft: "23%",
              }}
            >
              My Books List
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function renderMyBooks(myBooks) {
    const renderItem = ({ item, index }) => {
      const bookClicked = () => {
        props.navigation.navigate("DetailsAllList", {
          bookAllClicked: item,
        });
      };
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: 7,
            marginRight: SIZES.radius,
          }}
          onPress={(item) => bookClicked(item)}
        >
          {/* Book Cover */}
          <Image
            source={{
              uri:
                item.cover + `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
            }}
            resizeMode="cover"
            style={{
              width: 120,
              height: 190,
              borderRadius: 20,
            }}
          />
          <Text
            numberOfLines={1}
            style={{ color: COLORS.white, alignItems: "center", width: 150 }}
          >
            {item.title}
          </Text>
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
          <Text
            style={{ ...FONTS.h2, color: COLORS.lightGray3, marginTop: 15 }}
          >
            Ma liste de livres
          </Text>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyBooks",
              })
            }
          ></TouchableOpacity>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <FlatList
            data={myBooks.sort((a, b) => b.date > a.date)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  function renderMyBookDejaLu(myBooks) {
    const renderItem = ({ item, index }) => {
      const bookClicked = () => {
        console.log(item, "PIAOIASPOIADPO");
        props.navigation.navigate("DetailsLu", {
          bookLuClicked: item,
        });
      };
      if (item.dejalu === "true") {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 7,
              marginRight: SIZES.radius,
            }}
            onPress={(item) => bookClicked(item)}
          >
            {/* Book Cover */}
            <Image
              source={{
                uri:
                  item.cover +
                  `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
              }}
              resizeMode="cover"
              style={{
                width: 180,
                height: 250,
                borderRadius: 20,
              }}
            />
            <Text
              numberOfLines={1}
              style={{ color: COLORS.white, alignItems: "center", width: 150 }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }
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
          <Text
            style={{ ...FONTS.h2, color: COLORS.lightGreen, marginTop: 30 }}
          >
            Déjà-Lu
          </Text>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyBooks",
              })
            }
          ></TouchableOpacity>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <FlatList
            data={myBooks.sort((a, b) => b.date > a.date)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  function renderMyBookPasLu(myBooks) {
    const renderItem = ({ item, index }) => {
      const bookClicked = () => {
        console.log(item, "PIAOIASPOIADPO");
        props.navigation.navigate("DetailsPasLu", {
          bookPasLuClicked: item,
        });
      };
      if (item.dejalu === "false") {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 7,
              marginRight: SIZES.radius,
            }}
            onPress={(item) => bookClicked(item)}
          >
            {/* Book Cover */}
            <Image
              source={{
                uri:
                  item.cover +
                  `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
              }}
              resizeMode="cover"
              style={{
                width: 180,
                height: 250,
                borderRadius: 20,
              }}
            />
            <Text
              numberOfLines={1}
              style={{ color: COLORS.white, alignItems: "center", width: 150 }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }
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
          <Text style={{ ...FONTS.h2, color: COLORS.lightRed, marginTop: 20 }}>
            Pas-Lu
          </Text>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyBooks",
              })
            }
          ></TouchableOpacity>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <FlatList
            data={myBooks.sort((a, b) => b.date > a.date)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item._id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  function renderMyBookGiven(myBooks) {
    const renderItem = ({ item, index }) => {
      const bookClicked = () => {
        console.log(item, "PIAOIASPOIADPO");
        props.navigation.navigate("DetailsGiven", {
          bookLuGiven: item,
        });
      };
      if (item.dejalu === "donné") {
        return (
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 7,
              marginRight: SIZES.radius,
            }}
            onPress={(item) => bookClicked(item)}
          >
            {/* Book Cover */}
            <Image
              source={{
                uri:
                  item.cover +
                  `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
              }}
              resizeMode="cover"
              style={{
                width: 180,
                height: 250,
                borderRadius: 20,
              }}
            />
            <Text
              numberOfLines={1}
              style={{ color: COLORS.white, alignItems: "center", width: 150 }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }
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
          <Text style={{ ...FONTS.h2, color: "orange", marginTop: 20 }}>
            Donné
          </Text>

          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("MainBottomBar", {
                screen: "MyBooks",
              })
            }
          ></TouchableOpacity>
        </View>

        {/* Books */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <FlatList
            data={myBooks.sort((a, b) => b.date > a.date)}
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
      <View style={{ height: 85 }}>{renderHeader()}</View>
      <SearchBar
        value={search}
        placeholder="Rechercher un livre"
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          marginBottom: 10,
        }}
        onChangeText={(text) => searchFilter(text)}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        nestedScrollEnabled={true}
      >
        {/* Books Section */}
        <View>{renderMyBooks(myBooks)}</View>
        <View>{renderMyBookDejaLu(myBooks)}</View>
        <View>{renderMyBookPasLu(myBooks)}</View>
        <View>{renderMyBookGiven(myBooks)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return { token: state.token, user: state.user };
}

export default connect(mapStateToProps, null)(MyBooksScreen);
