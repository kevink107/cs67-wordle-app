import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";
import Keyboard from "../Keyboard";
import * as Clipboard from 'expo-clipboard';

const NUMBER_OF_TRIES = 6;

// Returns a copy of the passed-in array
const copyArray = (arr) => {
  return [... (arr.map(rows => [...rows]))];
}

// Array of words that are randomly selected for the game
const words = ["world", "would", "hello", "words", "large", "write", "first", "water", "space", 
              "night", "earth", "think", "young", "aback", "amber", "brick", "bulky", "cargo", 
              "clone", "cobra", "clock", "felon", "igloo", "angle", "union", "zebra", "opera", 
              "index", "coach", "smart", "mercy", "frost", "diver", "pearl", "train", "adieu", 
              "wrath", "shark", "tempo", "crime", "organ", "mayor", "yield", "ideal", "sword"];

// Generate random word from the array above
const randomIndex = Math.floor(Math.random() * words.length);
const word = words[randomIndex];
const letters = word.split("");

// ***** GAME ***** //
const Game = () => {
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
    
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing

  // Updates the game state when the row changes
  useEffect(() => {
    if (currRow > 0) {
      checkGameState();
    }
  }, [currRow]);

  // *** checkGameState *** //
  // Handles alerts and updates game states 
  const checkGameState = () => {
    if(checkIfWon() && gameState != 'won') {
      Alert.alert('Hooray', 'You won!', [
        { text: 'Share', onPress: shareScore}, 
      ]);
      setGameState('won');
    } else if (checkIfLost() && gameState != 'lost') {
      Alert.alert("Meh", "Try again tomorrow!");
      setGameState('lost');
    }
  };

  // *** shareScore *** //
  // Alerts user that their score has been copied to their clipboard to share
  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      )
      .filter((row) => row)
      .join("\n");
    const textShare = `Wordle \n${textMap}`;
    Clipboard.setString(textShare);
    Alert.alert("Copied to clipboard", "Share your score");
  };

  // *** checkIfWon *** //
  // Check if the user has won
  const checkIfWon = () => {
    const row = rows[currRow - 1];
    return row.every((letter, i) => letter == letters[i])
  };

  // *** checkIfLost *** //
  // Check if the user has lost
  const checkIfLost = () => {
    return !checkIfWon() && currRow == rows.length;
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
    if (key === ENTER) {
      if (rows[currRow].every((letter) => letter !== "")) {
        if (currCol === rows[0].length) {
          setCurrRow(currRow + 1);
          setCurrCol(0);
        }
      } else {
        return;
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
  // Determines the color of the cells in the game
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

  // *** getAllLettersWithColor *** //
  // Gets each of the letters with a particular color to assign them on keyboard
  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) == color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  return (
    <>
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
    </>
  );
}


// ***** STYLING ***** //
const styles = StyleSheet.create({
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
  },

});

export default Game;