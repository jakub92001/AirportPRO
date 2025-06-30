
import React from 'react';

type IconName = 'plane' | 'plane-sm' | 'plane-md' | 'plane-lg' | 'gate' | 'money' | 'reputation' | 'time' | 'weather' | 'crew' | 'catering' | 'fuel' | 'baggage' | 'stairs' | 'parking' | 'bus' | 'train' | 'cargoloader' | 'cargotransporter' | 'box' | 'layout' | 'schedule' | 'contract' | 'fuel-tank' | 'garage' | 'wrench' | 'building' | 'clipboard-check' | 'follow-me' | 'ambulance' | 'fire-truck' | 'snowplow' | 'warning' | 'forklift' | 'truck' | 'users' | 'atc' | 'warehouse-staff' | 'marketing' | 'check-in' | 'baggage-handler' | 'maintenance-tech' | 'security' | 'passenger-service' | 'logistician' | 'admin' | 'hr-manager' | 'pushback' | 'deicing' | 'terminal' | 'ticket' | 'shield-check' | 'shop' | 'food';

interface IconProps {
  name: IconName;
  className?: string;
}

const icons: Record<IconName, React.ReactNode> = {
  plane: (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M21.63,12.23l-7.33-6.99C14.13,5.06,14,5,13.82,5H11.5a1,1,0,0,0-1,1V9.29l-3.2-3.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.42L8.71,10.5H4a1,1,0,0,0,0,2H8.71L5.88,15.34a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3.2-3.05V17a1,1,0,0,0,1,1h2.32c.18,0,.35-.06,.49-.18l7.33-7A1,1,0,0,0,21.63,12.23Z"/>
    </svg>
  ),
  'plane-sm': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M20.57 11.43a1 1 0 0 0-.84-.9l-5.73-1.2V5.41a3.94 3.94 0 1 0-2 0v3.92L6.27 10.53a1 1 0 0 0-.84.9L4 16.14V18a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-1h11v1a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-1.86ZM6.5 14h11v-1.15l-1.38-.28-3.46-.72h-1.32l-3.46.72L6.5 12.85Z"/>
    </svg>
  ),
  'plane-md': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M21.63,12.23l-7.33-6.99C14.13,5.06,14,5,13.82,5H11.5a1,1,0,0,0-1,1V9.29l-3.2-3.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.42L8.71,10.5H4a1,1,0,0,0,0,2H8.71L5.88,15.34a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3.2-3.05V17a1,1,0,0,0,1,1h2.32c.18,0,.35-.06,.49-.18l7.33-7A1,1,0,0,0,21.63,12.23Z"/>
    </svg>
  ),
  'plane-lg': (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M22,14.5a2.5,2.5,0,0,0-2-2.45V8.5a2.5,2.5,0,0,0-5,0v1H9V8.5a2.5,2.5,0,0,0-5,0v3.55a2.5,2.5,0,0,0-2,2.45V16a1,1,0,0,0,1,1h1v3a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V17h8v3a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V17h1a1,1,0,0,0,1-1ZM6,14a1,1,0,1,1,1-1A1,1,0,0,1,6,14Zm12,0a1,1,0,1,1,1-1A1,1,0,0,1,18,14Z"/>
    </svg>
  ),
  gate: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899l4-4a4 4 0 10-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  money: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM5 12a7 7 0 1014 0 7 7 0 00-14 0z" />
    </svg>
  ),
  reputation: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  time: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  weather: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.09A4.001 4.001 0 003 15z" />
    </svg>
  ),
  crew: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  catering: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M21 8.5H3.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1H4v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h8v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h.5a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1Zm-15.5 5v-4h14v4Z"/><path d="M8 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4h5Z"/>
    </svg>
  ),
  fuel: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18 6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6Zm-2 4h-2V8a1 1 0 0 1 2 0Z"/><path d="M22 11h-2V8a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3h2v-2Z"/>
    </svg>
  ),
  baggage: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M11 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-8Zm1 4h2v2h-2Z"/><path d="M9 18a2 2 0 1 0-2-2a2 2 0 0 0 2 2Zm8 0a2 2 0 1 0-2-2a2 2 0 0 0 2 2Z"/>
    </svg>
  ),
  stairs: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M21 8h-2.12l-5-5-1.76 1.76L15.36 8H12V5H9v5.36L6.76 8.12 5 9.88l5 5V18a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1ZM7 18a2 2 0 1 0-2-2a2 2 0 0 0 2 2Zm12 0a2 2 0 1 0-2-2a2 2 0 0 0 2 2Z"/>
    </svg>
  ),
  parking: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
    </svg>
  ),
  bus: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18 4H6C4.9 4 4 4.9 4 6v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z"/>
    </svg>
  ),
  train: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2.23v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm5.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 11H6V6h12v5z"/>
    </svg>
  ),
  cargoloader: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20.1 6.23l-3.5-2.57a1 1 0 0 0-1.2.13l-6.53 8.3A2 2 0 0 0 8 13v1H3V9h3V7H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.18A3 3 0 0 0 8 16h8a3 3 0 0 0 3.82-2H21a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1.6l-.3-1.77zM10.7 13l5-6.37 1.54 1.13-5 6.37z" />
    </svg>
  ),
  cargotransporter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M15 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 5v9H9V8h3a1 1 0 0 0 1-1V5h4zM8.5 16H2V8h5.5zM22 16h-6.5V8H22z" />
    </svg>
  ),
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21 5a1 1 0 0 0-1-1h-6.58l-2-2H8.58l-2 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1zM12 17l-4-4h2.5V9h3v4H16z" />
    </svg>
  ),
  building: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM9 7H7v2h2zm0 4H7v2h2zm0 4H7v2h2zm8-8h-6v2h6zm0 4h-6v2h6zm0 4h-6v2h6z"/>
    </svg>
  ),
  layout: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/>
    </svg>
  ),
  schedule: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"/>
    </svg>
  ),
  contract: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  'fuel-tank': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19.5,8H17V6a3,3,0,0,0-3-3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V16h2.5a1.5,1.5,0,0,0,0-3H17V11h2.5a1.5,1.5,0,0,0,0-3ZM15,18a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V6A1,1,0,0,1,6,5h8a1,1,0,0,1,1,1Z"/>
    </svg>
  ),
  garage: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M20 7H4c-1.1 0-2 .9-2 2v10a1 1 0 0 0 1 1h1v-4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4h1a1 1 0 0 0 1-1V9c0-1.1-.9-2-2-2zM6 14h3v2H6v-2zm5 0h3v2h-3v-2z" />
        <path d="M22 6l-1.42-1.42a1 1 0 0 0-1.41 0L12 11.17 4.83 4.58a1 1 0 0 0-1.41 0L2 6l10 10z"/>
    </svg>
  ),
  wrench: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M22.7 13.4L21 11.7c.2-.5.3-1.1.3-1.7s-.1-1.2-.3-1.7l1.7-1.7c.4-.4.4-1 0-1.4l-3-3c-.4-.4-1-.4-1.4 0l-1.7 1.7C15.7 5.1 15.1 5 14.5 5s-1.2.1-1.7.3L11.1 3.6c-.4-.4-1-.4-1.4 0l-3 3c-.4.4-.4 1 0 1.4l1.7 1.7c-.2.5-.3 1.1-.3 1.7s.1 1.2.3 1.7l-1.7 1.7c-.4-.4-.4 1 0 1.4l3 3c.4.4 1 .4 1.4 0l1.7-1.7c.5.2 1.1.3 1.7.3s1.2-.1 1.7-.3l1.7 1.7c.4.4 1 .4 1.4 0l3-3c.4-.4.4-1 0-1.4zM12 15c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
    </svg>
  ),
  'clipboard-check': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16 2H8C6.9 2 6 2.9 6 4v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3.25-5.25L11 19l-2.25-2.25L10.16 15.4l.84.84L14.59 13l1.66 1.75zM17 9H7V4h10v5z"/>
    </svg>
  ),
  'follow-me': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.3 1.5-1.3s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  ),
   'ambulance': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 8h-1V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3h1c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1zM4 17V6h12v11H4zm10-6H9v2H7v-2H5v-2h2V7h2v2h2v2z"/>
    </svg>
  ),
  'fire-truck': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M22 6.5c0-.83-.67-1.5-1.5-1.5H19V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H5.5C4.67 5 4 5.67 4 6.5V17h18V6.5zM6.5 11h-1V9.5h1V11zm2.5 0h-1V9.5h1V11zm2.5 0h-1V9.5h1V11zm2.5 0h-1V9.5h1V11zM18.5 11h-1V9.5h1V11zM2 18v2h20v-2H2zM6.5 15.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  ),
  'snowplow': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M20 18c.83 0 1.5-.67 1.5-1.5S20.83 15 20 15s-1.5.67-1.5 1.5S19.17 18 20 18zM4 18c.83 0 1.5-.67 1.5-1.5S4.83 15 4 15s-1.5.67-1.5 1.5S3.17 18 4 18zm16.5-9H16v-2h-4v2H7.5c-1.93 0-3.5 1.57-3.5 3.5V13h-2v5h2v-1.5c0-.83.67-1.5 1.5-1.5h13c.83 0 1.5.67 1.5 1.5V18h2v-5h-2v-1.5c0-1.93-1.57-3.5-3.5-3.5zM22 2v6H2V2h20z"/>
    </svg>
  ),
  'warning': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  ),
  'forklift': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM7 19.41V10h4V8H7V5H5v14.41l2 2zM13 10H9v2h4v-2zm0-3H9v2h4V7zm-2 6H9v2h2v-2z"/>
      <path d="M13 13H3v-2h10v2z"/>
    </svg>
  ),
  'truck': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M20 15.5c0-.83-.67-1.5-1.5-1.5h-1V9H3V6.5C3 5.67 3.67 5 4.5 5H15V2h4v13.5zM6 11h7v2H6v-2zm13 4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5 1.5-.67-1.5-1.5 1.5zm-11 0c-.83 0-1.5.67-1.5-1.5s.67 1.5 1.5 1.5 1.5-.67 1.5 1.5-.67-1.5-1.5 1.5z"/>
    </svg>
  ),
  'users': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  'atc': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 3C8.13 3 5 6.13 5 10c0 1.95.73 3.73 1.94 5.06L5 21h14l-1.94-5.94A6.98 6.98 0 0 0 19 10c0-3.87-3.13-7-7-7zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  'warehouse-staff': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M22 10.5V19h-2v-6H4v6H2V10.5C2 5.8 5.8 2 10.5 2h3C18.2 2 22 5.8 22 10.5zM15 11H9V9h6v2zm0-4H9V5h6v2z"/>
    </svg>
  ),
  'marketing': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15 8h-2V4.07zM15 10h2l-2.87.93C14.05 10.45 14 10.22 14 10V4.07c1.03.13 2 .45 2.87.93L15 8h-2v2zm0 8v-6h2c.78 0 1.48.33 2 .86l-2.03 2.03-2.84 2.84c-.58.58-1.28.97-2.13.97v-2c.55 0 1.05-.22 1.41-.59L15 15.41V18z"/>
    </svg>
  ),
  'check-in': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M21.99 8c0-.55-.45-1-1-1h-1V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2H2c-.55 0-1 .45-1 1v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2l-.01-10zM16 11H8V9h8v2zm-4 4H8v-2h4v2z"/>
    </svg>
  ),
  'baggage-handler': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 2h-2v10H8V8H6v12h14v-2c0-2.21-1.79-4-4-4z"/>
        <path d="M4 18h2v-6H4v6zM20 18h2v-6h-2v6z"/>
    </svg>
  ),
  'maintenance-tech': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M13.82 15.93 12 17.75l-1.82-1.82c-1.37-1.37-1.37-3.58 0-4.95l1.82-1.82 1.82 1.82c.78.78 1.28 1.85 1.47 3.01H17v-2h-1.6c-.19-1.65-1.04-3.1-2.22-4.28L9.36 5.88c-2.5-2.5-6.55-2.5-9.05 0s-2.5 6.55 0 9.05l1.82 1.82L4 18.57l-2.29.92 1.42 1.42L4.05 18.6l1.82-1.82.71.71c.39.39 1.02.39 1.41 0l6.83-6.83c.38-.38.38-1.02 0-1.4z"/>
        <path d="M21.71 4.29c-1.17-1.17-3.07-1.17-4.24 0l-1.82 1.82 4.24 4.24 1.82-1.82c1.17-1.17 1.17-3.07 0-4.24z"/>
    </svg>
  ),
  'security': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  ),
  'passenger-service': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  'logistician': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M15 6H9V4h6v2zm-6 3H4.5L9 7.5V9zm6 0v1.5L19.5 9H15zM3 11h18v2H3v-2zm12 5h-2v-2h2v5zm-4 0H9v-2h2v2zM3 13.5V20h4v-5H3v-1.5zM17 15v5h4v-6.5h-4z"/>
    </svg>
  ),
  'admin': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.5L5.05 9 12 5.5l6.95 3.5L12 11.5zM12 21a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
    </svg>
  ),
  'hr-manager': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2 2 .9 2 2 2zM8 8c0-2.21 1.79-4 4-4s4 1.79 4 4v1.45c1.45.62 2.5 2 2.5 3.55 0 2.21-1.79 4-4 4h-5c-2.21 0-4-1.79-4-4 0-1.55 1.05-2.93 2.5-3.55V8zm-2 6h8c1.1 0 2-.9 2-2s-.9-2-2-2h-1.45c-.62-1.45-2-2.5-3.55-2.5S8.07 8.55 7.45 10H6c-1.1 0-2 .9-2 2s.9 2 2 2zm10 4h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H6v-2h2v2z"/>
    </svg>
  ),
  'pushback': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H4.5C3.67 5 3 5.67 3 6.5V11h11V6h3.42l1.5 5H21l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM2 17v-5h1.5c.06 0 .12-.01.18-.03l3.47-1.22c.43-.15.85.16.85.62V17H2zM22 17h-2.15c0-1.1-.9-2-2-2h-7.7c-1.1 0-2 .9-2 2H2v2h20v-2z"/>
    </svg>
  ),
  'deicing': (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 3L2 12h5v10h10V12h5L12 3zm2 14h-4v-4h4v4zm2-6h-2v-2h-4v2H8V9.67l4-4 4 4V11z"/>
        <path d="M19.78 16.2c.07.13.1.27.1.4 0 .41-.34.75-.75.75-.23 0-.44-.1-.58-.27l-1.5-1.88c-.18-.22-.05-.55.22-.55H18c.21 0 .38.17.38.38 0 .1-.04.19-.1.27l1.5 1.87zM4.22 16.2c-.06-.08-.1-.17-.1-.27 0-.21.17-.38.38-.38h.73c.27 0 .4.33.22.55l-1.5 1.88c-.14.17-.35.27-.58.27-.41 0-.75-.34-.75-.75 0-.13.03-.27.1-.4l1.5-1.87z"/>
    </svg>
  ),
  'terminal': (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M22 10v10H2V10l10-7 10 7zM12 5.33L4.62 10h14.76L12 5.33zM9 12v4h2v-4H9zm4 0v4h2v-4h-2z"/>
    </svg>
  ),
  'ticket': (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .35.07.69.18 1H4c-1.11 0-1.99.9-1.99 2L2 19c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9.5 17.5L6 14l1.41-1.41L9.5 14.08 16.09 7.5l1.41 1.41L9.5 17.5z"/>
    </svg>
  ),
  'shield-check': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.04 15.65L6.5 12.19l1.41-1.41 3.05 3.05 6.04-6.03L18.41 9.2 10.96 16.65z"/>
    </svg>
  ),
  'shop': (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>
    </svg>
  ),
  'food': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18 8h-1V3H7v5H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM10 5h4v3h-4V5zm4 13.25h-4V11h4v7.25zM11.5 12.75h-1v-1h1v1zm0 2h-1v-1h1v1zm0 2h-1v-1h1v1z"/>
    </svg>
  )
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return <div className={className}>{icons[name]}</div>;
};

export default Icon;
