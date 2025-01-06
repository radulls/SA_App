import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Post from './Post'
function PostList() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.emptyText}>Сегодня нет постов</Text> */}
      <Post />
      <Post />
      <Post />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: "rgba(153, 153, 153, 1)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default PostList;