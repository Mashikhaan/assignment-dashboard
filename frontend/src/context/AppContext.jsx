
import { createContext } from "react";
import API from "../services/api.js";
import { useState, useContext, useEffect } from "react";

// Create a context for the app
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // Current user state and loading state
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Courses state
  const [courses, setCourses] = useState([]);

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

  // Register function
  const register = async (name, email, password, role) => {
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setCurrentUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      setCurrentUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setCurrentUser(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Fetch courses
  const getCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      setCourses(data.courses || []);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Create course
  const addCourse = async (courseData) => {
    try {
      const { data } = await API.post("/courses/create", courseData);

      setCourses((prev) => [...prev, data.course]);

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update course
  const updateCourse = async (courseId, courseData) => {
    try {
      const { data } = await API.put(
        `/courses/${courseId}`,
        courseData
      );

      await getCourses();

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    try {
      const { data } = await API.delete(`/courses/${courseId}`);

      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );

      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        loading,
        register,
        login,
        logout,
        courses,
        getCourses,
        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);
