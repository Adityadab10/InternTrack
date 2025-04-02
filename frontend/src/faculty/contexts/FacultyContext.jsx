import { createContext, useContext, useState } from 'react';

const FacultyContext = createContext();

export const FacultyProvider = ({ children }) => {
  const [facultyData, setFacultyData] = useState({
    students: [],
    mentors: [],
    internships: [],
    isLoading: false,
    error: null
  });

  return (
    <FacultyContext.Provider value={{ facultyData, setFacultyData }}>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => useContext(FacultyContext);