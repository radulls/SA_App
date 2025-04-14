import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { getUserProfile } from "@/api/index"; // Импортируем API

export default function Index() {
  const linkStyle = {fontSize: 24, marginBottom: 16}
  const [userId, setUserId] = useState<string | null>(null);
  const sosId = "67c2e5a6050f7300adeb1d46";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        if (userData?.id) {
          setUserId(userData.id);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <ScrollView>
      <View  style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}>
        <Link style={linkStyle} href="/auth/login">Вход</Link>
        <Link style={linkStyle} href="/register">Регистрация</Link>
        <Link style={linkStyle} href="/verification">Верификация</Link>
        <Link style={linkStyle} href="/home">Профиль</Link>
        <Link style={linkStyle} href={`/profile/${userId}`}>Чужой профиль</Link>
        <Link style={linkStyle} href={`/profileQR/${userId}`}>
          QR профиля
        </Link>
        <Link style={linkStyle} href={`/sos-signal/${sosId}`}>
          Сос сигнал
        </Link>
        <Link style={linkStyle} href="/eventCreation">Создать пост</Link>
        <Link style={linkStyle} href="/search">Поиск</Link>
        <Link style={linkStyle} href="/messages">Сообщения</Link>
        <Link style={linkStyle} href="/message">Сообщение</Link>
        <Link style={linkStyle} href="/settings">Настройки</Link>
        <Link style={linkStyle} href="/dome">Дом</Link>
        <Link style={linkStyle} href="/PostView">Детальный видеопост</Link>
        {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
      </View>
    </ScrollView>
  );
}
