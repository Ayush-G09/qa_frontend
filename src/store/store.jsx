import { createStore } from 'redux';
import themeReducer from './themeReducer';

const store = createStore(themeReducer);

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("mode", state.mode);
  localStorage.setItem("isUserLoggedIn", state.isUserLoggedIn);
});

export default store;
