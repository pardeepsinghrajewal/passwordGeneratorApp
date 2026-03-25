/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect, useMemo, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { StyleSheet, useColorScheme, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Clipboard from "@react-native-clipboard/clipboard";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Toast from "react-native-toast-message";

import HapticFeedback from "react-native-haptic-feedback";

const HapticFeedbackOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

Toast.show({
    type: "success",
    text1: "Copied!",
    visibilityTime: 2000,
    autoHide: true,
});

function App() {
    const isDarkMode = useColorScheme() === "dark";
    const [password, setPassword] = useState<string>("");
    const [lengthOfPassword, setLengthOfPassword] = useState<number>(10);

    const [isLowerCaseChecked, setIsLowerCaseChecked] = useState<boolean>(true);

    const [isUpperCaseChecked, setIsUpperCaseChecked] = useState<boolean>(false);

    const [isNumberChecked, setIsNumberChecked] = useState<boolean>(false);

    const [isSymbolsChecked, setIsSymbolsChecked] = useState<boolean>(false);

    const [errorMsg, setErrorMsg] = useState<string>("");

    const generatePassword = () => {
        let passwordArr: string[] = [];
        let text = "";
        let enabledOptionsCount = 0;

        const lowerCase = "abcdefghijklmnopqrstuvwxyz";

        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const numbers = "1234567890";

        const symbols = "!@#$%^&*()_+";

        const addToPasswordStr = (str: string) => {
            for (let i = 0; i < 2; i++) {
                let index = Math.floor(Math.random() * str.length - 1 + 1);
                passwordArr.push(str[index]);
            }
        };

        if (isLowerCaseChecked) {
            addToPasswordStr(lowerCase);
            text += lowerCase;
            enabledOptionsCount++;
        }
        if (isUpperCaseChecked) {
            addToPasswordStr(upperCase);
            text += upperCase;
            enabledOptionsCount++;
        }
        if (isNumberChecked) {
            addToPasswordStr(numbers);
            text += numbers;
            enabledOptionsCount++;
        }
        if (isSymbolsChecked) {
            addToPasswordStr(symbols);
            text += symbols;
            enabledOptionsCount++;
        }

        for (let i = 0; i < lengthOfPassword - enabledOptionsCount * 2; i++) {
            let index = Math.floor(Math.random() * text.length - 1 + 1);
            passwordArr.push(text[index]);
        }
        passwordArr = passwordArr.sort(() => Math.random() - 0.5);

        setPassword(passwordArr.join(""));
        HapticFeedback.trigger("impactMedium", HapticFeedbackOptions);
    };

    const isOtherOptionsAreDisabled = (value: string): boolean => {
        let enabledCount = 0;

        if (value == "lowerCase") {
            enabledCount = Number(isUpperCaseChecked) + Number(isNumberChecked) + Number(isSymbolsChecked);
        }
        if (value == "upperCase") {
            enabledCount = Number(isLowerCaseChecked) + Number(isNumberChecked) + Number(isSymbolsChecked);
        }
        if (value == "number") {
            enabledCount = Number(isLowerCaseChecked) + Number(isUpperCaseChecked) + Number(isSymbolsChecked);
        }
        if (value == "symbols") {
            enabledCount = Number(isLowerCaseChecked) + Number(isUpperCaseChecked) + Number(isNumberChecked);
        }

        if (enabledCount == 0) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Select at least one option",
            });
            return true;
        } else {
            setErrorMsg("");
            return false;
        }
    };

    useEffect(() => {
        generatePassword();
    }, [lengthOfPassword, isLowerCaseChecked, isUpperCaseChecked, isNumberChecked, isSymbolsChecked]);

    const copyToClipboard = () => {
        if (password) {
            Clipboard.setString(password);
            setErrorMsg("Copied to clipboard!");

            Toast.show({
                type: "success",
                text1: "Copied!",
                text2: "Password copied!!",
            });
            HapticFeedback.trigger("impactMedium", HapticFeedbackOptions);
        }
    };

    const theme = {
        light: {
            background: "#FFFFFF",
            surface: "#F5F5F5",
            textPrimary: "#000000",
            textSecondary: "#666666",
            btnBackground: "#66d492",
            btnColor: "#F9FAFB",
        },
        dark: {
            background: "#121212",
            surface: "#1E1E1E",
            textPrimary: "#FFFFFF",
            textSecondary: "#BBBBBB",
            btnBackground: "#66d492",
            btnColor: "#111827",
        },
    };

    const getStyles = (currentTheme: typeof theme.light) =>
        StyleSheet.create({
            container: {
                flex: 1,
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: currentTheme.background,
            },
            innerWrapper: {
                flexDirection: "row",
                marginVertical: 15,
            },
            txt: {
                color: currentTheme.textPrimary,
            },
            passwordWrapper: {
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 10,
            },
            passwordTxt: {
                backgroundColor: currentTheme.surface,
                color: currentTheme.textPrimary,
                marginRight: 10,
                marginLeft: 10,
                fontWeight: "bold",
                paddingHorizontal: 14,
                paddingVertical: 8,
            },
            btn: {
                backgroundColor: currentTheme.btnBackground,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 6,
                marginRight: 10,
            },
            btnTxt: {
                color: currentTheme.btnColor,
                fontWeight: "600",
            },
        });

    const currentTheme = isDarkMode ? theme.dark : theme.light;
    const styles = useMemo(() => getStyles(currentTheme), [currentTheme]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View>
                    <Text style={styles.txt}>Password length : {lengthOfPassword}</Text>
                    <Slider
                        value={Number(lengthOfPassword)}
                        minimumValue={8}
                        maximumValue={24}
                        step={1}
                        onValueChange={([val]) => {
                            //setLengthOfPassword(val);
                        }}
                        onSlidingComplete={([val]) => {
                            setLengthOfPassword(val);
                        }}
                    />
                </View>

                <View style={styles.innerWrapper}>
                    <BouncyCheckbox
                        useBuiltInState={false}
                        isChecked={isLowerCaseChecked}
                        size={25}
                        fillColor={currentTheme.btnBackground}
                        innerIconStyle={{ borderWidth: 2 }}
                        onPress={(isChecked: boolean) => {
                            if (!isOtherOptionsAreDisabled("lowerCase")) {
                                setIsLowerCaseChecked(!isLowerCaseChecked);
                            }
                        }}
                    />
                    <Text style={styles.txt}>Include lowercase</Text>
                </View>

                <View style={styles.innerWrapper}>
                    <BouncyCheckbox
                        useBuiltInState={false}
                        isChecked={isUpperCaseChecked}
                        size={25}
                        fillColor={currentTheme.btnBackground}
                        innerIconStyle={{ borderWidth: 2 }}
                        onPress={(isChecked: boolean) => {
                            if (!isOtherOptionsAreDisabled("upperCase")) {
                                setIsUpperCaseChecked(!isUpperCaseChecked);
                            }
                        }}
                    />
                    <Text style={styles.txt}>Include uppercase</Text>
                </View>

                <View style={styles.innerWrapper}>
                    <BouncyCheckbox
                        useBuiltInState={false}
                        isChecked={isNumberChecked}
                        size={25}
                        fillColor={currentTheme.btnBackground}
                        innerIconStyle={{ borderWidth: 2 }}
                        onPress={(isChecked: boolean) => {
                            if (!isOtherOptionsAreDisabled("number")) {
                                setIsNumberChecked(!isNumberChecked);
                            }
                        }}
                    />
                    <Text style={styles.txt}>Include numbers</Text>
                </View>

                <View style={styles.innerWrapper}>
                    <BouncyCheckbox
                        useBuiltInState={false}
                        isChecked={isSymbolsChecked}
                        size={25}
                        fillColor={currentTheme.btnBackground}
                        innerIconStyle={{ borderWidth: 2 }}
                        onPress={(isChecked: boolean) => {
                            if (!isOtherOptionsAreDisabled("symbols")) {
                                setIsSymbolsChecked(!isSymbolsChecked);
                            }
                        }}
                    />
                    <Text style={styles.txt}>Include special characters</Text>
                </View>

                <View>
                    {password && (
                        <View>
                            <View style={styles.passwordWrapper}>
                                <Text style={styles.txt}>Password : </Text>
                                <Text selectable={true} style={styles.passwordTxt}>
                                    {password}
                                </Text>
                            </View>
                            <View style={styles.passwordWrapper}>
                                <TouchableOpacity onPress={copyToClipboard} style={styles.btn}>
                                    <Text style={styles.btnTxt}>Copy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={generatePassword} style={styles.btn}>
                                    <Text style={styles.btnTxt}>Re-generate</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            <Toast position="top" />
        </SafeAreaView>
    );
}

export default App;
