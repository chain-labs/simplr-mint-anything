import React from "react";

const initialState = { user: "", connected: false };

export const UserContext = React.createContext(initialState);

function UserProvider({ children }) {
  return (
    <UserContext.Provider value={initialState}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
