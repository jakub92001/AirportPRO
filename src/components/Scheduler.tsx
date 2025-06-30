import React, { useState, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Flight, FlightStatus, FlightType, Gate, CargoBay, PlaneSize } from '../types';
import Icon from './Icon';
import Modal from './Modal';
import { SERVICING_TIME_MS, BOARDING_TIME_MS, PUSHBACK_DURATION_MS } from '../constants';
import dayjs from 'dayjs';

interface DraggedFlightInfo {
    id: string;
    isCargo: boolean;
    planeSize: PlaneSize;
}

const FlightDetailsModal: React.FC<{ 
    flight: Flight | null;
    onClose: () => void;
}> = ({ flight, onClose }) => {
    if (!flight) return null;

    return (
        <Modal isOpen={!!flight} onClose={onClose} title={`Flight ${flight.flightNumber} Details`}>
            <div className="space-y-2 text-base-content">
                {flight.isCargo && <p className="font-bold text-lg text-brand-yellow text-center">CARGO FLIGHT</p>}
                <p><strong>Airline:</strong> {flight.airline.name}</p>
                <p><strong>Aircraft:</strong> {flight.planeModel} ({flight.planeSize})</p>
                <p><strong>Route:</strong> {flight.origin} to {flight.destination}</p>
                <p><strong>Status:</strong> {flight.status}</p>
                <p><strong>Arrival Time:</strong> {dayjs(flight.arrivalTime).format('YYYY-MM-DD HH:mm')}</p>
                <p><strong>Departure Time:</strong> {flight.departureTime ? dayjs(flight.departureTime).format('YYYY-MM-DD HH:mm') : 'N/A'}</p>
                <p><strong>Assigned to:</strong> {flight.gateId || 'Not Assigned'}</p>
            </div>
        </Modal>
    );
};

const ESTIMATED_TURNAROUND_MS = SERVICING_TIME_MS + BOARDING_TIME_MS + PUSHBACK_DURATION_MS;

