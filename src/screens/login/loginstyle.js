import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'white',
    textShadowColor: 'rgb(116, 116, 116)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textTransform: 'uppercase',
    borderColor: 'black',
    borderWidth: 2,
    letterSpacing: 1,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'hsl(49, 98%, 60%)',
    borderRadius: 50,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.5s ease',
  },
  buttonActive: {
    transform: [{ scale: 0.9 }],
    transition: 'all 100ms ease',
  },
  svg: {
    transition: 'all 0.5s ease',
    zIndex: 2,
  },
  play: {
    transition: 'all 0.5s ease',
    transitionDelay: '300ms',
  },
  now: {
    position: 'absolute',
    left: 0,
    transform: [{ translateX: -100 }],
    transition: 'all 0.5s ease',
    zIndex: 2,
  },
  buttonHover: {
    svg: {
      transform: [{ scale: 3 }, { translateX: 50 }],
    },
    now: {
      transform: [{ translateX: 10 }],
      transitionDelay: '300ms',
    },
    play: {
      transform: [{ translateX: 200 }],
      transitionDelay: '300ms',
    },
  },
});
