import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import * as Clipboard from "expo-clipboard";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [... (arr.map(rows => [...rows]))];
}

export default function App() {
  const word = "hello"; // 5-letter answer
  const letters = word.split(""); // ['h', 'e', 'l', 'l', 'o']

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing

  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  const checkGameState = () => {
    if(checkIfWon()) {
      Alert.alert('Hooray', 'You won!', [
        { text: 'Share', onPress: shareScore}, 
      ]);
      setGameState('won');
    } else if (checkIfLost()) {
      Alert.alert("Meh", "Try again tomorrow!");
      setGameState('lost');
    }
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle \n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert("Copied successfully", "Share your score on you social media");
  };

  const checkIfWon = () => {
    const row = rows[currRow - 1];
    return row.every((letter, i) => letter == letters[i])
  };

  const checkIfLost = () => {
    return currRow == rows.length;
  };

  // *** onKeyPressed *** //
  const onKeyPressed = (key) => {
    // console.warn(key);
    if (gameState != 'playing') {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key == CLEAR) {
      const prevCol = currCol - 1;
      if (prevCol >= 0) {
        updatedRows[currRow][prevCol] = "";
        setRows(updatedRows);
        setCurrCol(prevCol);
      }
      return;
    }
    if (key == ENTER) {
      if (currCol == rows[0].length) {
        setCurrRow(currRow + 1);
        setCurrCol(0);
      }
    }
    if (currCol < rows[0].length) {
      updatedRows[currRow][currCol] = key;
      setRows(updatedRows);
      setCurrCol(currCol + 1);
    }
  };

  // *** isCellActive *** //
  const isCellActive = (row, col) => {
    return row == currRow && col == currCol;
  }

  // *** getCellBGColor *** //
  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= currRow) {
      return colors.black;
    }
    if (letter == letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) == color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  // const greenCaps = rows.flatMap((row, i) => 
  //   row.filter((cell, j) => getCellBGColor(i, j) == colors.primary)
  // );

  // const yellowCaps = rows.flatMap((row, i) => 
  //   row.filter((cell, j) => getCellBGColor(i, j) == colors.secondary)
  // );

  // console.log(greenCaps);
  // console.log(yellowCaps);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      {/* 6 rows of 5 cells */}
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
          {row.map((letter, j) => (
            <View 
              key={`cell-${i}-${j}`}
              style={[
                styles.cell, 
                { 
                  borderColor: isCellActive(i, j) 
                    ? colors.lightgrey 
                    : colors.darkgrey,
                  backgroundColor: getCellBGColor(i, j),
                }
              ]}
            >
              <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
            </View>
          ))}
        </View>
        ))}
      </ScrollView>

      <Keyboard 
        onKeyPressed={onKeyPressed} 
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      /> 
    </SafeAreaView>
  );
}


// ***** APP STYLING ***** //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  map: {
    alignSelf: "stretch",
    marginVertical: 20,
    // height: 100,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1, //make cells become square
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  }
});
