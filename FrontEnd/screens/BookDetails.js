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

const BookDetail = ({ route, navigation, props }) => {
  const [book, setBook] = React.useState(null);

  const [scrollViewWholeHeight, setScrollViewWholeHeight] = React.useState(1);
  const [scrollViewVisibleHeight, setScrollViewVisibleHeight] =
    React.useState(0);

  const [title, setTitle] = useState(""); //enregistrement du titre du livre dans le store
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date());

  const indicator = new Animated.Value(0);

  React.useEffect(() => {
    let { book } = route.params;
    setBook(book);
    setTitle(book.title);
    if (book.thumbnail) {
      setCover(book.thumbnail);
    } else {
      setCover("https://bibulyon.hypotheses.org/files/2015/08/7_maroquin.png");
    }
    setDescription(book.raw.volumeInfo.description);
    setAuthor(book.raw.volumeInfo.authors);
    console.log(book, "<---- C LA DESCRIPTION");
  }, [book]);

  var saveBookInfosDejaLu = async () => {
    AsyncStorage.getItem("token", async function (error, data) {
      var response = await fetch(
        `https://backend-dejalu.herokuapp.com/new-book-deja-lu?token=${JSON.parse(
          data
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `title=${title}&cover=${cover}&desc=${description}&author=${author}&date=${date}`,
        }
      );
      var resultats = await response.json();
      console.log(resultats, "tessssst ENREGISTREMENT BOOK");
      if (resultats.result === true) {
        alert("Book Stored");
        navigation.navigate("MainBottomBar", {
          screen: "MyBooks",
        });
      }
    });
  };

  var saveBookInfosPasLu = async () => {
    AsyncStorage.getItem("token", async function (error, data) {
      var response = await fetch(
        `https://backend-dejalu.herokuapp.com/new-book-pas-lu?token=${JSON.parse(
          data
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `title=${title}&cover=${cover}&desc=${description}&author=${author}&date=${date}`,
        }
      );
      var resultats = await response.json();
      console.log(resultats, "tessssst ENREGISTREMENT BOOK");
      if (resultats.result === true) {
        alert("Book Stored");
        navigation.navigate("MainBottomBar", {
          screen: "MyBooks",
        });
      }
    });
  };

  function renderBookInfoSection() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: cover }}
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
            backgroundColor: book.backgroundColor,
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
            source={{ uri: cover }}
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
          <Text style={{ ...FONTS.h2, color: COLORS.white }}>{book.title}</Text>
          <Text style={{ ...FONTS.body3, color: COLORS.white }}>
            {book.raw.volumeInfo.authors}
          </Text>
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
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.raw.volumeInfo.authors}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>Author</Text>
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
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.raw.volumeInfo.pageCount}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>
              Number of Page
            </Text>
          </View>

          <LineDivider />

          {/* Language */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ ...FONTS.h3, color: COLORS.white }}>
              {book.raw.volumeInfo.language}
            </Text>
            <Text style={{ ...FONTS.body4, color: COLORS.white }}>
              Language
            </Text>
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
            {book.raw.volumeInfo.description}
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
            backgroundColor: COLORS.lightGreen,
            marginHorizontal: "5%",
            marginVertical: SIZES.base,
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => saveBookInfosDejaLu(title, cover)}
        >
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Déjà lu </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.lightRed,
            marginHorizontal: SIZES.base,
            paddingHorizontal: "3%",
            marginVertical: SIZES.base,
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => saveBookInfosPasLu(title, cover)}
        >
          <Text style={{ ...FONTS.h3, color: COLORS.white }}>Pas lu </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (book) {
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
  } else {
    return <></>;
  }
};

function mapStateToProps(state) {
  return { token: state.token, user: state.user };
}

export default connect(mapStateToProps, null)(BookDetail);