const Scheduler: React.FC = () => {
    const { state, dispatch } = useGameState();
    const [viewDate, setViewDate] = useState(dayjs(state.time).startOf('day'));
    const [draggedFlight, setDraggedFlight] = useState<DraggedFlightInfo | null>(null);
    const [modalFlight, setModalFlight] = useState<Flight | null>(null);
    const [hoveredLocation, setHoveredLocation] = useState<{ id: string, time: number } | null>(null);

    const viewStart = viewDate.valueOf();
    const viewEnd = viewDate.endOf('day').valueOf();
    const totalViewDuration = viewEnd - viewStart;

    const flightsNeedingAssignment = useMemo(() =>
        state.flights
            .filter(f => f.status === FlightStatus.Scheduled && !f.gateId)
            .sort((a, b) => a.arrivalTime - b.arrivalTime),
        [state.flights]
    );

    const assignedFlightsToday = useMemo(() =>
        state.flights.filter(f => {
            if (!f.gateId) return false;
            const start = f.arrivalTime;
            const end = f.departureTime || (start + ESTIMATED_TURNAROUND_MS);
            return (start < viewEnd && end > viewStart);
        })
    , [state.flights, viewStart, viewEnd]);
    
    const locations = useMemo(() => 
        [...state.gates.map(g => ({...g, type: 'gate' as const})), ...state.cargoBays.map(b => ({...b, type: 'bay' as const}))]
    , [state.gates, state.cargoBays]);

    const isDropValid = (location: { id: string; type: 'gate' | 'bay' }, dropTime: number): boolean => {
        if (!draggedFlight) return false;

        const originalFlight = flightsNeedingAssignment.find(f => f.id === draggedFlight!.id);
        if (!originalFlight) return false; // Should only be able to drag unassigned flights.

        // Prevent scheduling before the flight's original arrival time.
        if (dropTime < originalFlight.arrivalTime) {
            return false;
        }

        if (draggedFlight.isCargo && location.type !== 'bay') return false;
        if (!draggedFlight.isCargo && location.type !== 'gate') return false;

        const proposedStart = dropTime;
        const proposedEnd = dropTime + ESTIMATED_TURNAROUND_MS;

        const hasConflict = assignedFlightsToday.some(f => {
            if (f.gateId !== location.id) return false;
            const flightStart = f.arrivalTime;
            const flightEnd = f.departureTime || (flightStart + ESTIMATED_TURNAROUND_MS);
            return (proposedStart < flightEnd && proposedEnd > flightStart);
        });

        return !hasConflict;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, flight: Flight) => {
        const flightInfo: DraggedFlightInfo = { id: flight.id, isCargo: flight.isCargo, planeSize: flight.planeSize };
        setDraggedFlight(flightInfo);
        e.dataTransfer.setData("application/json", JSON.stringify(flightInfo));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, locationId: string, locationType: 'gate' | 'bay') => {
        e.preventDefault();
        if (!draggedFlight) return;

        const dropZone = e.currentTarget;
        const dropZoneRect = dropZone.getBoundingClientRect();
        const dropX = e.clientX - dropZoneRect.left;
        const dropPercent = dropX / dropZoneRect.width;
        const dropTime = viewStart + (totalViewDuration * dropPercent);

        if (isDropValid({ id: locationId, type: locationType }, dropTime)) {
            dispatch({ 
                type: 'UPDATE_FLIGHT', 
                payload: { 
                    id: draggedFlight.id, 
                    gateId: locationId,
                    arrivalTime: dropTime 
                } 
            });
        }
        
        setDraggedFlight(null);
        setHoveredLocation(null);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const dropZone = e.currentTarget;
        const dropZoneRect = dropZone.getBoundingClientRect();
        const dropX = e.clientX - dropZoneRect.left;
        const dropPercent = dropX / dropZoneRect.width;
        const hoverTime = viewStart + (totalViewDuration * dropPercent);
        
        const locationId = e.currentTarget.dataset.locationId;
        if (locationId) {
             setHoveredLocation({ id: locationId, time: hoverTime });
        }
    };
    
    const timeToPercent = (time: number) => {
        const percent = ((time - viewStart) / totalViewDuration) * 100;
        return Math.max(0, Math.min(100, percent));
    }
    
    const getPlaneIconName = (size: PlaneSize) => {
      if (size === PlaneSize.Small) return 'plane-sm';
      if (size === PlaneSize.Large) return 'plane-lg';
      return 'plane-md';
    }

    return (
        <div className="h-full flex flex-col bg-base-200 rounded-lg shadow-lg">
            <header className="flex-shrink-0 p-3 border-b border-base-300 flex justify-between items-center">
                <h1 className="text-xl font-bold">Flight Scheduler</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setViewDate(viewDate.subtract(1, 'day'))} className="p-2 rounded-md hover:bg-base-300">‹ Prev</button>
                    <span className="font-semibold text-brand-yellow">{viewDate.format('DD MMMM YYYY')}</span>
                    <button onClick={() => setViewDate(viewDate.add(1, 'day'))} className="p-2 rounded-md hover:bg-base-300">Next ›</button>
                </div>
            </header>
            <div className="flex-grow flex h-full overflow-hidden">
                {/* Unassigned Flights Panel */}
                <aside className="w-1/4 min-w-[280px] flex-shrink-0 border-r border-base-300 overflow-y-auto">
                    <h2 className="text-lg font-semibold p-3 sticky top-0 bg-base-200 z-10">Unassigned Flights</h2>
                    <div className="p-2 space-y-2">
                        {flightsNeedingAssignment.length > 0 ? flightsNeedingAssignment.map(flight => (
                            <div 
                                key={flight.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, flight)}
                                onDragEnd={() => setDraggedFlight(null)}
                                className="p-2 rounded-md border border-base-300 bg-base-300 hover:bg-base-100 cursor-grab active:cursor-grabbing shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {flight.airline.logoUrl && <img src={flight.airline.logoUrl} alt={flight.airline.name} className="w-4 h-4 object-contain"/>}
                                        <span className="font-bold">{flight.flightNumber}</span>
                                    </div>
                                    <span className="text-xs font-mono text-brand-yellow">{dayjs(flight.arrivalTime).format('HH:mm')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-base-content-secondary mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <Icon name={getPlaneIconName(flight.planeSize)} className="w-4 h-4" />
                                        <span>{flight.planeModel} {flight.isCargo ? '(Cargo)' : ''}</span>
                                    </div>
                                    <span className="font-semibold text-brand-blue">{flight.status}</span>
                                </div>
                            </div>
                        )) : <p className="text-center text-base-content-secondary p-4">No flights awaiting assignment.</p>}
                    </div>
                </aside>

                {/* Gantt Chart */}
                <main className="flex-grow overflow-x-auto overflow-y-auto">
                    <div className="relative" style={{width: '200%', height: '100%'}}>
                        {/* Time Header */}
                        <div className="h-10 flex sticky top-0 bg-base-200 z-20 border-b border-base-300">
                             <div className="w-24 border-r border-base-300 flex-shrink-0"></div>
                             {Array.from({ length: 24 }).map((_, hour) => (
                                <div key={hour} className="flex-1 text-center border-r border-base-300 text-sm py-2 relative">
                                    <div className="absolute w-px h-full bg-base-300 left-1/2 top-0"></div>
                                    {String(hour).padStart(2, '0')}:00
                                </div>
                             ))}
                        </div>
                        {/* Location Rows */}
                        <div className="relative">
                            {locations.map(loc => {
                                let hoverClass = '';
                                let isValidHover = false;
                                if (hoveredLocation && hoveredLocation.id === loc.id) {
                                    isValidHover = isDropValid(loc, hoveredLocation.time);
                                    hoverClass = isValidHover ? 'bg-green-500/10' : 'bg-red-500/10';
                                }
                                
                                return (
                                    <div key={loc.id} 
                                        data-location-id={loc.id}
                                        className={`h-20 flex border-b border-base-300 relative group transition-colors duration-100 ${hoverClass}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={() => setHoveredLocation(null)}
                                        onDrop={(e) => handleDrop(e, loc.id, loc.type)}
                                    >
                                        <div className="w-24 border-r border-base-300 flex-shrink-0 flex items-center justify-center font-bold sticky left-0 bg-base-200 z-10">
                                            {loc.id}
                                        </div>
                                        <div className="flex-1 flex relative">
                                             {/* Background grid */}
                                             {Array.from({ length: 48 }).map((_, i) => (
                                                <div key={i} className={`flex-1 border-r ${i % 2 === 1 ? 'border-base-100/70' : 'border-base-300/50'}`}></div>
                                             ))}

                                            {/* Flight blocks */}
                                            {assignedFlightsToday.filter(f => f.gateId === loc.id).map(flight => {
                                                const start = flight.arrivalTime;
                                                const serviceEnd = start + SERVICING_TIME_MS;
                                                const end = flight.departureTime || (start + ESTIMATED_TURNAROUND_MS);

                                                const startPercent = timeToPercent(start);
                                                const serviceEndPercent = timeToPercent(serviceEnd);
                                                const endPercent = timeToPercent(end);
                                                
                                                const arrivalWidth = serviceEndPercent - startPercent;
                                                const departureWidth = endPercent - serviceEndPercent;
                                                
                                                if(endPercent - startPercent <= 0) return null;

                                                return (
                                                    <div
                                                        key={flight.id}
                                                        className="absolute top-2 h-16 rounded-lg flex text-white cursor-pointer shadow-lg hover:z-30 hover:scale-[1.02] transition-transform group/flight"
                                                        style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
                                                        onClick={(e) => { e.stopPropagation(); setModalFlight(flight); }}
                                                    >
                                                        {/* Arrival Part */}
                                                        <div className={`h-full p-2 flex items-center ${flight.airline.logoColor} rounded-l-lg`} style={{width: `${(arrivalWidth/(endPercent-startPercent)) * 100}%`}}>
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                {flight.airline.logoUrl && <img src={flight.airline.logoUrl} alt="" className="w-5 h-5 object-contain flex-shrink-0"/>}
                                                                <span className="text-xs font-bold truncate">{flight.flightNumber}</span>
                                                            </div>
                                                        </div>
                                                        {/* Departure Part */}
                                                        <div className={`h-full p-2 flex items-center bg-opacity-70 ${flight.airline.logoColor} rounded-r-lg`} style={{width: `${(departureWidth/(endPercent-startPercent)) * 100}%`}}>
                                                            <span className="text-xs font-bold truncate opacity-80">{flight.flightNumber.replace(/\d+$/, (n) => (parseInt(n, 10) + 1).toString())}</span>
                                                        </div>

                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-base-100 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/flight:opacity-100 transition-opacity pointer-events-none z-50">
                                                            {flight.flightNumber} - {flight.status}<br/>
                                                            {dayjs(start).format('HH:mm')} - {dayjs(end).format('HH:mm')}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {/* Drag placeholder */}
                                            {hoveredLocation?.id === loc.id && isValidHover && draggedFlight && (
                                                <div 
                                                    className="absolute top-2 h-16 rounded-lg bg-green-500/50 border-2 border-dashed border-white pointer-events-none"
                                                    style={{ left: `${timeToPercent(hoveredLocation.time)}%`, width: `${(ESTIMATED_TURNAROUND_MS / totalViewDuration) * 100}%`}}
                                                ></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                             {locations.length === 0 && <p className="text-center text-base-content-secondary p-8">Build gates and cargo bays to schedule flights.</p>}
                        </div>

                         {/* Current Time Indicator */}
                        {dayjs(state.time).isBetween(viewStart, viewEnd) && (
                             <div className="absolute top-0 bottom-0 border-r-2 border-brand-red z-30 pointer-events-none" style={{ left: `calc(6rem + ${timeToPercent(state.time)}%)` }}>
                                 <div className="absolute -top-1 -left-1 w-2 h-2 bg-brand-red rounded-full animate-ping"></div>
                             </div>
                        )}
                    </div>
                </main>
            </div>
            <FlightDetailsModal flight={modalFlight} onClose={() => setModalFlight(null)} />
        </div>
    );
};

export default Scheduler;