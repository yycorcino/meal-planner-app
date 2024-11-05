import React, { useState } from "react";
import {
  View,
  Alert,
  Modal,
  Text,
  Pressable,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ItemList from "../../components/ItemList";
import { StyleSheet } from "react-native";

interface ListItem {
  id: string;
  startDate: Date;
  endDate: Date;
}

const ListsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [lists, setLists] = useState<ListItem[]>([]);
  const [showAddDatePicker, setShowAddDatePicker] = useState({ start: false, end: false });
  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);

  const addList = () => {
    if (!startDate || !endDate) {
      Alert.alert("Please select both start and end dates.");
      return;
    }

    setLists((prevLists) => [
      ...prevLists,
      { id: Date.now().toString(), startDate, endDate },
    ]);

    setStartDate(null);
    setEndDate(null);
    setModalVisible(false);
  };

  const confirmDeleteList = (list: ListItem) => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete this List?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteList(list) },
      ],
      { cancelable: false }
    );
  };

  const deleteList = (list: ListItem) => {
    setLists((prevLists) => prevLists.filter((l) => l.id !== list.id));
  };

  const resetFilter = () => {
    setFilterDate(null); // Reset filter
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Function to directly filter items based on normalized date comparison
  const filteredItems = lists.filter((item) => {
    if (!filterDate) return true;
    const normalizedFilterDate = normalizeDate(filterDate);
    const normalizedStartDate = normalizeDate(item.startDate);
    const normalizedEndDate = normalizeDate(item.endDate);
    return normalizedFilterDate >= normalizedStartDate && normalizedFilterDate <= normalizedEndDate;
  });

  return (
    <View style={styles.container}>
      {/* Filter Section at the Top */}
      <View style={styles.filterContainer}>
        <Pressable onPress={() => setShowFilterDatePicker(true)}>
          <Text>{filterDate ? formatDate(filterDate) : "Choose Filter Date"}</Text>
        </Pressable>
        {showFilterDatePicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowFilterDatePicker(false);
              setFilterDate(date || null);
            }}
          />
        )}
        <Pressable style={styles.resetButton} onPress={resetFilter}>
          <Text style={styles.resetButtonText}>Reset Filter</Text>
        </Pressable>
      </View>

      {/* Item List */}
      <ItemList
        items={filteredItems}
        searchQuery={filterDate ? formatDate(filterDate) : ""} // Pass empty string if filterDate is null
        onDeleteItem={confirmDeleteList}
        getTitle={(item) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
      />

      {/* Add Date Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Add Date</Text>
        </Pressable>
      </View>

      {/* Modal for Adding Date Range */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Start Date:</Text>
            <Pressable
              style={styles.datePickerContainer}
              onPress={() => setShowAddDatePicker((prev) => ({ ...prev, start: true }))}
            >
              <Text>{startDate ? formatDate(startDate) : "Choose Start Date"}</Text>
            </Pressable>
            {showAddDatePicker.start && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowAddDatePicker((prev) => ({ ...prev, start: false }));
                  if (date) setStartDate(date);
                }}
              />
            )}

            <Text style={styles.modalText}>Select End Date:</Text>
            <Pressable
              style={styles.datePickerContainer}
              onPress={() => setShowAddDatePicker((prev) => ({ ...prev, end: true }))}
            >
              <Text>{endDate ? formatDate(endDate) : "Choose End Date"}</Text>
            </Pressable>
            {showAddDatePicker.end && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowAddDatePicker((prev) => ({ ...prev, end: false }));
                  if (date) setEndDate(date);
                }}
              />
            )}

            <View style={styles.buttonContainerHorizontal}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={addList}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#F0EAD6",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#F0EAD6",
  },
  resetButton: {
    padding: 10,
    backgroundColor: "#FF6347",
    borderRadius: 5,
    marginLeft: 10,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    borderRadius: 21,
    padding: 18,
    marginVertical: 3,
    width: "45%",
  },
  buttonOpen: {
    backgroundColor: "#36454F",
  },
  buttonClose: {
    backgroundColor: "#36454F",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 20,
    alignItems: "center",
    width: 300,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  datePickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginVertical: 5,
  },
  buttonContainerHorizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
  },
});

export default ListsScreen;
