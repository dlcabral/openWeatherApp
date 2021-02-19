/* eslint-disable prettier/prettier */
import React, {FC, useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

export interface Props{
  navigation: any,
  route: any,
}

const LoadingImg = require('../assets/loading.png');

const Loading: FC<Props> = (props)=>{
  useEffect(() => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    delay(1500).then(() => {
      props.navigation.navigate(props.route.params.screen, {city: props.route.params.city});
    }).catch(ex => console.error(ex));
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.viewImageShadow}>
          <Image source={LoadingImg} style={styles.logo} />
          <Text>Fetching the weather...</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  viewImageShadow: {
    flexDirection: 'column',
    shadowColor: '#202020',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
  },
  logo: {
    width: '40%',
    height: '40%',
  },
  textLoading: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Arial',
  },
});

export default Loading;
