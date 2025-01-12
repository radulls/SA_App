import React from 'react';
import { View, StyleSheet, Image, Text, Pressable, TextInput } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const PostView = () => {
  const interactionData = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fc462a4227060bade3df722d30a79a40a1b49320452367c021cbd7ca156ba84e?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954", count: 26 },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/05ce122b1c97c3ca77f93c9a538c7a636aad943a715713037ee64b8ae5180e1d?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954", count: 3 },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8cf7d5edd068e8cee70d2ababac1cf85f7b6740c29a01ec5bf777ad8c1137058?placeholderIfAbsent=true&apiKey=f739d4c470a340468bd500c2bd45e954", count: null }
  ];
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.container}>
        <View style={styles.postContainer}>
            <View style={styles.backButtonContainer}>
                <Image
                    resizeMode="contain"
                    source={require('../assets/images/back_button_white.png')}
                    style={styles.backButton}
                />
            </View>
            <Video
                ref={video}
                style={styles.postImage}
                source={{
                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                }}
                fullscreen={true}
                useNativeControls={true}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          
          
          <View style={styles.postContent}>
            <View style={styles.userInfo}>
              <Image
                resizeMode="contain"
                source={require('../assets/images/avatar_post.png')}
                style={styles.userAvatar}
              />
              <View style={styles.userName}>
                <Text style={styles.userNameText}>cowx</Text>
              </View>
              <View style={styles.postTime}>
                <Text style={styles.postTimeText}>3д.</Text>
              </View>
            </View>
            <View style={styles.postText}>
              <Text style={styles.postTextContent}>
                Был на первом свидении здесь, не то, чтобы прям супер, но и не плохо efsdvsdmfkl. lkmf;lm sdl d lfkv;lfekmvs …
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
            <View style={styles.progressDot} />
          </View>
        
        <View style={styles.commentSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Напишите комментарий"
            placeholderTextColor="rgba(139, 139, 139, 1)"
          />
          <View style={styles.interactionButtons}>
            {interactionData.map((item, index) => (
              <View key={index} style={styles.interactionItem}>
                {/* <IconButton source={item.icon} /> */}
                {item.count !== null && (
                  <Text style={styles.interactionCount}>{item.count}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "stretch",
    marginHorizontal: "auto",
  },
  postContainer: {
    backgroundColor: "rgba(0, 0, 0, 1)",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  postImage: {
    position: "relative",
    display: "flex",
    aspectRatio: "0.51",
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  backButtonContainer: {
    position: "relative",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "start",
    paddingTop: 59,
    paddingHorizontal: 16,
    paddingBottom: 21,
  },
  backButton: {
    // borderRadius: "0px 0px 0px 0px",
    position: "absolute",
    top: 50,
    left: 50,
    zIndex: 999,
    // display: "flex",
    width: 8,
    height: 16,
    // backgroundColor: 'white',
    // aspectRatio: "0.57",
  },
  postContent: {
    position: "absolute",
    display: "flex",
    marginTop: 624,
    width: "100%",
    paddingTop: 8,
    flexDirection: "column",
    alignItems: "stretch",
  },
  userInfo: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    // fontFamily: "SF UI Display, sans-serif",
    color: "rgba(255, 255, 255, 1)",
    paddingVertical: 0,
    paddingRight: 33,
    paddingLeft: 16,
  },
  userAvatar: {
    // borderRadius: "0px 0px 0px 0px",
    position: "relative",
    display: "flex",
    width: 30,
    flexShrink: 0,
    aspectRatio: "1",
  },
  userName: {
    marginLeft: 11,
  },
  userNameText: {
    fontSize: 14,
    color: 'white',
    fontWeight: "700",
  },
  postTime: {
    marginLeft: 11,
},
postTimeText: {
  color: "white",
  fontSize: 12,
  fontWeight: "400",
  textShadow: "0px 1px 1px rgba(0, 0, 0, 0.5)", // Смещение X, Y, размытие и цвет
},
  postText: {
    marginTop: 6,
  },
  postTextContent: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 1)",
  },
  progressBar: {
    alignSelf: "start",
    zIndex: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,    
    marginHorizontal: 0,    
    marginBottom: -4,    
  },
  progressFill: {
    backgroundColor: "rgba(147, 247, 255, 1)",
    display: "flex",
    width: "100%",
    flexShrink: 0,
    height: 3,
  },
  progressDot: {
    backgroundColor: "rgba(147, 247, 255, 1)",
    // borderRadius: "50%",
    display: "flex",
    width: 11,
    flexShrink: 0,
    height: 11,
  },
  commentSection: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: 18,
    paddingHorizontal: 19,
    paddingBottom: 36,
  },
  commentInput: {
    color: "rgba(139, 139, 139, 1)",
    marginBottom: 20,
    fontSize: 14,
    fontFamily: "SF UI Display, sans-serif",
  },
  interactionButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  interactionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },
  iconButton: {
    position: "relative",
    display: "flex",
    width: 20,
    flexShrink: 0,
    aspectRatio: "1.11",
  },
  interactionCount: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "SF UI Display, sans-serif",
    marginLeft: 5,
  },
});

export default PostView;