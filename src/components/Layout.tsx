import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import style from "@/styles/Layout.module.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div id={style.container}>
      <Navbar />
      <div id={style.content}>{children}</div>
      <div id={style.footer}>
        <Footer />
      </div>
    </div>
  );
}
