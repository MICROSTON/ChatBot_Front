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
import { FontAwesome } from '@expo/vector-icons';
import { useLike } from '../../context/LikeContext';
import SwipeableListItem from './SwipeableListItem';

const BG = require('../../../assets/images/background2.png');

export default function FavoriteListScreen() {
  const { likedBenefits, removeLike, loading } = useLike();
  const navigation = useNavigation();

  const handleDelete = (item) => {
    Alert.alert(
      '삭제 확인',
      '좋아요를 취소하시겠습니까?',
      [
        { text: '확인', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => removeLike(item)
        }
      ]
    );
  };

  const handleHeartPress = (item) => {
    Alert.alert(
      '좋아요 취소',
      '좋아요를 취소하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '확인', 
          style: 'destructive',
          onPress: () => removeLike(item)
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <SwipeableListItem onDelete={() => handleDelete(item)}>
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('FavoriteDetail', { item })}
        >
          <Text style={styles.title}>{item.benefitName || '제목 없음'}</Text>
          {item.benefitContext && (
            <Text style={styles.subtitle} numberOfLines={2}>
              {item.benefitContext}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => handleHeartPress(item)}
        >
          <FontAwesome
            name="heart"
            size={24}
            color="#FF3366"
          />
        </TouchableOpacity>
      </View>
    </SwipeableListItem>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? '좋아요 목록을 불러오는 중...' : '아직 좋아요한 복지가 없습니다.'}
      </Text>
      <Text style={styles.emptySubText}>
        복지 검색에서 마음에 드는 복지를 좋아요 해보세요!
      </Text>
    </View>
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
        keyExtractor={(item) => (item?.benefitCode?.toString() || item?.id?.toString() || Math.random().toString())}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 18,
  },
  heartButton: {
    padding: 8,
    marginLeft: 10,
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
    paddingVertical: 50,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});