import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useLike } from '../../context/LikeContext';
import SwipeableListItem from './SwipeableListItem';

const BG = require('../../../assets/images/background2.png');

export default function FavoriteListScreen() {
  const { likedBenefits, removeLike } = useLike();
  const navigation = useNavigation();

  const handleDelete = (item) => {
    Alert.alert(
      '삭제 확인',
      '좋아요를 취소하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => removeLike(item)
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <SwipeableListItem onDelete={() => handleDelete(item)}>
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate('FavoriteDetail', { item })}
      >
        <Text style={styles.title}>{item.benefitName}</Text>
      </TouchableOpacity>
    </SwipeableListItem>
  );

  return (
    <ImageBackground
      source={BG}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      {/* 헤더 (ChatScreen과 동일한 구조) */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>좋아요</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.headerSeparatorInner} />
      </View>

      {/* 바디 */}
      <FlatList
        data={likedBenefits}
        keyExtractor={(item) => item.benefitCode.toString()}
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
  
  // ChatScreen과 완전 동일한 헤더 스타일
  header: {
    backgroundColor: 'transparent',
    paddingTop: 60,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 32,
  },
  headerSeparatorInner: {
    height: 1,
    backgroundColor: '#000',
    marginHorizontal: 0,
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
});