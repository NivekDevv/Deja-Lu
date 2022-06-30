import React, { useState, useEffect } from "react";
//import RNRestart from "react-native-restart";
import { Restart } from "fiction-expo-restart";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { COLORS, FONTS, SIZES, icons, images } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { IconButton } from "react-native-paper";

const BackGround = {
  uri: "https://www.zupimages.net/up/22/13/ko4c.jpg",
};

function HomeScreen(props) {
  {
    /* ETATS MODALS */
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  {
    /* ETATS SIGN UP/SIGN IN */
  }
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [userExists, setUserExists] = useState(false);

  {
    /* ETATS ERRORS */
  }
  const [listErrorsSignin, setErrorsSignin] = useState([]);
  const [listErrorsSignup, setErrorsSignup] = useState([]);

  const [pseudoIsSubmited, setPseudoIsSubmited] = useState(false);
  var handleSubmitSignup = async () => {
    const data = await fetch(`https://backend-dejalu.herokuapp.com/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`,
    });

    const body = await data.json();

    if (body.result == true) {
      props.addToken(body.token);
      props.userInfo(body.saveUser);
      AsyncStorage.setItem("token", JSON.stringify(body.token));
      setModalVisible2(!modalVisible2);
      props.navigation.navigate("MainBottomBar", {
        screen: "ExplorerScreen",
      });
    } else {
      setErrorsSignup(body.error);
    }
  };

  var handleSubmitSignin = async () => {
    const data = await fetch(`https://backend-dejalu.herokuapp.com/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    });

    const body = await data.json();

    if (body.result === true) {
      props.addToken(body.token);
      props.userInfo(body.user);
      AsyncStorage.setItem("token", JSON.stringify(body.token));
      console.log(body.token, "BODY.USER");
      setModalVisible(!modalVisible);
      setUserExists(true);
      props.navigation.navigate("MainBottomBar", {
        screen: "ExplorerScreen",
      });
    } else {
      setErrorsSignin(body.error);
    }
  };

  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return (
      <Text key={i} style={{ color: "red" }}>
        Error: {error} !
      </Text>
    );
  });

  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return (
      <Text key={i} style={{ color: "red" }}>
        Error: {error} !
      </Text>
    );
  });

  var clearAllData = () => {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => alert("Disconnected"));
    Restart();
  };

  useEffect(() => {
    AsyncStorage.getItem("token", function (error, data) {
      if (data) {
        async function loadUser() {
          var user = await fetch(
            `https://backend-dejalu.herokuapp.com/getUser?token=${JSON.parse(
              data
            )}`
          );
          user = await user.json();
          console.log(user, "oui ouioui");
          props.userInfo(user);
          setPseudoIsSubmited(true);
        }
        loadUser();
      }
    });
  }, []);

  if (!pseudoIsSubmited) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackGround}
          resizeMode="cover"
          style={styles.image}
        >
          <Text
            style={{
              ...FONTS.home1,
              color: COLORS.white,
              marginLeft: "3%",
              width: "100%",
              position: "absolute",
              top: 150,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            Welcome to Déjà-lu
          </Text>
          <View style={{ paddingTop: "10%" }}>
            <Text style={styles.text3}>Do you have an account?</Text>
            {/* MODAL CONNECTION */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView2}>
                  <Text style={styles.modalText}>Email</Text>
                  <Input
                    placeholder="Your Email"
                    style={{ width: "40%" }}
                    onChangeText={(val) => setSignInEmail(val)}
                  ></Input>
                  <Text style={styles.modalText2}>Password</Text>
                  <Input
                    type="password"
                    placeholder="Your password"
                    style={{ width: "40%" }}
                    onChangeText={(val) => setSignInPassword(val)}
                  ></Input>

                  {tabErrorsSignin}
                  <Pressable
                    style={[styles.button2, styles.buttonClose]}
                    onPress={() => handleSubmitSignin()}
                  >
                    <Text style={styles.textStyle}>Login</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <Pressable
              style={[styles.button, styles.buttonOpen, COLORS.lightGray]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>Sign In</Text>
            </Pressable>

            <Text style={styles.text2}>New comer?</Text>
            {/* MODAL INSCRIPTION */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible2(!modalVisible2);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView1}>
                  <Text style={styles.modalText}>Username</Text>
                  <Input
                    placeholder="Your username"
                    leftIcon={{ type: "font-awesome", name: "user" }}
                    style={{ width: "40%" }}
                    onChangeText={(val) => setSignUpUsername(val)}
                  ></Input>
                  <Text style={styles.modalText2}>Password</Text>
                  <Input
                    placeholder="Your password"
                    leftIcon={{ type: "font-awesome", name: "lock" }}
                    secureTextEntry={true}
                    style={{ width: "40%" }}
                    onChangeText={(val) => setSignUpPassword(val)}
                  ></Input>

                  <Text style={styles.modalText2}>Email</Text>
                  <Input
                    placeholder="Your email"
                    leftIcon={{ type: "font-awesome", name: "envelope" }}
                    style={{ width: "40%" }}
                    onChangeText={(val) => setSignUpEmail(val)}
                  ></Input>
                  {tabErrorsSignup}
                  <Pressable
                    style={[styles.button2, styles.buttonClose]}
                    onPress={() => handleSubmitSignup()}
                  >
                    <Text style={styles.textStyle}>Register</Text>
                  </Pressable>
                  <Text style={styles.modalText3}>
                    “La lecture commence les yeux fermés.”
                  </Text>
                  <Text style={styles.modalText4}>Yvon Rivard</Text>
                </View>
              </View>
            </Modal>
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible2(true)}
            >
              <Text style={styles.textStyle}>Register</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackGround}
          resizeMode="cover"
          style={styles.image}
        >
          <Text
            style={{
              ...FONTS.home1,
              color: COLORS.white,
              marginLeft: "15%",
              width: "70%",
              position: "absolute",
              top: 100,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            Welcome Back
          </Text>
          <View style={{ paddingTop: "10%" }}>
            <Pressable
              style={[styles.button, styles.buttonOpen, COLORS.lightGray]}
              onPress={() =>
                props.navigation.navigate("MainBottomBar", {
                  screen: "ExplorerScreen",
                })
              }
            >
              <Text style={styles.textStyle}>Enter</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text2: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  text3: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 400,
  },
  button1: {
    padding: "3%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView1: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 400,
    height: 550,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 400,
    height: 350,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 380,
    marginLeft: 15,
  },
  button2: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 380,
  },
  buttonOpen: {
    backgroundColor: "#4B230B",
  },
  buttonClose: {
    backgroundColor: "#4B230B",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Roboto-BoldItalic",
  },
  modalText2: {
    marginTop: 15,
    marginBottom: 15,
    fontFamily: "Roboto-BoldItalic",
    textAlign: "center",
  },
  modalText3: {
    marginTop: 30,
    marginBottom: 5,
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Roboto-Italic",
  },
  modalText4: {
    fontStyle: "italic",
    textAlign: "center",
    fontSize: 8,
    marginLeft: 170,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({ type: "addToken", token: token });
    },
    userInfo: function (user) {
      dispatch({ type: "userInfo", user: user });
    },
  };
}
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
