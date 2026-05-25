// components/Layout.jsx
import React from "react";
import UserNav from "../src/components/UserNav"; 
import OwnerNav from "../src/components/OwnerNav"
import Footer from "../src/components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNav /> {/* Navbar sabse upar */}
      <OwnerNav />
      <main className="flex-grow">
        {children} {/* Yahan tera saara page content aayega */}
      </main>
      
      <Footer /> {/* Footer hamesha bottom mein chipka rahega */}
    </div>
  );
};

export default Layout;