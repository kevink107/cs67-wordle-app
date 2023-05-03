import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import Keyboard from './src/components/Keyboard';
import { colors, CLEAR, ENTER } from './src/constants';
import { useState } from 'react';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...(arr.map(rows => [...rows]))];
}

export default function App() {
  const word = "hello"; // five letters
  const letters = word.split(''); // ['h', 'e', 'l', 'l', 'o']

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);

  // when letter key is pressed
  const onKeyPressed = (key) => {
    // console.warn(key);
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

  const isCellActive = (row, col) => {
    return row == currRow && col == currCol;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      {/* 6 rows of 5 cells */}
      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
          {row.map((cell, j) => (
            <View 
              key={`cell-${i}-${j}`}
              style={[
                styles.cell, 
                { 
                  borderColor: isCellActive(i, j) 
                    ? colors.lightgrey 
                    : colors.darkgrey
                }
              ]}
            >
              <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
            </View>
          ))}
        </View>
        ))}
      </ScrollView>

      <Keyboard onKeyPressed={onKeyPressed}/> 
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
    height: 100,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 2,
    borderColor: colors.grey,
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
