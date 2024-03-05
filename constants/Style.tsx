import { StyleSheet } from "react-native"
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const dynamicWidth = screenWidth * 0.9;


export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: '5%'
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  button: {
    margin: 10,
    width: '60%',
  },
  buttonFixed: {
    position: 'absolute',
    width: 110,
    height: 50,
    right: 20,
    bottom: 20,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  stopWatchContainer: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 240,
    paddingTop: 48,
  },
  stopWatchChar: {
    fontSize: 100,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: dynamicWidth,
    padding: 10,
    borderRadius: 30,
    margin: 10,
  }
})