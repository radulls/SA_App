import MoreOptionsIcon from '@/components/svgConvertedIcons/MoreOptionsIcon';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import CustomModal from '../CustomModal';

interface PartnerCouponsProps {
  onBack: () => void;
}

const coupons = [
  {
    id: '1',
    name: 'Starbucks',
    subtitle: 'Подарочный набор кофе и кружка в городе Нижний Новгород. ',
    description: 'Взяла старуха крылышко, по коробу поскребла, по сусеку помела, и набралось муки пригоршни с две. Замесила на сметане, изжарила в масле и положила на окошечко постудить.',
    logo: require('../../../assets/coupons/1.png'),
    background: 'https://images.unsplash.com/photo-1618221494627-f94c1b0f857b?fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'owlcoffee',
    subtitle: 'Бесплатный капучино',
    description: 'Взяла старуха крылышко, по коробу поскребла, по сусеку помела, и набралось муки пригоршни с две. Замесила на сметане, изжарила в масле и положила на окошечко постудить.',
    logo: require('../../../assets/coupons/2.png'),
    background: 'https://images.unsplash.com/photo-1618219950373-65fd7cb1c07c?fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'металлоконструкции',
    subtitle: 'Бесплатный монтаж',
    description: 'Взяла старуха крылышко, по коробу поскребла, по сусеку помела, и набралось муки пригоршни с две. Замесила на сметане, изжарила в масле и положила на окошечко постудить.',
    logo: require('../../../assets/coupons/3.png'),
    background: 'https://images.unsplash.com/photo-1604014238254-4299c42fc1e6?fit=crop&w=800&q=80',
  },
];

const PartnerCoupons: React.FC<PartnerCouponsProps> = ({ onBack }) => {
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null); // для меню с действиями
  const [activeCouponId, setActiveCouponId] = useState<string | null>(null); // для описания

  const handleDelete = () => {
    console.log('Удалить купон с id:', selectedCouponId);
    setSelectedCouponId(null);
  };

  const selectedCoupon = coupons.find(c => c.id === selectedCouponId);
  const activeCoupon = coupons.find(c => c.id === activeCouponId);

  return (
    <View style={styles.container}>
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <ImageBackground source={{ uri: item.background }} style={styles.couponContainer} imageStyle={styles.backgroundImage}>
            <TouchableOpacity style={styles.leftContent} onPress={() => setActiveCouponId(item.id)}>
            <Image
              source={typeof item.logo === 'string' ? { uri: item.logo } : item.logo}
              style={styles.logo}
            />
              <View style={styles.textContainer}>
                <Text style={styles.couponName}>{item.name}</Text>
                <Text
                  style={styles.couponSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.subtitle}
                </Text>

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedCouponId(item.id)}>
              <MoreOptionsIcon />
            </TouchableOpacity>
          </ImageBackground>
        )}
      />

      {/* Меню "Удалить / Отмена" */}
      <CustomModal
        visible={!!selectedCouponId}
        onClose={() => setSelectedCouponId(null)}
        title=""
        buttons={[
          { label: 'Удалить', action: handleDelete, type: 'redText' },
          { label: 'Отмена', action: () => setSelectedCouponId(null), type: 'grayBack' },
        ]}
        buttonLayout="column"
      />

      {/* Модалка с описанием */}
      <CustomModal
        visible={!!activeCouponId}
        onClose={() => setActiveCouponId(null)}
        title={activeCoupon?.name || ''}
        subtitle={activeCoupon?.subtitle}
        description={activeCoupon?.description}
        modalImage={activeCoupon?.logo}
        hideOptionIcons
        buttonLayout="column"
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  couponContainer: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    overflow: 'hidden',
    backgroundColor: '#000',
    height: 78,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  textContainer: {
    flexShrink: 1,
  },
  couponName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  couponSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PartnerCoupons;
