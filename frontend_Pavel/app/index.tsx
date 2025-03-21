import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  const linkStyle = {fontSize: 24, marginBottom: 16}
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link style={linkStyle} href="/admin/users">Админ: участники</Link>
      <Link style={linkStyle} href="/admin/usersver">Админ: верификация</Link>
      <Link style={linkStyle} href="/auth/login">Вход</Link>
      <Link style={linkStyle} href="/register">Регистрация</Link>
      <Link style={linkStyle} href="/verification">Верификация</Link>
      <Link style={linkStyle} href="/home">Профиль</Link>
      <Link style={linkStyle} href="/profileQR/${user.id}">QR профиля</Link>
      <Link style={linkStyle} href="/eventCreation">Создать пост</Link>
      <Link style={linkStyle} href="/search">Поиск</Link>
      <Link style={linkStyle} href="/messages">Сообщения</Link>
      <Link style={linkStyle} href="/message">Сообщение</Link>
      <Link style={linkStyle} href="/settings">Настройки</Link>
      <Link style={linkStyle} href="/settings_name">Настройки: Имя</Link>
      <Link style={linkStyle} href="/settings_id">Настройки: Установить ID</Link>
      <Link style={linkStyle} href="/settings_about">Настройки: О Себе</Link>
      <Link style={linkStyle} href="/settings_phone">Настройки: Номер телефона</Link>
      <Link style={linkStyle} href="/settings_email">Настройки: Почта</Link>
      <Link style={linkStyle} href="/dome">Дом</Link>
      <Link style={linkStyle} href="/PostView">Детальный видеопост</Link>
      {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
    </View>
  );
}
