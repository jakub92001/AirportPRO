import React, { useState, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Flight, FlightStatus, FlightType } from '../types';
import Icon from './Icon';
import dayjs from 'dayjs';

const getStatusColor = (status: FlightStatus) => {
  switch (status) {
    case FlightStatus.OnTime:
    case FlightStatus.Boarding:
    case FlightStatus.ArrivedAtGate:
    case FlightStatus.ReadyForDeparture:
      return 'text-brand-green';
    case FlightStatus.Delayed:
      return 'text-brand-yellow';
    case FlightStatus.Cancelled:
      return 'text-brand-red';
    case FlightStatus.EmergencyLanding:
      return 'text-brand-red animate-pulse';
    case FlightStatus.Departing:
    case FlightStatus.Landed:
    case FlightStatus.InAir:
    case FlightStatus.Taxiing:
      return 'text-brand-blue';
    default:
      return 'text-base-content-secondary';
  }
};

const FlightRow: React.FC<{ flight: Flight; onRowClick: (flight: Flight) => void }> = ({ flight, onRowClick }) => {
    const displayTime = flight.type === FlightType.Arrival ? flight.arrivalTime : flight.departureTime;
    return (
        <tr className="border-b border-base-300 hover:bg-base-300 cursor-pointer" onClick={() => onRowClick(flight)}>
            <td className="p-3 text-sm font-mono">{displayTime ? dayjs(displayTime).format('HH:mm') : 'N/A'}</td>
            <td className="p-3 text-sm">
                <div className='flex items-center gap-2'>
                    {flight.airline.logoUrl ? (
                        <img src={flight.airline.logoUrl} alt={`${flight.airline.name} logo`} className="w-4 h-4 object-contain" />
                    ) : (
                        <span className={`w-3 h-3 rounded-full ${flight.airline.logoColor}`}></span>
                    )}
                    <span>{flight.airline.name}</span>
                </div>
            </td>
            <td className="p-3 text-sm font-mono">
                <div className="flex items-center gap-2">
                    {flight.isCargo && <Icon name="box" className="w-4 h-4 text-yellow-500" />}
                    <span>{flight.flightNumber}</span>
                </div>
            </td>
            <td className="p-3 text-sm">{flight.type === FlightType.Departure ? flight.destination : flight.origin}</td>
            <td className="p-3 text-sm text-base-content-secondary">{flight.planeModel}</td>
            <td className="p-3 text-sm font-bold">
            <span className={getStatusColor(flight.status)}>{flight.status}</span>
            </td>
            <td className="p-3 text-sm font-mono">{flight.gateId || '---'}</td>
        </tr>
    );
};

const FlightBoard: React.FC<{ onFlightClick: (flight: Flight) => void }> = ({ onFlightClick }) => {
  const { state } = useGameState();
  const [activeTab, setActiveTab] = useState<FlightType>(FlightType.Departure);
  const [sortKey, setSortKey] = useState<'time' | 'airline' | 'flightNumber'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: 'time' | 'airline' | 'flightNumber') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedFlights = useMemo(() => {
    return [...state.flights]
      .filter(f => {
        // A flight must be assigned to a gate or bay to appear on the public flight board.
        if (!f.gateId) {
            return false;
        }

        // The flight's type must match the selected tab.
        return f.type === activeTab;
      }).sort((a, b) => {
        let valA, valB;
        if (sortKey === 'time') {
            valA = a.type === FlightType.Arrival ? a.arrivalTime : a.departureTime;
            valB = b.type === FlightType.Arrival ? b.arrivalTime : b.departureTime;
        } else if (sortKey === 'airline') {
            valA = a.airline.name;
            valB = b.airline.name;
        } else {
            valA = a.flightNumber;
            valB = b.flightNumber;
        }
        
        if (valA === null) return 1;
        if (valB === null) return -1;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [state.flights, activeTab, sortKey, sortOrder]);

  const SortableHeader: React.FC<{ title: string; sortKeyName: 'time' | 'airline' | 'flightNumber' }> = ({ title, sortKeyName }) => (
      <th className="p-3 text-left text-xs font-semibold text-base-content-secondary uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortKeyName)}>
          {title} {sortKey === sortKeyName && (sortOrder === 'asc' ? '▲' : '▼')}
      </th>
  );

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex border-b border-base-300 mb-2">
        <button
          className={`py-2 px-4 text-lg font-bold ${activeTab === FlightType.Departure ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-base-content-secondary'}`}
          onClick={() => setActiveTab(FlightType.Departure)}
        >
          Departures
        </button>
        <button
          className={`py-2 px-4 text-lg font-bold ${activeTab === FlightType.Arrival ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-base-content-secondary'}`}
          onClick={() => setActiveTab(FlightType.Arrival)}
        >
          Arrivals
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-base-200 sticky top-0">
              <SortableHeader title="Time" sortKeyName="time" />
              <SortableHeader title="Airline" sortKeyName="airline" />
              <SortableHeader title="Flight" sortKeyName="flightNumber" />
              <th className="p-3 text-left text-xs font-semibold text-base-content-secondary uppercase tracking-wider">{activeTab === FlightType.Departure ? 'Destination' : 'Origin'}</th>
              <th className="p-3 text-left text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Aircraft</th>
              <th className="p-3 text-left text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Status</th>
              <th className="p-3 text-left text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Gate/Bay</th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map(flight => (
              <FlightRow key={flight.id} flight={flight} onRowClick={onFlightClick} />
            ))}
             {sortedFlights.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center p-8 text-base-content-secondary">No {activeTab.toLowerCase()}s scheduled.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightBoard;