import React from 'react';
import {View} from 'react-native';
import {Chip, IconButton, Text} from 'react-native-paper';

export type FileRef = {uri: string; name?: string; type?: string} | null;

type Props = {
  label: string;
  uploadedUrl?: string | null; // lo que viene del backend (si ya tiene)
  pendingFile?: FileRef; // si el usuario eligió uno nuevo (aún sin subir)
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickFile: () => void;
  onClear: () => void;
  onPreview: () => void;
};

export default function DocCompactSlot({
  label,
  uploadedUrl,
  pendingFile,
  onPickCamera,
  onPickGallery,
  onPickFile,
  onClear,
  onPreview,
}: Props) {
  const hasExisting = !!uploadedUrl;
  const hasPending = !!pendingFile?.uri;

  const status = hasPending ? 'Pending' : hasExisting ? 'Uploaded' : 'Missing';
  const statusColor = hasPending ? 'orange' : hasExisting ? 'green' : 'gray';

  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e3e3e3',
        padding: 10,
        gap: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text variant="titleSmall">{label}</Text>
        <Chip
          compact
          style={{
            backgroundColor: '#0000',
            borderColor: statusColor,
            borderWidth: 1,
          }}>
          <Text style={{color: statusColor}}>{status}</Text>
        </Chip>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* Ver */}
        <IconButton
          icon="eye"
          mode="contained-tonal"
          onPress={onPreview}
          disabled={!hasExisting && !hasPending}
          accessibilityLabel="Preview"
          size={20}
        />
        {/* Cámara */}
        <IconButton
          icon="camera"
          mode="contained-tonal"
          onPress={onPickCamera}
          size={20}
        />
        {/* Galería */}
        <IconButton
          icon="image"
          mode="contained-tonal"
          onPress={onPickGallery}
          size={20}
        />
        {/* Archivo */}
        <IconButton
          icon="file"
          mode="contained-tonal"
          onPress={onPickFile}
          size={20}
        />
        {/* Limpiar */}
        <IconButton
          icon="close"
          mode="contained-tonal"
          onPress={onClear}
          size={18}
          disabled={!hasPending}
          accessibilityLabel="Clear pending"
        />
      </View>
    </View>
  );
}
