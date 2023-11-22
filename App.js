import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigations/RootNavigations';
import { Provider } from 'react-redux';
import reduxStore from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {

  const { store, persistor } = reduxStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>

  )
}

export default App;
