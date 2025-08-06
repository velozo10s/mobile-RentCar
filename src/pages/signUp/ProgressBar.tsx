import React from 'react';
import {View, Text} from 'react-native';
import {ProgressBar as PaperProgress} from 'react-native-paper';

export interface ProgressBarProps {
  currentStep: number;
  total: number;
}

export default function ProgressBar({currentStep, total}: ProgressBarProps) {
  const progress = currentStep / total;

  return (
    <View style={{marginBottom: 20}}>
      <Text>{`Step ${currentStep} of ${total}`}</Text>
      <PaperProgress progress={progress} />
    </View>
  );
}
