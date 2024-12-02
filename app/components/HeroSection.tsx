"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const HeroSection: React.FC = () => {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightRef.current) {
      gsap.fromTo(
        lightRef.current,
        { x: '-100%' },
        { x: '100%', duration: 2, repeat: 0, ease: 'power3.inOut' }
      );
    }
  }, []);

  return (
    <div className="relative w-full mt-5 h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618407781065-d2c88be9dbd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3Mjh8MHwxfGFsbHwxfHx8fHx8fHwxNjE3MTczNjA1&ixlib=rb-1.2.1&q=80&w=1080')" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 opacity-70"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-white text-center p-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent">
          Second Round
        </h1>
        <p className="text-xl md:text-2xl mb-8">Experience cutting-edge technology and design with the new iPhone models.</p>
        <Link href="#iphones" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-200 hover:bg-blue-500">
          Shop Now
        </Link>
        <div className="relative mt-8">
          <img
            src="https://imgur.com/a/ossPTPY"
            alt="iPhone"
            className="w-128 h-auto"
          />
          <div
            ref={lightRef}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
