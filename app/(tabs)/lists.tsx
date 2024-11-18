import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  StatusBar,
  TextInput,
  ScrollView,
} from "react-native";
import { SearchBar } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

interface List {
  list_id: number;
  name: string;
  items: string[];
  dateRange: string;
}

const ListsScreen = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Date states for creating new lists
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const addList = () => {
    if (!startDate || !endDate) {
      Alert.alert("Please select both a start date and an end date.");
      return;
    }

    const defaultListName = `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;

    const newList: List = {
      list_id: lists.length > 0 ? lists[lists.length - 1].list_id + 1 : 1,
      name: listName || defaultListName,
      items: ["Yum Yum"],
      dateRange: defaultListName,
    };

    setLists([...lists, newList]);
    setListName("");
    setStartDate(null);
    setEndDate(null);
    setAddModalVisible(false);
  };

  const openEditModal = (list: List) => {
    setSelectedList(list);
    setListName(list.name);
    setIsEditing(false);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (selectedList) {
      const updatedName = listName || selectedList.dateRange;
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.list_id === selectedList.list_id
            ? { ...list, name: updatedName }
            : list
        )
      );
    }
    setEditModalVisible(false);
    setListName("");
    setIsEditing(false);
  };

  const deleteList = () => {
    if (selectedList) {
      Alert.alert(
        "Delete List",
        "Are you sure you want to delete this list?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              setLists((prevLists) =>
                prevLists.filter((list) => list.list_id !== selectedList.list_id)
              );
              setEditModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    }
  };
  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search lists..."
        // @ts-ignore
        onChangeText={setSearchQuery}
        value={searchQuery}
        platform="default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      <FlatList
        data={filteredLists}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openEditModal(item)}>
            <Text style={styles.textStyle}>{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.list_id.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => {
          setListName("");
          setAddModalVisible(true);
        }}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </Pressable>

      {/* Add List Modal */}
      <Modal animationType="slide" transparent={true} visible={addModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.addListModal}>
            <Text style={styles.modalText}>Enter List Name (Optional):</Text>
            <TextInput
              style={[styles.input, { textAlign: "center" }]}
              placeholder="e.g. Thanksgiving Dinner"
              placeholderTextColor="#888888"
              value={listName}
              onChangeText={setListName}
            />
            <Text style={styles.modalText}>Select Start Date:</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {startDate
                  ? startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick Start Date"}
              </Text>
            </Pressable>

            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}

            <Text style={styles.modalText}>Select End Date:</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {endDate
                  ? endDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pick End Date"}
              </Text>
            </Pressable>

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}

            <View style={styles.buttonRowCompact}>
              <Pressable
                style={styles.addCancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addSaveButton} onPress={addList}>
                <Text style={styles.textStyle}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit List Modal */}
      <Modal animationType="slide" transparent={true} visible={editModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.editListModal}>
            <TextInput
              style={[styles.input, styles.titleInput]}
              placeholder="List Name"
              value={listName}
              onChangeText={setListName}
              editable={isEditing}
            />
            <ScrollView style={styles.scrollableBox}>
              {selectedList?.items.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.item}
                  onPress={() => Alert.alert("Nothing yet")}
                >
                  <Text style={styles.scrollableText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              {isEditing ? (
                <>
                  <Pressable style={styles.deleteButton} onPress={deleteList}>
                    <Text style={styles.textStyle}>Delete</Text>
                  </Pressable>
                  <Pressable style={styles.saveButton} onPress={saveEdit}>
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.textStyle}>Edit</Text>
                </Pressable>
              )}
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
  searchBarContainer: {
    backgroundColor: "#F0EAD6",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  item: {
    backgroundColor: "#ADD8E6",
    marginVertical: 0.7,
    marginHorizontal: 0.7,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  addListModal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "65%", 
  },
  editListModal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 21,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "85%", 
    maxHeight: "75%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    height: 50,
    textAlign: "center",
    borderWidth: 0,
    marginBottom: 0,
  },
  button: {
    borderRadius: 0,
    padding: 4,
    marginVertical: 0,
    height: 48,
  },
  buttonOpen: {
    backgroundColor: "#36454F",
  },
  saveButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  cancelButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  editButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "30%",
  },
  addCancelButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "45%", 
  },
  addSaveButton: {
    backgroundColor: "#36454F",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "45%",  
  },
  textStyle: {
    color: "white",
    fontWeight: "normal",
    textAlign: "center",
    fontSize: 20,
  },
  plusButtonText: {
    color: "white",
    fontWeight: "200",
    textAlign: "center",
    fontSize: 42,
    marginTop: -7,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 10,            
    marginTop: 15,
  },
  buttonRowCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", 
    marginTop: 10,
  },
  scrollableBox: {
    height: "40%",
    width: "100%",
    marginTop: 0,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 0,
  },
  scrollableText: {
    fontSize: 16,
    color: "white",
    padding: 1,
  },
  dateButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  dateText: {
    color: "#333",
    fontSize: 16,
  },
});

export default ListsScreen;