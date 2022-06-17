import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { FONTS, COLORS, SIZES, icons } from "../constants";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LineDivider = () => {
  return (
    <View style={{ width: 1, paddingVertical: 5 }}>
      <View
        style={{
          flex: 1,
          borderLeftColor: COLORS.lightGray2,
          borderLeftWidth: 1,
        }}
      ></View>
    </View>
  );
};

const DetailsGiven = ({ route, navigation, props }) => {
  const [scrollViewWholeHeight, setScrollViewWholeHeight] = React.useState(1);
  const [scrollViewVisibleHeight, setScrollViewVisibleHeight] =
    React.useState(0);

  const [title, setTitle] = useState(""); //enregistrement du titre du livre dans le store
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [bookId, setBookId] = useState("");
  const [myBooks, setMyBooks] = useState([]);
  const indicator = new Animated.Value(0);
  const [itemLu, setItemLu] = useState("");

  React.useEffect(() => {
    let { bookLuGiven } = route.params;
    setTitle(bookLuGiven.title);
    setCover(bookLuGiven.cover);
    setAuthor(bookLuGiven.author);
    setBookId(bookLuGiven._id);
    setDescription(bookLuGiven.description);
    console.log(bookLuGiven.cover, "<---- C MON ITEM");
  }, []);

  /*   useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooksLu() {
          var findBooks = await fetch(
            `http://192.168.1.7:3000/my-booksLu?token=${JSON.parse(data)}`
          );
          books = await findBooks.json();
          console.log(books.booksLu, "le book LU de l'utilisateur");
          setMyBooks(books.booksLu);
        }
        loadBooksLu();
      }
    });
  }, []); */

  var saveBookInfosDonne = async () => {
    var response = await fetch(
      `http://192.168.1.7:3000/change-status-donne?bookId=${bookId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    var resultats = await response.json();
    console.log(resultats, "tessssst Changement de status");
    alert("Livre désormais donné");
    navigation.navigate("MainBottomBar", {
      screen: "MyBooks",
    });
  };

  var saveBookInfosDelete = async () => {
    var response = await fetch(
      `http://192.168.1.7:3000/delete-book-lu?bookId=${bookId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    alert("Livre supprimé !");
    navigation.navigate("MainBottomBar", {
      screen: "MyBooks",
    });
  };

  function renderBookInfoSection() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{
            uri: cover + `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
          }}
          resizeMode="cover"
          blurRadius={1}
          style={{
            position: "absolute",
            top: 100,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />

        {/* Color Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            // backgroundColor: book.backgroundColor,
          }}
        ></View>

        {/* Navigation header */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: SIZES.radius,
            height: 80,
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: SIZES.base }}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={icons.back_arrow_icon}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: "white",
              }}
            />
          </TouchableOpacity>

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ ...FONTS.h3, color: "white" }}>Book Detail</Text>
          </View>

          <TouchableOpacity
            style={{ marginRigth: SIZES.base }}
            onPress={() => console.log("Click More")}
          >
            <Image
              source={icons.more_icon}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: "white",
                alignSelf: "flex-end",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Book Cover */}
        <View
          style={{
            flex: 5,
            paddingTop: SIZES.padding2,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            source={{
              uri: cover + `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
            }}
            resizeMode="contain"
            style={{
              flex: 1,
              width: 150,
              height: "auto",
            }}
          />
        </View>

        {/* Book Name and Author */}
        <View
          style={{ flex: 1.8, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ ...FONTS.h2, color: COLORS.white }}>{title}</Text>
          <Text style={{ ...FONTS.body3, color: COLORS.white }}>{author}</Text>
        </View>

        {/* Book Info */}
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 20,
            margin: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          {/* Rating */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Author</Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>
              {author}
            </Text>
          </View>

          <LineDivider />

          {/* Pages */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: SIZES.radius,
              alignItems: "center",
            }}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Déjà lu ?</Text>
            <Text style={{ ...FONTS.body4, color: COLORS.lightGreen }}>
              Oui
            </Text>
          </View>
          <LineDivider />
          <View
            style={{
              flex: 1,
              paddingHorizontal: SIZES.radius,
              alignItems: "center",
            }}
          >
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>Donné ?</Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>Oui</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderBookDescription() {
    const indicatorSize =
      scrollViewWholeHeight > scrollViewVisibleHeight
        ? (scrollViewVisibleHeight * scrollViewVisibleHeight) /
          scrollViewWholeHeight
        : scrollViewVisibleHeight;

    const difference =
      scrollViewVisibleHeight > indicatorSize
        ? scrollViewVisibleHeight - indicatorSize
        : 1;

    return (
      <View style={{ flex: 1, flexDirection: "row", padding: SIZES.padding }}>
        {/* Custom Scrollbar */}
        <View
          style={{ width: 4, height: "100%", backgroundColor: COLORS.gray1 }}
        >
          <Animated.View
            style={{
              width: 4,
              height: indicatorSize,
              backgroundColor: COLORS.lightGray4,
              transform: [
                {
                  translateY: Animated.multiply(
                    indicator,
                    scrollViewVisibleHeight / scrollViewWholeHeight
                  ).interpolate({
                    inputRange: [0, difference],
                    outputRange: [0, difference],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          />
        </View>

        {/* Description */}
        <ScrollView
          contentContainerStyle={{ paddingLeft: SIZES.padding2 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onContentSizeChange={(width, height) => {
            setScrollViewWholeHeight(height);
          }}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            setScrollViewVisibleHeight(height);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: indicator } } }],
            { useNativeDriver: false }
          )}
        >
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.white,
              marginBottom: SIZES.padding,
            }}
          >
            Description
          </Text>
          <Text style={{ ...FONTS.body2, color: COLORS.lightGray }}>
            {description}
          </Text>
        </ScrollView>
      </View>
    );
  }

  function renderBottomButton() {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Bookmark */}

        {/* Start Reading */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: COLORS.lightRed,
            marginHorizontal: "5%",
            marginVertical: SIZES.base,
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => saveBookInfosDelete(title, cover)}
        >
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Book Cover Section */}
      <View style={{ flex: 4 }}>{renderBookInfoSection()}</View>

      {/* Description */}
      <View style={{ flex: 2 }}>{renderBookDescription()}</View>

      {/* Buttons */}
      <View style={{ height: 70, marginBottom: 30 }}>
        {renderBottomButton()}
      </View>
    </View>
  );
};

function mapStateToProps(state) {
  return { token: state.token, user: state.user };
}

export default connect(mapStateToProps, null)(DetailsGiven);
