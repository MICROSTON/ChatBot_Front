import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../styles/colors';
import { AntDesign } from '@expo/vector-icons';
import { saveLike, isMessageLiked } from '../../services/LikeService';

const ChatMessageItem = ({ message }) => {
  const isBot = message.sender === 'bot';
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // 로딩 시 좋아요 여부 확인
    const fetchLikedStatus = async () => {
      const likedStatus = await isMessageLiked(message.id);
      setLiked(likedStatus);
    };
    fetchLikedStatus();
  }, [message.id]);

  const handleLikePress = async () => {
    if (!liked) {
      const result = await saveLike(message);
      if (result.success) {
        setLiked(true);
      }
    }
  };

  return (
    <View style={[styles.messageContainer, isBot ? styles.bot : styles.user]}>
      <Text style={styles.messageText}>{message.text}</Text>
      {isBot && (
        <TouchableOpacity onPress={handleLikePress} disabled={liked} style={styles.heartButton}>
          <AntDesign name={liked ? 'heart' : 'hearto'} size={18} color={liked ? 'red' : 'gray'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
    position: 'relative',
  },
  bot: {
    backgroundColor: '#eef6f9',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  heartButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
});

export default ChatMessageItem;
