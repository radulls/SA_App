export const fixAddressOrder = (address: string, locality: string) => {
  const addressParts = address.split(', ').map((part) => part.trim());

  // Если город в конце — переносим его в начало
  if (addressParts.length > 1 && addressParts[addressParts.length - 1] === locality) {
    console.log('⚠ Город оказался в конце, исправляем порядок!');
    return [locality, ...addressParts.slice(0, -1)].join(', ');
  }

  return address;
};

export const fetchAddressFromCoordinates = async (
  lat: number,
  lon: number,
  setAddress: (address: string) => void
) => {
  try {
    console.log('🚀 Вызван fetchAddressFromCoordinates:', lat, lon);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&extratags=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }

    const data = await response.json();
    console.log('📩 Данные получены от API:', data);

    if (data.address) {
      console.log('🔍 Разбираем объект address:', data.address);

      // 🔹 Определяем город (должен быть ПЕРВЫМ!)
      const locality =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.address.city_district ||
        data.address.county ||
        data.address.state ||
        '';

      // 🔹 Определяем улицу (если есть)
      const street = data.address.road || '';

      // 🔹 Определяем номер дома (если есть)
      const house = data.address.house_number || '';

      console.log('✅ Город:', locality);
      console.log('✅ Улица:', street);
      console.log('✅ Дом:', house);

      // 🔹 Формируем базовый адрес
      let addressParts = [];

      if (street) addressParts.push(street); // Улица
      if (house) addressParts.push(house); // Дом
      if (locality) addressParts.push(locality); // Город

      let formattedAddress = addressParts.join(', '); // Собираем строку

      // 🔥 **Фиксируем порядок перед `setAddress()`**
      formattedAddress = fixAddressOrder(formattedAddress, locality);

      console.log('📝 Итоговый адрес перед setAddress:', formattedAddress);
      setAddress(formattedAddress);
    } else {
      console.warn('⚠ Адрес не найден!');
      setAddress('Адрес не найден');
    }
  } catch (error) {
    console.error('❌ Ошибка при получении адреса:', error);
    setAddress('Ошибка при загрузке адреса');
  }
};
