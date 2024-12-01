import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface State {
  selectedStartDate: Date | null;
  modalVisible: boolean;
  listName: string;
  startDate: Date | null;
  endDate: Date | null;
  showStartPicker: boolean;
  showEndPicker: boolean;
}

export default class IndexScreen extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedStartDate: null,
      modalVisible: false,
      listName: "",
      startDate: null,
      endDate: null,
      showStartPicker: false,
      showEndPicker: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
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

  handleInputChange(inputName: string, value: string) {
    this.setState({ [inputName]: value } as unknown as Pick<State, keyof State>);
  }

  handleSave() {
    const { listName, startDate, endDate } = this.state;
    console.log("List Name:", listName);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    this.toggleModal(false);
  }

  handleDateChange(event: any, selectedDate: Date | null, type: "start" | "end") {
    if (type === "start") {
      this.setState({
        startDate: selectedDate,
        showStartPicker: false, 
      });
    } else {
      this.setState({
        endDate: selectedDate,
        showEndPicker: false, 
      });
    }
  }

  toggleDatePicker(type: "start" | "end") {
    if (type === "start") {
      this.setState((prevState) => ({
        showStartPicker: !prevState.showStartPicker,
      }));
    } else {
      this.setState((prevState) => ({
        showEndPicker: !prevState.showEndPicker,
      }));
    }
  }

  render() {
    const {
      selectedStartDate,
      modalVisible,
      listName,
      startDate,
      endDate,
      showStartPicker,
      showEndPicker,
    } = this.state;

    return (
      <IndexScreenWithRouter
        selectedStartDate={selectedStartDate}
        modalVisible={modalVisible}
        listName={listName}
        startDate={startDate}
        endDate={endDate}
        showStartPicker={showStartPicker}
        showEndPicker={showEndPicker}
        onDateChange={this.onDateChange}
        toggleModal={this.toggleModal}
        handleInputChange={this.handleInputChange}
        handleSave={this.handleSave}
        handleDateChange={this.handleDateChange}
        toggleDatePicker={this.toggleDatePicker}
      />
    );
  }
}

function IndexScreenWithRouter(props: any) {
  const router = useRouter();
  const {
    selectedStartDate,
    modalVisible,
    listName,
    startDate,
    endDate,
    showStartPicker,
    showEndPicker,
    onDateChange,
    toggleModal,
    handleInputChange,
    handleSave,
    handleDateChange,
    toggleDatePicker,
  } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("/cart")}
      >
        <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.calendarContainer}>
        <CalendarPicker
          onDateChange={onDateChange}
          selectedDayColor="#FFFFFF"
          selectedDayTextColor="#000000"
        />
      </View>

      <View style={styles.dateTextContainer}>
        <Text>SELECTED DATE: {selectedStartDate?.toString() || ""}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => toggleModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.newModalContainer}>
            <Text style={styles.newModalTitle}>Enter List Name (Optional):</Text>

            <TextInput
              style={styles.textInput}
              placeholder="e.g. Thanksgiving Dinner"
              placeholderTextColor="#A9A9A9"
              value={listName}
              onChangeText={(text) => handleInputChange("listName", text)}
            />

            <Text style={styles.label}>Select Start Date:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => toggleDatePicker("start")}
            >
              <Text style={styles.datePickerText}>
                {startDate ? startDate.toDateString() : "Pick Start Date"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange(event, date, "start")
                }
              />
            )}

            <Text style={styles.label}>Select End Date:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => toggleDatePicker("end")}
            >
              <Text style={styles.datePickerText}>
                {endDate ? endDate.toDateString() : "Pick End Date"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange(event, date, "end")
                }
              />
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => toggleModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => toggleModal(true)}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EAD6",
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
  cartButton: {
    position: "absolute",
    top: 5,
    right: 50,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  newModalContainer: {
    width: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  newModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "#A9A9A9",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center", 
  },
  datePickerButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerText: {
    color: "#000",
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "70%",
  },
  modalButton: {
    width: "45%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#36454F",
  },
  saveButton: {
    backgroundColor: "#36454F",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: "0%",
    transform: [{ translateX: -50 }],
    height: 48,
    width: 530,
    backgroundColor: "#36454F",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#36454F",
  },
  plusButtonText: {
    color: "white",
    fontWeight: "200",
    textAlign: "center",
    fontSize: 42,
    marginTop: -4,
  },
});