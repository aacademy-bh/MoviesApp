import { createContext } from "react";

// //// TYPES!!
const AppContext = createContext();

// function Context({ children }) {
//     const [isAuth, setIsAuth] = useState();
  
//     return (
//       <AppContext.Provider value={{ isAuth, setIsAuth }}>
//         {children}
//       </AppContext.Provider>
//     );
//   }

export default AppContext