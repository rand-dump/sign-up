import { createStore } from 'redux';

const USER_KEY = 'signup_user';
const TOKEN_KEY = 'signup_access_token';

function readStoredUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/signUp':
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      return action.payload;
    case 'auth/logout':
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return { user: null, token: null };
    default:
      return state;
  }
};

export const store = createStore(authReducer);

export const signUp = (user, token) => ({
  type: 'auth/signUp',
  payload: { user, token },
});

export const logout = () => ({ type: 'auth/logout' });
