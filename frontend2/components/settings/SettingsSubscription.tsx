import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SubsIcon from "../svgConvertedIcons/Verification/subsIcon";
import { styles } from '@/components/settings/SettingsStyle';
import CheckIcon from '../svgConvertedIcons/settings/checkIcon';

interface SettingsSubscriptionProps {
  onBack: () => void;
}

const SettingsSubscription: React.FC<SettingsSubscriptionProps> = ({ onBack }) => {
  return (
    <View style={[styles.container, styles.subContainer]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        <SubsIcon/>
        <Text style={styles.title}>Вы часть объединения!</Text>
        <Text style={styles.description}>
        Благодарим за оформление подписки объединения. Вместе мы создаем уникальное пространство.
        </Text>
      </ScrollView>
      <View style={styles.bottomItems}>
        <View style={styles.subsInfo}>
          <View style={styles.check}>
            <CheckIcon/>
            <Text style={styles.subsText}>Ежемесячно</Text>
          </View>
          <Text style={styles.subsTextPrice}>500 руб. / месяц</Text>
        </View>
        <View style={styles.ContinueButton}>
          <TouchableOpacity style={styles.subsButton}>
            <Text style={styles.subsButtonText}>
              Изменить подписку
            </Text>          
          </TouchableOpacity>
        </View>
      </View>     
    </View>
  )
}

export default SettingsSubscription