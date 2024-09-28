import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import SelectBox from '@/src/components/buttons/selects/SelectBox';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/src/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { chooseStoryTheme } from '@/src/store/reducers/SettingsSlice';
import { ISelectOption } from '@/src/typing/settings';
import LoaderView from '@/src/components/loaders/loaderView';
import { getHistoryOptions, getSelectedThemes } from '@/src/store/selectors/selectors';
import { useLoadStoryByIdQuery } from '@/src/services/StoryService';
import { useDidUpdate } from '@/src/hooks/useDidUpdate';
import Auth from '@/src/components/auth/Auth';
import ToggleConfigList from '@/src/components/buttons/toggles/ToggleConfig';

const Settings: React.FC = () => {
  const scrollY = new Animated.Value(0);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState(false);
  const [isToggleExpanded, setToggleExpanded] = useState(false);

  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const toggleConfig = useAppSelector(state => state.settings.toggleConfig);
  const isDarkMode = toggleConfig.darkMode?.checked;

  const historyOptions = useAppSelector(getHistoryOptions);
  const selectedThemesFromStore = useAppSelector(getSelectedThemes);

  const [selectedTheme, setSelectedTheme] = useState<ISelectOption[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ISelectOption | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);

  const {
    isLoading,
  } = useLoadStoryByIdQuery(storyId || '', {
    skip: !storyId,
  });

  useDidUpdate(() => {
    if (!isLoading && storyId) {
      setFetching(true);
      const timer = setTimeout(() => {
        navigation.navigate('index', { storyId });
        setSelectedHistory(null);
        setStoryId(null);
        setFetching(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedHistory, isLoading, storyId, navigation]);

  useDidUpdate(() => {
    dispatch(chooseStoryTheme(selectedTheme));
  }, [selectedTheme, dispatch]);

  const handleSelectHistory = (selected: ISelectOption | null) => {
    if (selected) {
      const isValid = historyOptions.some(option => option.value === selected.value);
      if (isValid) {
        setStoryId(selected.value);
        setSelectedHistory(selected);
      } else {
        setSelectedHistory(null);
      }
    } else {
      setSelectedHistory(null);
    }
  };

  const styles = getStyles(isDarkMode);

  if (fetching) {
    return <LoaderView />;
  };

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.titleContainer, { top: 0, left: 0, right: 0 }]}>
            <ThemedText type="title" style={styles.titleText}>Настройки</ThemedText>
        </Animated.View>
        
        <Animated.ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.contentContainer, { marginTop: 80, paddingTop: 10 }]}
            scrollEventThrottle={16}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            keyboardShouldPersistTaps="always"
        >
            <View style={styles.userContainer}>
                <Auth isDarkMode={isDarkMode} />
            </View>
            
            <SelectBox
                title='Темы сказок'
                options={selectedThemesFromStore}
                selected={selectedTheme}
                onSelect={setSelectedTheme}
                itemType='checkbox'
                isDarkMode={isDarkMode}
            />
            
            { isAuthenticated && (
                <SelectBox
                    title='История'
                    options={historyOptions}
                    selected={selectedHistory}
                    onSelect={handleSelectHistory}
                    itemType="link"
                    isDarkMode={isDarkMode}
                />
            )}
            
            <ToggleConfigList isExpanded={isToggleExpanded} toggleExpand={() => setToggleExpanded(prev => !prev)} />
        </Animated.ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#222222' : '#fafafa',
      marginTop: 20,
  },
  titleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: 20,
      paddingBottom: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#333333' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#666666' : '#e0e0e0',
      zIndex: 1,
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
  },
  titleText: {
      fontSize: 32,
      color: isDarkMode ? '#ffffff' : '#333333',
      fontWeight: '700',
      alignItems: 'center',
  },
  contentContainer: {
      marginTop: 110,
      paddingVertical: 24,
      paddingHorizontal: 20,
      paddingBottom: 120,
  },
  userContainer: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#333333' : '#ffffff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: isDarkMode ? '#555555' : '#dddddd',
  },
});

export default Settings;