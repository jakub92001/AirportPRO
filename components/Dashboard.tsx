
import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Flight, Gate, FlightStatus, FlightType, CargoBay, VehicleType } from '../types';
import AirportMap from './AirportMap';
import Modal from './Modal';
import FlightBoard from './FlightBoard';
import StatsBar from './StatsBar';
import Icon from './Icon';
import { MAX_SNOW_DEPTH } from '../constants';
import { getWeatherIcon } from '../services/weatherService';
import { multiplayerService } from '../services/multiplayerService';


declare const dayjs: any;

const FlightDetailsModal: React.FC<{ 
    flight: Flight | null; 
    onClose: () => void; 
    onClearLocation: (flightId: string, locationId: string) => void; 
}> = ({ flight, onClose, onClearLocation }) => {
    if (!flight) return null;

    const canDepart = flight.gateId !== null && flight.type === FlightType.Departure && flight.status === FlightStatus.Boarding;

    return (
        <Modal isOpen={!!flight} onClose={onClose} title={`Flight ${flight.flightNumber} Details`}>
            <div className="space-y-2 text-base-content">
                {flight.isCargo && <p className="font-bold text-lg text-brand-yellow text-center">CARGO FLIGHT</p>}
                 {flight.status === FlightStatus.EmergencyLanding && <p className="font-bold text-lg text-brand-red text-center animate-pulse">EMERGENCY LANDING</p>}
                <p><strong>Airline:</strong> {flight.airline.name}</p>
                <p><strong>Aircraft:</strong> {flight.planeModel} ({flight.planeSize})</p>
                <p><strong>Route:</strong> {flight.origin} to {flight.destination}</p>
                <p><strong>Status:</strong> {flight.status}</p>
                <p><strong>Scheduled Time:</strong> {dayjs(flight.type === FlightType.Arrival ? flight.arrivalTime : flight.departureTime).format('YYYY-MM-DD HH:mm')}</p>
                <p><strong>Assigned to:</strong> {flight.gateId || 'Not Assigned'}</p>
            </div>
            
            {canDepart && (
                 <div className="mt-4">
                    <button onClick={() => { onClearLocation(flight.id, flight.gateId!); onClose(); }} className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded hover:bg-orange-600">
                        Clear & Depart
                    </button>
                </div>
            )}
        </Modal>
    );
};

const Header: React.FC = () => {
    const { state } = useGameState();
    const weatherIcon = getWeatherIcon(state.weather.condition);
    const username = multiplayerService.username;

    return (
        <header className="bg-base-200 p-3 rounded-lg shadow-lg flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-black text-white">Airport Dashboard</h1>
                 <div className="flex items-center gap-2 bg-base-300 px-3 py-1 rounded-full">
                   <div className="w-2.5 h-2.5 bg-brand-green rounded-full animate-pulse"></div>
                   <span className="text-sm font-bold text-base-content">{username}</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6 text-sm">
                <div className="flex items-center space-x-2" title="Game Time">
                    <Icon name="time" className="text-brand-blue" />
                    <span className="font-mono">{dayjs(state.time).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className="flex items-center space-x-2" title={`Live weather from EPKK (Kraków)`}>
                     <div className="relative">
                        <span className="text-2xl">{weatherIcon}</span>
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green" title="Live Weather">
                                    <span className="text-white text-[8px] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">L</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <span className="font-mono hidden md:inline">{state.weather.temperature}°C</span>
                </div>
            </div>
        </header>
    );
};

const RunwayStatusPanel: React.FC = () => {
    const { state, dispatch } = useGameState();
    const snowplowIsBusy = state.vehicles.some(v => v.type === VehicleType.Snowplow && v.isBusy);
    const hasSnowplow = state.vehicles.some(v => v.type === VehicleType.Snowplow);

    const getStatus = () => {
        if (state.isRunwayBlocked && state.runwayBlockedUntil > 0) return { text: 'BLOCKED - EMERGENCY', color: 'text-brand-red animate-pulse' };
        if (state.snowplowClearingUntil > 0) return { text: 'CLEARING SNOW', color: 'text-brand-blue animate-pulse' };
        if (state.isRunwayBlocked && state.runwaySnowDepth >= MAX_SNOW_DEPTH) return { text: 'BLOCKED - SNOW', color: 'text-brand-red' };
        if (state.runwaySnowDepth > 0) return { text: `SNOW: ${state.runwaySnowDepth.toFixed(1)}cm`, color: 'text-brand-yellow' };
        return { text: 'CLEAR', color: 'text-brand-green' };
    };

    const { text, color } = getStatus();

    return (
        <div className="bg-base-200 p-3 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold">Runway Status</h3>
                <span className={`font-bold text-lg ${color}`}>{text}</span>
            </div>
            {state.runwaySnowDepth > 0 && (
                 <button
                    onClick={() => dispatch({type: 'CLEAR_RUNWAY'})}
                    disabled={!hasSnowplow || snowplowIsBusy || state.snowplowClearingUntil > 0}
                    className="bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-base-300 disabled:cursor-not-allowed disabled:text-base-content-secondary mt-2 sm:mt-0"
                 >
                    <div className="flex items-center gap-2">
                        <Icon name="snowplow" className="w-5 h-5" />
                        <span>Dispatch Snowplow</span>
                    </div>
                 </button>
            )}
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { state, dispatch } = useGameState();
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    
    const handleClearLocation = (flightId: string, locationId: string) => {
        dispatch({ type: 'UPDATE_FLIGHT', payload: { id: flightId, status: FlightStatus.Departing }});
    };

    const handleLocationClick = (location: Gate | CargoBay) => {
        const flight = state.flights.find(f => f.id === location.flightId);
        if (flight) setSelectedFlight(flight);
    }
    
    const handleFlightClick = (flight: Flight) => {
        setSelectedFlight(flight);
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <Header />
            <StatsBar />
            <RunwayStatusPanel />
            <main className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-grow min-h-0">
                <div className="lg:col-span-3 h-full min-h-0">
                     <AirportMap 
                        onFlightClick={handleFlightClick} 
                        onGateClick={handleLocationClick}
                        onCargoBayClick={handleLocationClick}
                    />
                </div>
                <div className="lg:col-span-2 h-full min-h-0">
                    <FlightBoard onFlightClick={handleFlightClick} />
                </div>
            </main>
            <FlightDetailsModal
                flight={selectedFlight}
                onClose={() => setSelectedFlight(null)}
                onClearLocation={handleClearLocation}
            />
        </div>
    );
};

export default Dashboard;