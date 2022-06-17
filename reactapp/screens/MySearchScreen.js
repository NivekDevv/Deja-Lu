import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FONTS, COLORS, SIZES, icons } from "../constants";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { GoogleBookSearch } from "react-native-google-books";
function MySearchScreen({ route, navigation }) {
  const [books, setBooks] = React.useState("");

  React.useEffect(() => {
    let { book } = route.params;
    setBooks(book);
    console.log(books, "etat books");
  }, [books]);

  return (
    //HEADER//
    <View style={{ backgroundColor: COLORS.black, height: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: SIZES.radius,
          height: 80,
          marginTop: 5,
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: SIZES.base }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={icons.back_arrow_white}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ ...FONTS.h3, color: "white" }}>My Search</Text>
        </View>
      </View>
      {/*RESULTATS*/}
      <View
        style={{
          flex: 1,
          marginTop: "7%",

          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            marginBottom: "10%",
          }}
        >
          LES RESULTATS DE LA RECHERCHE{" "}
        </Text>
        <Image
          source={{ uri: books.thumbnail }}
          style={{
            width: 100,
            height: 150,
            borderRadius: 20,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00C7CA",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MySearchScreen;
