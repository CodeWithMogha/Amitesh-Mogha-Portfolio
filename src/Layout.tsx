import React from "react";
import Footer from "./components/footer"; // adjust path if needed

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* your navbar/header here */}

      {children}

      {/* ✅ Footer MUST be rendered */}
      <Footer />
    </>
  );
};

export default Layout;