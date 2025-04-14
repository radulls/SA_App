import React, { useEffect, useState } from 'react';
import { Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import PostSettingsStep from '@/components/posting/PostSettingsStep';
import SelectMediaStep from '@/components/posting/SelectMediaStep';
import PreviewMediaStep from '@/components/posting/PreviewMediaStep';
import ComposePostStep from '@/components/posting/ComposePostStep';
import { createPost } from '@/api/postApi';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { getSubdivisionsICanPostTo, getUserProfile } from '@/api';

const CreatePostScreen = () => {
  const [step, setStep] = useState(0);
  const [media, setMedia] = useState<{ photos: string[]; videos: string[] }>({ photos: [], videos: [] });
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [canPostToSubdivisions, setCanPostToSubdivisions] = useState(false);
  const [postSettings, setPostSettings] = useState<{
    target: 'self' | 'subdivision';
    from: 'user' | 'subdivision';
    isEmergency: boolean;
    cityId: string | null;
    group: string | null;
    subdivisionId: string | null; // 🔥 вот добавленное поле
  }>({
    target: 'self',
    from: 'user',
    isEmergency: false,
    cityId: null,
    group: null,
    subdivisionId: null, // 🔥 не забудь начальное значение
  });  
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const extractHashtags = (text: string): string[] => {
    return (text.match(/#\w+/g) || []).map(tag => tag.replace('#', ''));
  };
  const extractMentions = (text: string): string[] => {
    return (text.match(/@\w+/g) || []).map(tag => tag.replace('@', ''));
  };
  
  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUserProfile();
      const subs = await getSubdivisionsICanPostTo();
      setCanPostToSubdivisions(subs.length > 0);
      
      // Если доступна публикация от подразделения — ставим target = 'subdivision' как дефолт
      if (subs.length > 0) {
        setPostSettings(prev => ({
          ...prev,
          target: 'subdivision',
          from: user.role === 'creator' ? 'subdivision' : 'user',
        }));
      }
    };
    checkUser();
  }, []);

  const handleSubmitPost = async () => {
    try {
      setLoading(true);
      const extractedHashtags = extractHashtags(description);
      const extractedMentions = extractMentions(description);
  
      let subdivisionIds: string[] = [];
      try {
        subdivisionIds = postSettings.subdivisionId
          ? JSON.parse(postSettings.subdivisionId)
          : [];
      } catch {
        subdivisionIds = postSettings.subdivisionId?.split(',') || [];
      }
  
      const createFormData = async () => {
        const formData = new FormData();
  
        // Фото
        for (let i = 0; i < media.photos.length; i++) {
          const uri = media.photos[i];
          const name = `photo_${i}.jpg`;
  
          if (Platform.OS === 'web') {
            const mimeMatch = uri.match(/^data:(image\/[a-zA-Z]+);base64,/);
            const fileType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const blob = await fetch(uri).then(res => res.blob());
            formData.append('photos', new File([blob], name, { type: fileType }));
          } else {
            formData.append('photos', {
              uri,
              name,
              type: 'image/jpeg',
            } as any);
          }
        }
  
        // Видео
        for (let i = 0; i < media.videos.length; i++) {
          const uri = media.videos[i];
          const name = `video_${i}.mp4`;
  
          if (Platform.OS === 'web') {
            const blob = await fetch(uri).then(res => res.blob());
            formData.append('videos', new File([blob], name, { type: 'video/mp4' }));
          } else {
            formData.append('videos', {
              uri,
              name,
              type: 'video/mp4',
            } as any);
          }
        }
  
        // Общие поля
        formData.append('description', description);
        formData.append('hashtags', JSON.stringify(extractedHashtags));
        formData.append('mentions', JSON.stringify(extractedMentions));
        formData.append('isEmergency', String(postSettings.isEmergency));
  
        if (postSettings.cityId) {
          formData.append('cityId', postSettings.cityId);
        }
  
        return formData;
      };
  
      if (postSettings.target === 'self') {
        const formData = await createFormData();
        formData.append('from', 'user'); // всегда от себя
        await createPost(formData);
      } else {
        if (subdivisionIds.length === 0) {
          Toast.show({ type: 'error', text1: 'Не выбраны подразделения' });
          return;
        }
  
        await Promise.all(
          subdivisionIds.map(async (subId) => {
            const formData = await createFormData();
            formData.append('from', postSettings.from);
            formData.append('subdivisionId', subId);
            await createPost(formData);
          })
        );
      }
  
      Toast.show({ type: 'success', text1: 'Пост опубликован!' });
  
      // Сброс
      setStep(0);
      setMedia({ photos: [], videos: [] });
      setDescription('');
      setHashtags([]);
      setMentions([]);
      router.replace('/home');
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
      Toast.show({ type: 'error', text1: 'Ошибка при публикации' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <PostSettingsStep onNext={goNext} setPostSettings={setPostSettings} key="settings" />,
    <SelectMediaStep media={media} setMedia={setMedia} onNext={goNext} key="select" />,
    <PreviewMediaStep media={media} setMedia={setMedia} onNext={goNext} onBack={goBack} key="preview" />,
    <ComposePostStep
      media={media}
      description={description}
      hashtags={hashtags}
      mentions={mentions}
      setDescription={setDescription}
      setHashtags={setHashtags}
      setMentions={setMentions}
      removePhoto={(index) =>
        setMedia((prev) => ({
          ...prev,
          photos: prev.photos.filter((_, i) => i !== index),
        }))
      }
      removeVideo={(index) =>
        setMedia((prev) => ({
          ...prev,
          videos: prev.videos.filter((_, i) => i !== index),
        }))
      }
      onBack={goBack}
      onSubmit={handleSubmitPost}
      key="compose"
    />,
  ];  

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {steps[step]}
      </View>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </View>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    paddingTop: 58,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
