
import React from 'react';

export interface User {
  name: string;
  birthDate: string;
  phone: string;
}

export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  icon?: React.ReactNode;
}

export interface BookedSlot {
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    duration: number; // in minutes
}
