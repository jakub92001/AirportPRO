import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { Flight, FlightStatus, Gate, Vehicle, VehicleType, PlaneSize, CargoBay, WeatherCondition } from '../types';
import Icon from './Icon';
import { REQUIRED_SERVICES_EMERGENCY, MAX_SNOW_DEPTH } from '../constants';
import dayjs from 'dayjs';

interface AirportMapProps {
  onFlightClick: (flight: Flight) => void;
  onGateClick: (gate: Gate) => void;
  onCargoBayClick: (bay: CargoBay) => void;
}

const getPlaneIcon = (size: PlaneSize): { icon: 'plane-sm' | 'plane-md' | 'plane-lg', className: string } => {
    switch (size) {
        case PlaneSize.Small:
            return { icon: 'plane-sm', className: 'w-7 h-7' };
        case PlaneSize.Medium:
            return { icon: 'plane-md', className: 'w-8 h-8' };
        case PlaneSize.Large:
            return { icon: 'plane-lg', className: 'w-10 h-10' };
        default:
            return { icon: 'plane-md', className: 'w-8 h-8' };
    }
};

const AirportMap: React.FC<AirportMapProps> = ({ onFlightClick, onGateClick, onCargoBayClick }) => {
  const { state } = useGameState();
  const busContractActive = state.activeContracts.some(c => c.id === 't1');
  const trainContractActive = state.activeContracts.some(c => c.id === 't2');

  const hour = dayjs(state.time).hour();
  const isNight = hour < 6 || hour >= 20;

  const getPlanePosition = (flight: Flight): React.CSSProperties => {
    switch (flight.status) {
      case FlightStatus.Departing:
      case FlightStatus.Pushback:
      case FlightStatus.Deicing:
        const gate = state.gates.find(g => g.id === flight.gateId) || state.cargoBays.find(b => b.id === flight.gateId);
        if (gate) {
            const isCargo = 'packages' in gate;
            const gateIndex = isCargo ? state.cargoBays.findIndex(b => b.id === gate.id) : state.gates.findIndex(g => g.id === gate.id);
            const top = isCargo ? '80%' : '20%';
            // Position it near the gate for pushback/deicing
            return { top: `calc(${top} + 5rem)`, left: `${15 + gateIndex * 15}%`, transform: 'translateX(-50%) rotate(0deg)', zIndex: 10, transition: 'all 0.5s ease' };
        }
        return { top: '50%', left: '50%', animation: 'plane-takeoff 5s ease-in forwards', transform: 'translate(-50%, -50%) rotate(0deg)', zIndex: 20 };
      
      case FlightStatus.Landed:
      case FlightStatus.EmergencyLanding: // Show on runway
        return { top: '50%', left: '50%', animation: 'plane-landing 5s ease-out forwards', transform: 'translate(-50%, -50%) rotate(0deg)', zIndex: 20 };

      case FlightStatus.Taxiing:
        return { display: 'none' };

      case FlightStatus.ArrivedAtGate:
      case FlightStatus.Servicing:
      case FlightStatus.Boarding:
        if (!flight.gateId) return { display: 'none' };
        if (flight.isCargo) {
            const bayIndex = state.cargoBays.findIndex(b => b.id === flight.gateId);
            if (bayIndex === -1) return { display: 'none' };
            return { top: '80%', left: `${15 + bayIndex * 15}%`, transform: 'translateX(-50%) rotate(-90deg)', zIndex: 10 };
        } else {
            const gateIndex = state.gates.findIndex(g => g.id === flight.gateId);
            if (gateIndex === -1) return { display: 'none' };
            return { top: '20%', left: `${15 + gateIndex * 15}%`, transform: 'translateX(-50%) rotate(90deg)', zIndex: 10 };
        }
      
      default:
        return { display: 'none' };
    }
  };

  const getVehiclePosition = (vehicle: Vehicle, index: number): React.CSSProperties => {
    if (vehicle.isBusy && vehicle.flightId) {
        const flight = state.flights.find(f => f.id === vehicle.flightId);
        
        if (flight && REQUIRED_SERVICES_EMERGENCY.includes(vehicle.type)) {
            const isAmbulance = vehicle.type === VehicleType.Ambulance;
            return { top: `calc(50% + ${isAmbulance ? '-2rem' : '2rem'})`, left: 'calc(50% + 5rem)', zIndex: 21, transition: 'all 0.5s ease' };
        }
        
        if (!flight || !flight.gateId) return { display: 'none' };

        let locationIndex: number;
        let top: string;
        
        if(flight.isCargo) {
            locationIndex = state.cargoBays.findIndex(b => b.id === flight.gateId);
            top = '80%';
        } else {
            locationIndex = state.gates.findIndex(g => g.id === flight.gateId);
            top = '20%';
        }

        if (locationIndex === -1) return { display: 'none' };
        
        const locationLeft = 15 + locationIndex * 15;
        let offsetX = 0;
        let offsetY = 0;
        
        switch(vehicle.type) {
            case VehicleType.Stairs: offsetX = -3.5; offsetY = 0; break;
            case VehicleType.Catering: offsetX = 3.5; offsetY = 0; break;
            case VehicleType.Fuel: offsetX = 3.5; offsetY = 2.5; break;
            case VehicleType.Baggage: offsetX = -3.5; offsetY = 2.5; break;
            case VehicleType.CargoLoader: offsetX = -3.5; offsetY = -2.5; break;
            case VehicleType.CargoTransporter: offsetX = 3.5; offsetY = -2.5; break;
            case VehicleType.Pushback: offsetX = 0; offsetY = flight.isCargo ? -4.5 : 4.5; break;
            case VehicleType.Deicing: offsetX = 0; offsetY = flight.isCargo ? -6.5 : 6.5; break;
        }

        return {
            top: `calc(${top} + ${offsetY}rem)`,
            left: `calc(${locationLeft}% + ${offsetX}rem)`,
            transform: 'translateX(-50%)',
            zIndex: 15,
            transition: 'top 0.5s ease, left 0.5s ease',
        };
    } else if (vehicle.isBusy && vehicle.type === VehicleType.Snowplow) {
        // Snowplow on runway
        return { top: '50%', left: '30%', transform: 'translateY(-50%)', zIndex: 21, transition: 'all 0.5s ease' };
    }
    else {
        // Position idle vehicles in the depot area
        const idleIndex = state.vehicles.filter(v => !v.isBusy).findIndex(v => v.id === vehicle.id);
        const col = idleIndex % 4;
        const row = Math.floor(idleIndex / 4);
        return {
            bottom: `${2 + row * 2.5}rem`,
            right: `${2 + col * 3}rem`,
            zIndex: 15,
            transition: 'top 0.5s ease, left 0.5s ease, bottom 0.5s ease, right 0.5s ease',
        };
    }
  };
  
  const vehicleIconMap: Record<VehicleType, 'catering' | 'fuel' | 'baggage' | 'stairs' | 'cargoloader' | 'cargotransporter' | 'follow-me' | 'ambulance' | 'fire-truck' | 'snowplow' | 'forklift' | 'pushback' | 'deicing'> = {
      [VehicleType.Catering]: 'catering',
      [VehicleType.Fuel]: 'fuel',
      [VehicleType.Baggage]: 'baggage',
      [VehicleType.Stairs]: 'stairs',
      [VehicleType.CargoLoader]: 'cargoloader',
      [VehicleType.CargoTransporter]: 'cargotransporter',
      [VehicleType.FollowMe]: 'follow-me',
      [VehicleType.Ambulance]: 'ambulance',
      [VehicleType.FireTruck]: 'fire-truck',
      [VehicleType.Snowplow]: 'snowplow',
      [VehicleType.Forklift]: 'forklift',
      [VehicleType.Pushback]: 'pushback',
      [VehicleType.Deicing]: 'deicing',
  };

  return (
    <div className="bg-[#2a472a] p-4 rounded-lg shadow-lg h-full relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/grass.png')]">
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 z-0 ${isNight ? 'opacity-60' : 'opacity-0'}`}></div>

      <h2 className="absolute top-4 left-4 text-lg font-bold text-white z-30 shadow-black [text-shadow:1px_1px_2px_var(--tw-shadow-color)]">Airport Layout</h2>
      
      {/* Runway */}
      <div className="absolute top-1/2 left-[15%] w-[70%] h-12 bg-gray-800 -translate-y-1/2 rounded-md flex items-center justify-between px-4 z-0 shadow-lg">
          <div className="flex space-x-1">
             {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-8 bg-white/80"></div>)}
          </div>
          <div className="w-[90%] border-t-2 border-dashed border-gray-400"></div>
          <span className="absolute left-1/2 -translate-x-1/2 text-gray-400 font-black text-2xl [text-shadow:1px_1px_2px_#000]">27L / 09R</span>
          <div className="flex space-x-1">
             {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-8 bg-white/80"></div>)}
          </div>
          {isNight && (
             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
                 <div className="flex gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 </div>
             </div>
          )}
      </div>

      {/* Taxiways */}
      <div className="absolute top-[calc(20%_+_4.5rem)] left-[10%] w-[80%] h-3 bg-gray-500/80 z-0 rounded-sm">
         <div className={`w-full h-full border-t border-b border-yellow-400 ${isNight ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
      <div className="absolute bottom-[calc(20%_+_4.5rem)] left-[10%] w-[80%] h-3 bg-gray-500/80 z-0 rounded-sm">
         <div className={`w-full h-full border-t border-b border-yellow-400 ${isNight ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
      
      {/* Terminal Area */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[75%] h-[calc(20%)] bg-gray-700/50 rounded-b-xl shadow-lg flex items-center justify-center p-2">
           <p className="text-white font-bold text-xl [text-shadow:1px_1px_2px_#000]">PASSENGER TERMINAL</p>
      </div>
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-[calc(20%)] bg-gray-700/50 rounded-t-xl shadow-lg flex items-center justify-center p-2">
           <p className="text-white font-bold text-xl [text-shadow:1px_1px_2px_#000]">CARGO FACILITY</p>
      </div>

      {/* Gates */}
      <div className="absolute top-[calc(20%)] left-0 right-0 flex justify-start space-x-12 px-12 z-20">
        {state.gates.map((gate) => (
          <div key={gate.id} className="flex flex-col items-center cursor-pointer group" onClick={() => onGateClick(gate)}>
            <div className={`w-16 h-10 bg-gray-600/80 border-t-4 ${gate.isOccupied ? 'border-brand-red' : 'border-gray-500'} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${gate.isOccupied ? 'text-white' : 'text-base-content-secondary group-hover:text-white'}`}>{gate.id}</span>
            </div>
            <div className="w-24 h-16 bg-gray-500/50 border-2 border-dashed border-gray-400/50 rounded-b-lg"></div>
          </div>
        ))}
      </div>

      {/* Cargo Bays */}
      <div className="absolute bottom-[calc(20%)] left-0 right-0 flex justify-start space-x-12 px-12 z-20">
        {state.cargoBays.map((bay) => (
          <div key={bay.id} className="flex flex-col items-center cursor-pointer group" onClick={() => onCargoBayClick(bay)}>
             <div className="w-24 h-16 bg-gray-500/50 border-2 border-dashed border-gray-400/50 rounded-t-lg"></div>
            <div className={`w-16 h-10 bg-gray-600/80 border-b-4 ${bay.isOccupied ? 'border-brand-red' : 'border-yellow-500'} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${bay.isOccupied ? 'text-white' : 'text-yellow-400 group-hover:text-white'}`}>{bay.id}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Planes & Vehicles */}
      {[...state.flights, ...state.vehicles].map((item) => {
          const isFlight = 'flightNumber' in item;
          const style = isFlight ? getPlanePosition(item as Flight) : getVehiclePosition(item as Vehicle, 0);

          if (style?.display === 'none') return null;

          const { icon, className } = isFlight 
              ? getPlaneIcon((item as Flight).planeSize) 
              : { icon: vehicleIconMap[(item as Vehicle).type], className: 'w-6 h-6' };
          
          const flight = isFlight ? (item as Flight) : null;
          const vehicle = !isFlight ? (item as Vehicle) : null;
          
          const isEmergency = flight?.status === FlightStatus.EmergencyLanding;

          return (
            <div key={item.id} className="absolute transition-all duration-1000 ease-in-out" style={style} onClick={() => flight && onFlightClick(flight)}>
                <div className="relative group [filter:drop-shadow(2px_4px_3px_rgba(0,0,0,0.5))]">
                    <Icon name={icon} className={`${className} ${isEmergency ? 'text-brand-red animate-pulse' : 'text-white'} ${flight ? 'cursor-pointer' : ''}`} />
                    {flight && (
                    <>
                        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${isEmergency ? 'bg-brand-red' : flight.airline.logoColor} text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                            {flight.flightNumber}
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-base-100 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {isEmergency && <div className="font-bold text-brand-red">EMERGENCY</div>}
                        {flight.isCargo && <div className="font-bold text-brand-yellow">CARGO FLIGHT</div>}
                        {flight.planeModel} ({flight.planeSize})<br/>
                        {flight.origin} to {flight.destination} <br/>
                        Status: {flight.status}
                        </div>
                    </>
                    )}
                </div>
            </div>
          );
      })}

    </div>
  );
};

export default AirportMap;