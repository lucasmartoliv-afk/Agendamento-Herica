
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
  photo?: string; // Base64 encoded image
}

export interface BookedSlot {
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    duration: number; // in minutes
    userName: string;
    userPhone: string;
    services: Service[];
}

export interface ScheduleException {
  date: string; // YYYY-MM-DD
  isWorking: boolean;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface AvailabilitySettings {
  workDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  exceptions: ScheduleException[];
}
