const mainColor = '#1d2951';
const mainLightColor = '#8698d4';
const secondaryColor = '#DC143C';
const secondaryColorLight = '#ed365b';
const backgroundColor = '#FFF';
const spacing = 4;
const smallSpacing = 2;
const bodyFont = "SourceSansPro_400Regular";
const bodyFontBold = "SourceSansPro_600SemiBold";
const bodyFontItalic = "SourceSansPro_400Regular_Italic";

const gs = {
  bodyFont: bodyFont,
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
  },
  smallHeader: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontFamily: "Oswald_400Regular",
    fontWeight: 'bold',
  },
  noRightLetter: {
    marginLeft: spacing,
  },
  noLeftLetter: {
    marginRight: spacing,
  },
  normalLetter: {
    marginRight: spacing,
    marginLeft: spacing,
  },
  smallNoRightLetter: {
    marginLeft: smallSpacing,
  },
  smallNoLeftLetter: {
    marginRight: smallSpacing,
  },
  smallNormalLetter: {
    marginRight: smallSpacing,
    marginLeft: smallSpacing,
  },
  barbell: {
    color: 'white',
    transform: [{rotate: '90deg'}],
    marginTop: 6,
  },
  smallBarbell: {
    color: 'white',
    transform: [{rotate: '90deg'}],
    marginTop: 3,
  },
  pageHeader: {
    textAlign: 'center',
    fontSize: 28,
    color: secondaryColor,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 10,
    fontFamily: "Oswald_400Regular",
  },
  pageHeaderBox: {
    paddingLeft: 10,
    paddingRight: 10,
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
    justifyContent: "flex-start",
    paddingTop: 5,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    color: 'white',
    backgroundColor: backgroundColor,
    width: '100%',
  },
  title: {
    color: 'black',
    margin: 0,
    padding: 0,
    fontSize: 20,
    fontFamily: bodyFont,
    marginLeft: 10,
  },
  subtitle: {
    color: 'grey',
    marginTop: 2,
    padding: 0,
    fontSize: 14,
    fontFamily: bodyFont,
  },
  titlebar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    marginTop: 0,
    marginBottom: 0,
    height: 30,
    borderWidth: 2,
    borderColor: secondaryColor,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  centerBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: secondaryColor,
  },
  clearButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  leftright: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  card: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: backgroundColor,
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
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: bodyFontBold,
  },
  workoutBody: {
    fontSize: 24,
    fontFamily: bodyFont,
    marginLeft: 20,
  },
  divider: {
    margin: 0,
    padding: 0,
    width: 0,
    height: 0,
    backgroundColor: mainColor,
  },
  dividerPink: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: 10,
    backgroundColor: mainColor,
  },
  dividerPinkThick: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: 10,
    backgroundColor: mainColor,
  },
  dividerMedium: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#DCDCDC',
  },
  dividerLight: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  topsection: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  left: {
    width: '80%',
  },
  right: {
    width: '20%',
  },
  notes: {
    fontStyle: 'italic',
    fontSize: 15,
    marginTop: 10,
    fontFamily: bodyFont,
  },
}

export default gs;
