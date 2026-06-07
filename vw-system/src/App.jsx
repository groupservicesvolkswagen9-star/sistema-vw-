import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {

  const [user,setUser] = useState(null);

  // ✅ DARK MODE GLOBAL
  const [dark,setDark] = useState(false);

  const toggleDark = ()=>{
    setDark(!dark);
  };

  return (
    <div className={dark ? "app dark" : "app"}>

      {!user ? (
        <Login setUser={setUser}/>
      ) : (
        <Dashboard
          user={user}
          setUser={setUser}
          dark={dark}
          toggleDark={toggleDark}
        />
      )}

    </div>
  );
}