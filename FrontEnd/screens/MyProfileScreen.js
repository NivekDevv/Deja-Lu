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
  {
    /* log out */
  }
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
            `http://192.168.1.7:3000/my-books?token=${JSON.parse(data)}`
          );
          findBooks = await body.json();
          setBooksTotal(findBooks.books);
        }
        loadBooks();
        async function loadBooksLu() {
          var body = await fetch(
            `http://192.168.1.7:3000/my-books-lu?token=${JSON.parse(data)}`
          );
          booksDejaLu = await body.json();
          setBooksLu(booksDejaLu.booksLu);
        }
        loadBooksLu();
        async function loadBooksGiven() {
          var body = await fetch(
            `http://192.168.1.7:3000/my-books-given?token=${JSON.parse(data)}`
          );
          findBooks = await body.json();
          setBooksGiven(findBooks.booksGiven);
        }
        loadBooksGiven();
        async function loadBooksPasLu() {
          var body = await fetch(
            `http://192.168.1.7:3000/my-books-pas-lu?token=${JSON.parse(data)}`
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
            `http://192.168.1.7:3000/my-books?token=${JSON.parse(data)}`
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
            `http://192.168.1.7:3000/my-books-lu?token=${JSON.parse(data)}`
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
            `http://192.168.1.7:3000/my-books-given?token=${JSON.parse(data)}`
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
            `http://192.168.1.7:3000/my-books-pas-lu?token=${JSON.parse(data)}`
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
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: COLORS.black,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: COLORS.white, ...FONTS.h1 }}>Statistiques</Text>
      <ScrollView
        style={{ marginTop: "40%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
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
        <Button style={{ marginTop: "60%" }} onPress={() => clearAllData()}>
          <Text style={{ ...FONTS.h1, color: COLORS.primary }}>LOGOUT</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyProfileScreen;
