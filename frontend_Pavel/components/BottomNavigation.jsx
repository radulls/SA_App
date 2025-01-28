import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';

function BottomNavigation() {
  const [gap, setGap] = useState(60); // Изначальный gap

  useEffect(() => {
    // Функция для обновления gap в зависимости от ширины экрана
    const updateGap = () => {
      const screenWidth = Dimensions.get('window').width;

      // Плавное уменьшение gap от 60 до 45 при уменьшении ширины экрана от 414px до 375px
      if (screenWidth >= 375 && screenWidth <= 414) {
        const newGap = 60 - (414 - screenWidth) * (60 - 45) / (414 - 375);
        setGap(newGap);
      }
      // Плавное уменьшение gap от 45 до 40 при уменьшении ширины экрана от 375px до 320px
      else if (screenWidth > 320 && screenWidth < 375) {
        const newGap = 45 - (375 - screenWidth) * (45 - 40) / (375 - 320);
        setGap(newGap);
      }
      // Если ширина экрана 320px или меньше
      else if (screenWidth <= 320) {
        setGap(40);
      }
      // Если ширина экрана больше или равна 414px
      else if (screenWidth >= 414) {
        setGap(60);
      }
    };

    // Вызовем updateGap при изменении ширины экрана
    updateGap(); // Инициализация gap при первом рендере
    const onChange = Dimensions.addEventListener('change', updateGap); // Слушатель для изменения размеров экрана

    // Очистка слушателя при размонтировании компонента
    return () => {
      onChange.remove();
    };
  }, []); // Пустой массив зависимостей, чтобы useEffect сработал только один раз


  return (
    <View style={[styles.nav, { gap }]}>
      <TouchableOpacity onPress={() => {router.push('/home')}}>
        <Image
          source={require('../assets/images/nav/home.png')}
          style={styles.navigationImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {router.push('/search')}}>
        <Image
          source={require('../assets/images/nav/search.png')}
          style={styles.navigationImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {router.push('/eventCreation')}}>
        <Image
          source={require('../assets/images/nav/plus.png')}
          style={styles.navigationImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {router.push('/messages')}}>
        <Image
          source={require('../assets/images/nav/noti.png')}
          style={styles.navigationImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {router.push('/settings')}}>
        <Image
          source={require('../assets/images/nav/acc.png')}
          style={styles.navigationImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    height: 83,
    width: '100%',
    backgroundColor: '#FDFDFD',
    borderTopColor: '#D8D8D8',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'center',
    paddingTop: 13.5,
  },
  navigationImage: {
    height: 22,
    width: 22,
    zIndex: 9999,
  },
});

export default BottomNavigation;


