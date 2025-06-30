
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { VEHICLE_DEFINITIONS, VEHICLE_SELL_MULTIPLIER } from '../constants';
import Icon from './Icon';
import { Vehicle, VehicleType } from '../types';

const getRepairCost = (vehicle: Vehicle) => {
    const vehicleDef = VEHICLE_DEFINITIONS.find(def => def.type === vehicle.type);
    if (!vehicleDef || vehicle.health >= 100) return 0;
    const healthToRestore = 100 - vehicle.health;
    // A full repair (0->100) costs 40% of the original price.
    return Math.floor(healthToRestore * (vehicleDef.cost * 0.004));
};

const getSellPrice = (vehicle: Vehicle) => {
    const vehicleDef = VEHICLE_DEFINITIONS.find(def => def.type === vehicle.type);
    if (!vehicleDef) return 0;
    return Math.floor(vehicleDef.cost * VEHICLE_SELL_MULTIPLIER * (vehicle.health / 100));
};


const VehiclesView: React.FC = () => {
    const { state, dispatch } = useGameState();

    const handlePurchaseVehicle = (type: VehicleType, cost: number) => {
        dispatch({ type: 'PURCHASE_VEHICLE', payload: { type, cost } });
    }
    const handleSellVehicle = (vehicleId: string) => {
        dispatch({ type: 'SELL_VEHICLE', payload: { vehicleId } });
    }
    const handleRepairVehicle = (vehicleId: string) => {
        dispatch({ type: 'REPAIR_VEHICLE', payload: { vehicleId } });
    }

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-base-content mb-4">Vehicle Management</h2>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Purchase Section */}
                <div className="lg:col-span-1 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">Purchase Vehicles</h3>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                        {VEHICLE_DEFINITIONS.map(vehicleDef => (
                            <div key={vehicleDef.type} className="flex items-center justify-between bg-base-300 p-3 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <Icon name={vehicleDef.icon} className="w-6 h-6 text-base-content-secondary" />
                                    <span className="font-semibold">{vehicleDef.name}</span>
                                </div>
                                <button
                                    onClick={() => handlePurchaseVehicle(vehicleDef.type, vehicleDef.cost)}
                                    disabled={state.money < vehicleDef.cost}
                                    className="bg-brand-blue text-white text-xs font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                >
                                    {formatMoney(vehicleDef.cost)}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Fleet Section */}
                <div className="lg:col-span-2 flex flex-col h-full">
                     <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">My Fleet ({state.vehicles.length})</h3>
                     <div className="flex-grow overflow-y-auto pr-2">
                        {state.vehicles.length === 0 ? (
                             <div className="text-center text-base-content-secondary py-16">You don't own any vehicles yet. Purchase some from the list on the left.</div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                {state.vehicles.map(vehicle => {
                                    const vehicleDef = VEHICLE_DEFINITIONS.find(def => def.type === vehicle.type)!;
                                    const repairCost = getRepairCost(vehicle);
                                    const sellPrice = getSellPrice(vehicle);
                                    const healthColor = vehicle.health > 60 ? 'bg-brand-green' : vehicle.health > 30 ? 'bg-brand-yellow' : 'bg-brand-red';
                                    
                                    return (
                                        <div key={vehicle.id} className="bg-base-300 p-3 rounded-lg flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <Icon name={vehicleDef.icon} className="w-6 h-6 text-base-content" />
                                                    <span className="font-bold">{vehicle.type}</span>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${vehicle.isBusy ? 'bg-brand-orange text-white' : 'bg-brand-green text-white'}`}>
                                                    {vehicle.isBusy ? `Busy` : 'Idle'}
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <label className="text-xs text-base-content-secondary flex justify-between">
                                                    <span>Condition</span>
                                                    <span className="font-semibold">{vehicle.health}%</span>
                                                </label>
                                                <div className="w-full bg-base-100 rounded-full h-1.5 mt-1">
                                                    <div className={`${healthColor} h-1.5 rounded-full`} style={{ width: `${vehicle.health}%` }}></div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-2 border-t border-base-100/50">
                                                <button 
                                                    onClick={() => handleRepairVehicle(vehicle.id)}
                                                    disabled={vehicle.health === 100 || state.money < repairCost}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs bg-brand-yellow text-black font-bold py-1.5 px-2 rounded-md hover:bg-yellow-400 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                                >
                                                    <Icon name="wrench" className="w-3 h-3" />
                                                    <span>Repair ({formatMoney(repairCost)})</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleSellVehicle(vehicle.id)}
                                                    disabled={vehicle.isBusy}
                                                    className="flex-1 text-xs bg-brand-red text-white font-bold py-1.5 px-2 rounded-md hover:bg-red-600 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                                >
                                                    Sell ({formatMoney(sellPrice)})
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
}

export default VehiclesView;
