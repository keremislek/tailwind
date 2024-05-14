import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import Campaigns from '../components/Campaigns';
import Favorites from '../components/Favorites';
import MobileApp from '../components/MobileApp';
import Cards from '../components/Cards';


export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token bulunamadı");
      return;
    }

    const tokenString = token.toString();
    const decoded = jwtDecode(tokenString);
    const firstRole = decoded.role[0].authority;

    if (firstRole !== "Customer") {
      return <Navigate to="barberHome"/>
    }


  return (
    <div>
    <HeroSection/>
    <Categories/>
    <Campaigns/>
      <div className="container mx-auto grid gap-y-6">
        <Favorites/>
        <MobileApp/>
        <Cards/>
      </div>
    </div>
    
    
  )
}