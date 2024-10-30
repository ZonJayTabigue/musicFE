"use client"
import store from "@/store/store";
// import Image from "next/image";
import HomePage from "./homepage/page";
import { Provider } from 'react-redux';

export default function Home() {
  return (
    <Provider store={store}>
      <HomePage />
    </Provider>
  );
}
