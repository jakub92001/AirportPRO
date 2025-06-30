import React, { useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Flight, FlightStatus, VehicleType, FlightType, ContractType } from '../types';
import Icon from './Icon';
import { CARGO_WAREHOUSE_UPGRADES } from '../constants';
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

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const CargoView: React.FC = () => {
    const { state, dispatch } = useGameState();

    const cargoFlights = useMemo(() => state.flights.filter(f => f.isCargo), [state.flights]);
    const activeLogisticsContracts = useMemo(() => state.activeContracts.filter(c => c.type === ContractType.Logistics), [state.activeContracts]);
    
    const stats = useMemo(() => {
        const occupiedBays = state.cargoBays.filter(b => b.isOccupied).length;
        const activeFlights = cargoFlights.filter(f => f.gateId && f.status !== FlightStatus.Departing && f.status !== FlightStatus.Scheduled).length;
        
        const cargoLoaders = state.vehicles.filter(v => v.type === VehicleType.CargoLoader);
        const busyLoaders = cargoLoaders.filter(v => v.isBusy).length;

        const cargoTransporters = state.vehicles.filter(v => v.type === VehicleType.CargoTransporter);
        const busyTransporters = cargoTransporters.filter(v => v.isBusy).length;

        return { occupiedBays, activeFlights, cargoLoaders, busyLoaders, cargoTransporters, busyTransporters };
    }, [state.cargoBays, cargoFlights, state.vehicles]);
    
    const sortedFlights = useMemo(() => {
        return [...cargoFlights].sort((a,b) => a.arrivalTime - b.arrivalTime);
    }, [cargoFlights]);

    const warehouseFillPercentage = state.cargoWarehouse.capacity > 0 ? (state.cargoWarehouse.packages.length / state.cargoWarehouse.capacity) * 100 : 0;

    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-base-content mb-4 flex-shrink-0">Cargo Operations Center</h2>
            <div className="flex-grow grid md:grid-cols-3 gap-6 overflow-hidden">
                {/* Left Column */}
                <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
                    {/* Stats */}
                    <div className="bg-base-300 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-base-content-secondary mb-3 border-b border-base-100 pb-2">Operational Snapshot</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-base-100 p-2 rounded-md">
                                <p className="text-base-content-secondary">Cargo Bays</p>
                                <p className="text-xl font-bold">{stats.occupiedBays} / {state.cargoBays.length}</p>
                            </div>
                            <div className="bg-base-100 p-2 rounded-md">
                                <p className="text-base-content-secondary">Active Flights</p>
                                <p className="text-xl font-bold">{stats.activeFlights}</p>
                            </div>
                            <div className="bg-base-100 p-2 rounded-md">
                                <p className="text-base-content-secondary">Loaders</p>
                                <p className="text-xl font-bold">{stats.busyLoaders} / {stats.cargoLoaders.length}</p>
                            </div>
                            <div className="bg-base-100 p-2 rounded-md">
                                <p className="text-base-content-secondary">Transporters</p>
                                <p className="text-xl font-bold">{stats.busyTransporters} / {stats.cargoTransporters.length}</p>
                            </div>
                        </div>
                    </div>
                     {/* Warehouse */}
                    <div className="bg-base-300 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-base-content-secondary mb-3 border-b border-base-100 pb-2">Cargo Warehouse</h3>
                        {state.cargoWarehouse.level === 0 ? (
                            <div className="text-center text-base-content-secondary py-4">
                                <p>No warehouse built.</p>
                                <p className="text-sm">Build one in the Infrastructure view to start storing cargo.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold">Level {state.cargoWarehouse.level}</span>
                                    <span className="font-mono text-sm">{state.cargoWarehouse.packages.length.toLocaleString()} / {state.cargoWarehouse.capacity.toLocaleString()} pkgs</span>
                                </div>
                                <div className="w-full bg-base-100 rounded-full h-2.5">
                                    <div 
                                        className="bg-brand-yellow h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${warehouseFillPercentage}%` }}
                                    ></div>
                                </div>
                                {state.cargoWarehouse.level < CARGO_WAREHOUSE_UPGRADES.length ? (
                                    <button 
                                        onClick={() => dispatch({ type: 'UPGRADE_CARGO_WAREHOUSE' })}
                                        disabled={state.money < CARGO_WAREHOUSE_UPGRADES[state.cargoWarehouse.level].cost}
                                        className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                                    >
                                        Upgrade ({formatMoney(CARGO_WAREHOUSE_UPGRADES[state.cargoWarehouse.level].cost)})
                                    </button>
                                ) : <p className="text-sm text-center text-brand-green font-semibold">Warehouse at max level.</p>}
                            </div>
                        )}
                    </div>
                    {/* Logistics Partners */}
                    <div className="bg-base-300 p-4 rounded-lg shadow">
                         <h3 className="text-lg font-semibold text-base-content-secondary mb-3 border-b border-base-100 pb-2">Logistics Partners</h3>
                         <div className="space-y-2">
                            {activeLogisticsContracts.length > 0 ? activeLogisticsContracts.map(contract => (
                                <div key={contract.id} className="bg-base-100 p-2 rounded-md text-sm flex justify-between items-center">
                                    <span className="font-bold">{contract.name}</span>
                                    <span className="text-brand-green font-semibold">${contract.pickupRatePerPackage}/pkg</span>
                                </div>
                            )) : <p className="text-sm text-center text-base-content-secondary py-4">No active logistics contracts.</p>}
                         </div>
                    </div>
                </div>
                {/* Right Column */}
                <div className="md:col-span-2 flex flex-col overflow-y-auto bg-base-300 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-base-content-secondary mb-3 border-b border-base-100 pb-2 flex-shrink-0">Cargo Flight Manifest</h3>
                    <div className="flex-grow overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-base-300">
                                <tr>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Time</th>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Airline</th>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Flight</th>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Route</th>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Status</th>
                                    <th className="p-2 text-xs font-semibold text-base-content-secondary uppercase tracking-wider">Bay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedFlights.map(flight => {
                                    const displayTime = flight.type === FlightType.Arrival ? flight.arrivalTime : flight.departureTime;
                                    return (
                                    <tr key={flight.id} className="border-b border-base-100 hover:bg-base-100/50">
                                        <td className="p-2 text-sm font-mono">{displayTime ? dayjs(displayTime).format('HH:mm') : 'N/A'}</td>
                                        <td className="p-2 text-sm">{flight.airline.name}</td>
                                        <td className="p-2 text-sm font-mono">{flight.flightNumber}</td>
                                        <td className="p-2 text-sm">{flight.type === FlightType.Arrival ? flight.origin : flight.destination}</td>
                                        <td className={`p-2 text-sm font-bold ${getStatusColor(flight.status)}`}>{flight.status}</td>
                                        <td className="p-2 text-sm font-mono">{flight.gateId || '---'}</td>
                                    </tr>
                                    );
                                })}
                                {sortedFlights.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8 text-base-content-secondary">No cargo flights to display.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CargoView;