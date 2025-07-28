import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SwipeableListItem from './SwipeableListItem';
import { getLikedItems } from '../../services/LikeService';
import { useNavigation } from '@react-navigation/native';

const FavoriteListScreen = () => {
  const [likedItems, setLikedItems] = useState([]);
  const navigation = useNavigation(); // ✅ 네비게이션 사용

  useEffect(() => {
    const fetchData = async () => {
      const items = await getLikedItems();
      setLikedItems(items);
    };
    fetchData();
  }, []);

  const handleItemPress = (item) => {
    navigation.navigate('WelfareDetail', { item }); // ✅ 상세 화면으로 이동
  };

  const renderItem = ({ item }) => (
    <SwipeableListItem
      item={item}
      onDelete={() =>
        setLikedItems((prev) => prev.filter((i) => i.messageId !== item.messageId))
      }
      onPress={() => handleItemPress(item)} // ✅ 이 줄이 핵심입니다!
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={likedItems}
        keyExtractor={(item) => item.messageId.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'black', // 검정색 구분선
    marginHorizontal: 16,
  },
});

export default FavoriteListScreen;
