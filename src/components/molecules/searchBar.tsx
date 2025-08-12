// components/molecules/MainSearchBar.tsx
import {useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Avatar, Searchbar} from 'react-native-paper';

import {useTheme} from '../../lib/hooks/useAppTheme.ts';
import {SearchBarNavProp} from '../../lib/types/navigation.ts';
import UserAccountModal from '../organisms/userAccountModal.tsx';

type Props = {
  text: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

const MainSearchBar = ({text, onChangeText, placeholder}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<SearchBarNavProp>();
  const [userAccountModalOpen, setUserAccountModalOpen] = useState(false);

  return (
    <View
      style={{backgroundColor: theme.colors.background, paddingHorizontal: 16}}>
      <Searchbar
        mode="bar"
        placeholder={placeholder ?? t('common.search')}
        value={text}
        onChangeText={onChangeText} // single source of truth
        icon="menu"
        onIconPress={() => navigation.openDrawer()}
        right={props => (
          <Avatar.Image
            {...props}
            size={30}
            source={require('../../assets/images/defaultAvatar.png')}
            onTouchEnd={() => setUserAccountModalOpen(true)}
          />
        )}
      />
      <UserAccountModal
        onDismiss={() => setUserAccountModalOpen(false)}
        isVisible={userAccountModalOpen}
      />
    </View>
  );
};

export default MainSearchBar;
