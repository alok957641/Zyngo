// components/Layout.jsx
import React from "react";
import UserNav from "./UserNav"; // Ya jo bhi tera nav hai
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNav /> {/* Navbar sabse upar */}
      
      <main className="flex-grow">
        {children} {/* Yahan tera saara page content aayega */}
      </main>
      
      <Footer /> {/* Footer hamesha bottom mein chipka rahega */}
    </div>
  );
};

export default Layout;