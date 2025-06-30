import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { EXPANSION_COSTS, VEHICLE_DEFINITIONS, PARKING_LOT_UPGRADES } from '../constants';
import Icon from './Icon';
import { VehicleType } from '../types';

declare const dayjs: any;

const FinancePanel: React.FC = () => {
  const { state, dispatch } = useGameState();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };
   
  const handleExpand = (type: 'gate' | 'cargo_bay') => {
      const cost = EXPANSION_COSTS[type];
      if(state.money >= cost) {
          dispatch({ type: 'EXPAND_INFRASTRUCTURE', payload: { type, cost } });
      } else {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Not enough funds for expansion.', type: 'error' } });
      }
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-base-content mb-4">Finances & Assets</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between bg-base-300 p-2 rounded-md">
            <div className="flex items-center space-x-2">
                <Icon name="money" className="text-brand-green" />
                <span className="text-base-content-secondary">Funds</span>
            </div>
            <span className="font-mono text-brand-green">{formatMoney(state.money)}</span>
            </div>
            <div className="flex items-center justify-between bg-base-300 p-2 rounded-md">
            <div className="flex items-center space-x-2">
                <Icon name="reputation" className="text-brand-yellow" />
                <span className="text-base-content-secondary">Reputation</span>
            </div>
            <span className="font-mono text-brand-yellow">{state.reputation.toFixed(1)} / 100</span>
            </div>
        </div>
        
        <div className="mt-4">
            <h3 className="text-md font-bold text-base-content mb-2">Ground Transportation</h3>
            <div className="space-y-3 bg-base-300 p-3 rounded-md">
              {state.parkingLot.level === 0 ? (
                <p className="text-sm text-center text-base-content-secondary">No parking lot built.</p>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Parking Lot Lvl {state.parkingLot.level}</span>
                    <span className="text-sm text-base-content-secondary">Capacity: {state.parkingLot.capacity} cars</span>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="parking-fee" className="text-sm flex justify-between">
                      <span>Daily Fee:</span>
                      <span className="font-mono text-brand-green">{formatMoney(state.parkingLot.dailyFee)}</span>
                    </label>
                    <input
                      id="parking-fee"
                      type="range"
                      min="5"
                      max="100"
                      step="1"
                      value={state.parkingLot.dailyFee}
                      onChange={(e) => dispatch({ type: 'SET_PARKING_FEE', payload: parseInt(e.target.value) })}
                      className="w-full h-2 bg-base-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}

              {state.parkingLot.level < PARKING_LOT_UPGRADES.length && (
                <button
                  onClick={() => dispatch({ type: 'UPGRADE_PARKING_LOT' })}
                  disabled={state.money < PARKING_LOT_UPGRADES[state.parkingLot.level].cost}
                  className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                >
                  {state.parkingLot.level === 0 ? 'Build' : 'Upgrade'} Parking Lot ({formatMoney(PARKING_LOT_UPGRADES[state.parkingLot.level].cost)})
                </button>
              )}
            </div>
        </div>

        <div className="mt-4">
            <h3 className="text-md font-bold text-base-content mb-2">Infrastructure</h3>
            <div className="space-y-2">
            <button 
                onClick={() => handleExpand('gate')}
                disabled={state.money < EXPANSION_COSTS.gate}
                className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed"
            >
                New Gate ({formatMoney(EXPANSION_COSTS.gate)})
            </button>
             <button 
                onClick={() => handleExpand('cargo_bay')}
                disabled={state.money < EXPANSION_COSTS.cargo_bay}
                className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed"
            >
                New Cargo Bay ({formatMoney(EXPANSION_COSTS.cargo_bay)})
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePanel;