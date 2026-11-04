import { createContext } from "react";
import { users} from "../data/seedData.js";
import { useState, useContext, useEffect } from "react";


//create a context for the app
const AppContext = createContext();

//create a provider component for the app context
export const AppProvider = ({ children }) => {

    //current user state, initialized from local storage if available
    const [currentUser, setCurrentUser] = useState(() => {
        //get the current user from the local storage
        const savedUser = localStorage.getItem("currentUser");

        return savedUser ? JSON.parse(savedUser) : null;
    });


    //current assignment state, initialized from local storage if available
    const [assignments, setAssignments] = useState(() => {
        //get the assignments from the local storage
        const savedAssignments = localStorage.getItem("assignments");

        return savedAssignments ? JSON.parse(savedAssignments) : [];
    })

    //set assignments in local storage whenever the assignments state changes
    useEffect(() => {
        localStorage.setItem("assignments", JSON.stringify(assignments))
    }, [assignments])

    //login function
    const login = (userId) =>{
        const selectedUser = users.find(
            (user) => user.id === userId
        )

        if(!selectedUser){
            alert("User not found");
            return;
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

    //Add Assignment function
    const addAssignment = (assignmentData) => {

        const newAssignment = {
            id:window.crypto.randomUUID(),
            ...assignmentData,
            createdBy: currentUser.id,
            submissions: Object.fromEntries(
                assignmentData.assignedTo.map((studentId) => [
                    studentId,
                    "pending"
                ])
            )
        }

        setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
    }

    //Update Assignment function
    const updateAssignment = (assignmentId, updatedData) => {
        setAssignments((prevAssignments) =>
            prevAssignments.map((assignment) => 
                assignment.id === assignmentId ? {...assignment, ...updatedData, submissions: Object.fromEntries(updatedData.assignedTo.map((studentId) => [studentId, "pending"]))} : assignment
            ))
    }

    //Delete Assignment function
    const deleteAssignment = (assignmentId) => {
        setAssignments((prevAssignments) => 
        prevAssignments.filter((assignment) => assignment.id !== assignmentId))
    }

    return (
        <AppContext.Provider value={{currentUser, login, logout, assignments, addAssignment, updateAssignment, deleteAssignment}}>
            {children}
        </AppContext.Provider>
    )
}



//create a custom hook to use the app context

export const useAppContext = () => useContext(AppContext);