import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const SwipeableListItem = ({ children, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <FontAwesome name="trash" size={20} color="white" />
      <Text style={styles.deleteText}>삭제</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.itemContainer}>{children}</View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SwipeableListItem;
