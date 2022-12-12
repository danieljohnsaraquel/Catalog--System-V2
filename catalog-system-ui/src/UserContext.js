import React, {useContext, useState} from 'react'

const UserContext = React.createContext()

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({children}) {
    const [userObject, setUserObject] = useState({})
    
    return (
        <UserContext.Provider 
        value={{
            userObject,
            setUserObject,
            }}>
            {children}
        </UserContext.Provider>
    )
}
