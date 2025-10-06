import React, {useEffect, useState} from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import BaseModal from '../molecules/modal';
import DocCompactSlot, {FileRef} from '../molecules/DocCompactSlot';
import DocPreviewModal from '../molecules/DocPreviewModal';
import {UserWithDocs} from '../../lib/types/userDocs.ts';
import rootStore from '../../lib/stores/rootStore';
import i18n from 'i18next';
import * as ImagePicker from 'react-native-image-picker';
import {
  pick,
  keepLocalCopy,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker'; // ← nueva API
import useApi from '../../lib/hooks/useApi.ts';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  endpoint?: string;
};

type SlotState = {
  existingUrl?: string | null;
  pending?: FileRef; // { uri: string; name?; type? } | null
};

export default function UploadDocumentsModal({
  visible,
  onDismiss,
  endpoint,
}: Props) {
  const userId = rootStore.userStore.user?.id as number | undefined;

  // 4 slots
  const [docFront, setDocFront] = useState<SlotState>({});
  const [docBack, setDocBack] = useState<SlotState>({});
  const [licFront, setLicFront] = useState<SlotState>({});
  const [licBack, setLicBack] = useState<SlotState>({});

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const api = useApi();

  useEffect(() => {
    if (!visible || !userId) return;
    api.getUserWithDocs(userId).handle({
      onSuccess: (u: UserWithDocs) => {
        const doc = u.documents.find(d => d.type === 'document');
        const lic = u.documents.find(d => d.type === 'license');

        setDocFront({existingUrl: doc?.frontFilePath ?? null, pending: null});
        setDocBack({existingUrl: doc?.backFilePath ?? null, pending: null});
        setLicFront({existingUrl: lic?.frontFilePath ?? null, pending: null});
        setLicBack({existingUrl: lic?.backFilePath ?? null, pending: null});
      },
    });
  }, [visible, userId]);

  const anyPending = Boolean(
    docFront.pending || docBack.pending || licFront.pending || licBack.pending,
  );

  // ---- helpers
  type SlotSetter = React.Dispatch<React.SetStateAction<SlotState>>;

  const pickFromCamera = async (setter: SlotSetter) => {
    const res = await ImagePicker.launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });
    const uri = res.assets?.[0]?.uri;
    if (!uri) return;
    const name = res.assets?.[0]?.fileName ?? 'camera.jpg';
    const mime = res.assets?.[0]?.type ?? 'image/jpeg';
    setter(prev => ({...prev, pending: {uri, name, type: mime}}));
  };

  const pickFromGallery = async (setter: SlotSetter) => {
    const res = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    const uri = res.assets?.[0]?.uri;
    if (!uri) return;
    const name = res.assets?.[0]?.fileName ?? 'photo.jpg';
    const mime = res.assets?.[0]?.type ?? 'image/jpeg';
    setter(prev => ({...prev, pending: {uri, name, type: mime}}));
  };

  const pickFromFile = async (setter: SlotSetter) => {
    try {
      // 1) elegir archivo(s)
      const [res] = await pick({
        type: [types.images, types.pdf],
        // allowMultiSelection: false por defecto
      });

      // 2) crear copia local en cachesDirectory (recomendado)
      const [copy] = await keepLocalCopy({
        destination: 'cachesDirectory',
        files: [{uri: res.uri, fileName: res.name ?? 'file'}],
      });

      const finalUri = copy?.status === 'success' ? copy.localUri : res.uri;

      setter(prev => ({
        ...prev,
        pending: {
          uri: finalUri,
          name: res.name ?? 'file',
          type: res.type ?? 'application/octet-stream',
        },
      }));
    } catch (e) {
      // cancelar = OPERATION_CANCELED
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      // cualquier otro error
      console.warn('DocPicker error', e);
    }
  };

  const clearPending = (setter: SlotSetter) =>
    setter(prev => ({...prev, pending: null}));

  const openPreview = (s: SlotState) => {
    const uri = s.pending?.uri ?? s.existingUrl ?? null;
    if (!uri) return;
    setPreviewUri(uri);
    setPreviewOpen(true);
  };

  const submit = () => {
    if (!anyPending) {
      onDismiss();
      return;
    }
    api
      .uploadIdentityDocs(
        {
          document_front: docFront.pending ?? undefined,
          document_back: docBack.pending ?? undefined,
          license_front: licFront.pending ?? undefined,
          license_back: licBack.pending ?? undefined,
        },
        endpoint,
      )
      .handle({
        onSuccess: () => {
          rootStore.uiStore.showSnackbar(
            i18n.t('docs.uploadSuccess'),
            'success',
          );
          onDismiss();
        },
        onError: () => {
          rootStore.uiStore.showSnackbar(i18n.t('docs.uploadError'), 'danger');
        },
      });
  };

  const maxH = Math.round(Dimensions.get('window').height * 0.75);

  return (
    <>
      <BaseModal
        isVisible={visible}
        onDismiss={onDismiss}
        title={i18n.t('docs.title')}
        content={
          <ScrollView style={{maxHeight: maxH}}>
            <Text variant="bodyMedium" style={{opacity: 0.8, marginBottom: 8}}>
              {i18n.t('docs.subtitle')}
            </Text>

            <View style={{gap: 8}}>
              <DocCompactSlot
                label={i18n.t('docs.documentFront')}
                uploadedUrl={docFront.existingUrl}
                pendingFile={docFront.pending}
                onPreview={() => openPreview(docFront)}
                onPickCamera={() => pickFromCamera(setDocFront)}
                onPickGallery={() => pickFromGallery(setDocFront)}
                onPickFile={() => pickFromFile(setDocFront)}
                onClear={() => clearPending(setDocFront)}
              />
              <DocCompactSlot
                label={i18n.t('docs.documentBack')}
                uploadedUrl={docBack.existingUrl}
                pendingFile={docBack.pending}
                onPreview={() => openPreview(docBack)}
                onPickCamera={() => pickFromCamera(setDocBack)}
                onPickGallery={() => pickFromGallery(setDocBack)}
                onPickFile={() => pickFromFile(setDocBack)}
                onClear={() => clearPending(setDocBack)}
              />
              <DocCompactSlot
                label={i18n.t('docs.licenseFront')}
                uploadedUrl={licFront.existingUrl}
                pendingFile={licFront.pending}
                onPreview={() => openPreview(licFront)}
                onPickCamera={() => pickFromCamera(setLicFront)}
                onPickGallery={() => pickFromGallery(setLicFront)}
                onPickFile={() => pickFromFile(setLicFront)}
                onClear={() => clearPending(setLicFront)}
              />
              <DocCompactSlot
                label={i18n.t('docs.licenseBack')}
                uploadedUrl={licBack.existingUrl}
                pendingFile={licBack.pending}
                onPreview={() => openPreview(licBack)}
                onPickCamera={() => pickFromCamera(setLicBack)}
                onPickGallery={() => pickFromGallery(setLicBack)}
                onPickFile={() => pickFromFile(setLicBack)}
                onClear={() => clearPending(setLicBack)}
              />
            </View>
          </ScrollView>
        }
        actions={[
          {text: i18n.t('common.cancel'), onPress: onDismiss},
          {
            text: i18n.t('common.upload'),
            onPress: submit,
            mode: 'contained',
            style: {opacity: anyPending ? 1 : 0.6},
          },
        ]}
      />
      <DocPreviewModal
        visible={previewOpen}
        onDismiss={() => setPreviewOpen(false)}
        uri={previewUri ?? undefined}
        title={i18n.t('docs.title')}
      />
    </>
  );
}
