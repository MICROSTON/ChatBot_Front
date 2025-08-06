// src/screens/chat/FavoriteListScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { useLike } from '../../context/LikeContext';
import { useNavigation } from '@react-navigation/native';

const BG = require('../../../assets/images/background.png');

export default function FavoriteListScreen() {
  const { likedBenefits, toggleLike } = useLike();
  const navigation = useNavigation();

  const renderRightActions = (item) => (
    <RectButton style={styles.deleteButton} onPress={() => toggleLike(item)}>
      <Text style={styles.deleteText}>삭제</Text>
    </RectButton>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('WelfareDetail', { item })}
      >
        <Text style={styles.title}>{item.Benefit_name}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <ImageBackground
      source={BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>좋아요</Text>
      </View>

      <FlatList
        data={likedBenefits}
        keyExtractor={(item) => item.Benefit_Code.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>좋아요한 항목이 없습니다.</Text>
        }
        contentContainerStyle={
          likedBenefits.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    opacity: 0.15,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginHorizontal: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#F26D6D',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
