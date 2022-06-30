import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Restart } from "fiction-expo-restart";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function MyProfileScreen(props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [booksTotal, setBooksTotal] = useState([]);
  const [booksLu, setBooksLu] = useState([]);
  const [booksFalse, setBooksFalse] = useState([]);
  const [booksGiven, setBooksGiven] = useState([]);

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
          setBooksTotal(findBooks.books);
        }
        loadBooks();
        async function loadBooksLu() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-lu?token=${JSON.parse(
              data
            )}`
          );
          booksDejaLu = await body.json();
          setBooksLu(booksDejaLu.booksLu);
        }
        loadBooksLu();
        async function loadBooksGiven() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-given?token=${JSON.parse(
              data
            )}`
          );
          findBooks = await body.json();
          setBooksGiven(findBooks.booksGiven);
        }
        loadBooksGiven();
        async function loadBooksPasLu() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-pas-lu?token=${JSON.parse(
              data
            )}`
          );
          booksPasLu = await body.json();
          console.log(booksPasLu, "les livres que je n'ai pas lu");
          setBooksFalse(booksPasLu.booksNonLu);
        }
        loadBooksPasLu();
      }
    });
    wait(1000).then(() => setRefreshing(false));
  };

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
          setBooksTotal(findBooks.books);
        }
        loadBooks();
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooksLu() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-lu?token=${JSON.parse(
              data
            )}`
          );
          booksDejaLu = await body.json();
          setBooksLu(booksDejaLu.booksLu);
        }
        loadBooksLu();
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooksGiven() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-given?token=${JSON.parse(
              data
            )}`
          );
          findBooks = await body.json();
          setBooksGiven(findBooks.booksGiven);
        }
        loadBooksGiven();
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadBooksPasLu() {
          var body = await fetch(
            `https://backend-dejalu.herokuapp.com/my-books-pas-lu?token=${JSON.parse(
              data
            )}`
          );
          booksPasLu = await body.json();
          console.log(booksPasLu, "les livres que je n'ai pas lu");
          setBooksFalse(booksPasLu.booksNonLu);
        }
        loadBooksPasLu();
      }
    });
  }, []);

  var clearAllData = () => {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => alert("Logout success"));
    Restart();
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      nestedScrollEnabled={true}
    >
      <SafeAreaView
        style={{
          display: "flex",
          flex: 1,
          backgroundColor: COLORS.black,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.white, ...FONTS.h1, marginTop: 60 }}>
          Statistiques
        </Text>

        <Text style={{ color: COLORS.white, ...FONTS.h3, marginTop: "40%" }}>
          Tu as {booksTotal.length} livres au total dans ta liste !
        </Text>
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
          Tu as {booksLu.length} livres déjà-lu !
        </Text>
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
          Tu as {booksFalse.length} livres non-lu !
        </Text>
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
          Et tu as donné {booksGiven.length} livres !
        </Text>
        <Button
          style={{ paddingBottom: 500, marginTop: 40 }}
          onPress={() => clearAllData()}
        >
          <Text style={{ ...FONTS.h1, color: COLORS.primary }}>
            Déconnexion
          </Text>
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
}

export default MyProfileScreen;
