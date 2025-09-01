import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider as PaperProvider} from 'react-native-paper';

function renderWithProviders(ui: React.ReactElement) {
  const Wrapper = ({children}: any) => (
    <PaperProvider
      settings={{
        // renderiza un placeholder para cualquier icono
        icon: props => <></>,
      }}>
      {children}
    </PaperProvider>
  );
  return render(ui, {wrapper: Wrapper});
}

export {renderWithProviders};
