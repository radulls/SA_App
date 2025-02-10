import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

interface DetailsData {
  title: string;
  tags: string[];
  description: string;
}

interface Props {
  onNext: (details: DetailsData) => void;
}

const DetailsStep: React.FC<Props> = ({ onNext }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  return (
    <View>
      <TextInput placeholder="Заголовок" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Теги (через запятую)" value={tags} onChangeText={setTags} />
      <TextInput placeholder="Описание" value={description} onChangeText={setDescription} multiline />
      <Button
        title="Выложить сигнал SOS"
        onPress={() => onNext({ title, tags: tags.split(','), description })}
      />
    </View>
  );
};

export default DetailsStep;
