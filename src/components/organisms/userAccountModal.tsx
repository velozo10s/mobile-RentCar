import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseModal from '../molecules/modal';
import {Button, Text} from 'react-native-paper';
import rootStore from '../../lib/stores/rootStore';
import UploadDocumentsModal from './UploadDocumentsModal';

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

export default function UserAccountModal({isVisible, onDismiss}: Props) {
  const {t} = useTranslation();
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <>
      <BaseModal
        title={t('modals.userAccount.title', {
          username: rootStore.userStore.user?.username,
        })}
        isVisible={isVisible}
        onDismiss={onDismiss}
        content={
          <>
            <Text>{t('modals.userAccount.greeting')}</Text>
            <Button
              style={{marginTop: 12}}
              mode="contained-tonal"
              icon="file-upload"
              onPress={() => setDocsOpen(true)}>
              {t('docs.open')}
            </Button>
          </>
        }
        actions={[{text: t('common.close'), onPress: onDismiss}]}
      />
      <UploadDocumentsModal
        visible={docsOpen}
        onDismiss={() => setDocsOpen(false)}
        // endpoint="/users/me/documents" // o el que decidas
      />
    </>
  );
}
