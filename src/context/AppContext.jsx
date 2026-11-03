import { createContext } from "react";
import { users} from "../data/seedData.js";



//create a context for the app
const AppContext = createContext();

//create a provider component for the app context
export const AppProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(() => {
        //get the current user from the local storage
        const savedUser = localStorage.getItem("currentUser");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    //login function
    const login = (userId) =>{
        const selectedUser = users.find(
            (user) => user.id === userId
        )

        if(!selectedUser){
            alert("User not found");
        }

        setCurrentUser(selectedUser);

        //save current user in local storage
        localStorage.setItem("currentUser", JSON.stringify(selectedUser));
    }

    //logout function
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    }

    return (
        <AppContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AppContext.Provider>
    )
}



//create a custom hook to use the app context

export const useAppContext = () => useContext(AppContext);