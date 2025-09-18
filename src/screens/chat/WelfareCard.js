import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelfareCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.benefitName || '복지 혜택'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
        {item.benefitContext && (
          <Text style={styles.description} numberOfLines={1}>
            {item.benefitContext}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#55B7B5',
    borderWidth: 1,
    borderColor: '#637D85',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: '#E8F4F4',
    lineHeight: 16,
  },
});