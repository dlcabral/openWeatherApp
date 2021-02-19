/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, FlatList} from 'react-native';

export interface Props{
  modalCitiesVisible: boolean,
  closeModal: ()=> {},
  cities: any,
  goToCityDetails: (any)=> {},
}

const CitiesModal: FC<Props> = (props)=>{
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={styles.modalAlert}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalCitiesVisible}
          onRequestClose={() => props.closeModal()}>
          <TouchableWithoutFeedback onPress={() => props.closeModal()}>
            <View style={styles.viewOpacity}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.viewInformation}>
                  <Text style={styles.textTitle}>Nearest Cities</Text>
                  <FlatList
                    nestedScrollEnabled
                    data={props.cities}
                    renderItem={({item})=>{
                      return (
                        <TouchableOpacity onPress={()=> props.goToCityDetails(item.item)} style={styles.viewCity}><Text style={styles.textDetails}>{item.item.name}</Text></TouchableOpacity>
                      );
                    }}
                    extraData={props.cities}
                    keyExtractor={item => item.id.toString()}/>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalAlert: {
  },
  viewOpacity: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(1,1,1,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInformation: {
    width: '80%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    backgroundColor: '#ffffff',
  },
  viewCity: {
    marginTop: 10,
  },
  textDetails: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#677366',
    fontFamily: 'serif',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'lightgreen',
    fontFamily: 'serif',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default CitiesModal;