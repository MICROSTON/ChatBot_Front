import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelfareCard({ title, content, onLike }) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(true);
    onLike && onLike(title); // optional 콜백
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleLike} disabled={liked}>
          <Text style={[styles.likeButton, liked && styles.liked]}>
            {liked ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#3AAFA9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17252A',
  },
  content: {
    fontSize: 14,
    color: '#444',
  },
  likeButton: {
    fontSize: 18,
    color: '#3AAFA9',
  },
  liked: {
    color: '#FF6B6B',
  },
});
