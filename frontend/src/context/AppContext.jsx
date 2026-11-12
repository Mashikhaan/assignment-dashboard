import { createContext } from "react";
import API from "../services/api.js";
import { useState, useContext, useEffect } from "react";


//create a context for the app
const AppContext = createContext();

//create a provider component for the app context
export const AppProvider = ({ children }) => {

    //current user state, loading state
    const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(true);


    //current assignment state, initialized from local storage if available
    const [assignments, setAssignments] = useState(() => {
        //get the assignments from the local storage
        const savedAssignments = localStorage.getItem("assignments");

        return savedAssignments ? JSON.parse(savedAssignments) : [];
    })

     // Check logged-in user
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await API.get("/auth/me");
                setCurrentUser(data.user);
            } catch (error) {
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    //register function
    const register = async (name, email, password, role) => {
    try {
        const { data } = await API.post("/auth/register", {
            name,
            email,
            password,
            role
        });

        setCurrentUser(data.user);

        return data;
    } catch (error) {
        throw error;
    }
};

    //set assignments in local storage whenever the assignments state changes
    useEffect(() => {
        localStorage.setItem("assignments", JSON.stringify(assignments))
    }, [assignments])

    //login function
    const login = async (email, password) => {
    try {
        const { data } = await API.post("/auth/login", {
            email,
            password
        });

        setCurrentUser(data.user);

        return data;
    } catch (error) {
        throw error;
    }
};

    //logout function
   const logout = async () => {
    try {
        await API.post("/auth/logout");
        setCurrentUser(null);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

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

    //Submit Assignment function
    const submitAssignment = (assignmentId, studentId) => {
        setAssignments((prevAssignments) => 
            prevAssignments.map((assignment) =>
            assignment.id === assignmentId ? {...assignment, submissions: {...assignment.submissions, [studentId]: "Submitted"}} : assignment
            )
        )
    }

    return (
        <AppContext.Provider value={{currentUser,loading,register, login, logout, assignments, addAssignment, updateAssignment, deleteAssignment, submitAssignment}}>
            {children}
        </AppContext.Provider>
    )
}



//create a custom hook to use the app context

export const useAppContext = () => useContext(AppContext);