import React, { Component } from "react";
import { StyleSheet, Text, View, Modal, Button, TouchableOpacity } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';

interface State {
  selectedStartDate: Date | null;
  modalVisible: boolean;
}

export default class IndexScreen extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedStartDate: null,
      modalVisible: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onDateChange(date: Date) {
    this.setState({
      selectedStartDate: date,
      modalVisible: true,
    });
  }

  toggleModal(visible: boolean) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { selectedStartDate, modalVisible } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log("Settings Pressed")}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />  {}
        </TouchableOpacity>

        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={this.onDateChange}
            selectedDayColor="#FFFFFF"
            selectedDayTextColor="#000000"
          />
        </View>


        <View style={styles.dateTextContainer}>
          <Text>SELECTED DATE: {startDate}</Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.toggleModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Options for {startDate}</Text>
              <Button title="Add List" onPress={() => console.log("Add List Pressed")} />
              <Button title="Close" onPress={() => this.toggleModal(false)} color="red" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    marginTop: 0,
  },
  settingsButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 10,
    backgroundColor: "#36454F",
    borderRadius: 5,
  },
  calendarContainer: {
    marginTop: 177,
  },
  dateTextContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
});
