import React from 'react';
import {initialState } from "./reducer"

export const UserContext = React.createContext({
    state: initialState,
    dispatch: () => null
  }); 