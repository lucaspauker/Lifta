const mainColor = '#1d2951';
const mainLightColor = '#8698d4';
const secondaryColor = '#DC143C';
const backgroundColor = '#F5F5F5';

const gs = {
  backgroundColor: mainColor,
  primaryColor: mainColor,
  secondaryColor: secondaryColor,
  lightBackgroundColor: backgroundColor,
  textColor: 'white',
  textSecondaryColor: 'grey',
  bigSpace: 50,
  mediumSpace: 25,
  smallSpace: 10,
  header: {
    textAlign: 'center',
    fontSize: 40,
    color: 'white',
    fontFamily: "Oswald_400Regular",
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pageHeader: {
    textAlign: 'center',
    fontSize: 25,
    color: secondaryColor,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "Oswald_400Regular",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: mainColor,
    color: 'white',
  },
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    padding: 10,
    color: 'white',
    backgroundColor: backgroundColor,
    minHeight: '100%',
  },
  button: {
    backgroundColor: mainColor,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  clearButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 0,
    borderRadius: 10,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  workouts: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  workout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: 2,
    marginTop: 2,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutBody: {
    fontSize: 16,
  },
  divider: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: 1,
    backgroundColor: 'lightgrey'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'top',
    justifyContent: 'space-around',
    marginLeft: 10,
    marginRight: 10,
    borderTopWidth: 1,
    borderColor: secondaryColor,
  },
  topsection: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor:secondaryColor,
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 10,
  },
}

export default gs;
