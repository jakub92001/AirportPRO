
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { EXPANSION_COSTS, PARKING_LOT_UPGRADES, CARGO_WAREHOUSE_UPGRADES, CHECK_IN_DESK_UPGRADES, SECURITY_LANE_UPGRADES } from '../constants';

const InfrastructureView: React.FC = () => {
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
      <h2 className="text-xl font-bold text-base-content mb-4">Infrastructure & Expansions</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-6 max-w-4xl mx-auto w-full">
        
        <div>
          <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">Airside Expansions</h3>
          <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg">
                  <span className="font-bold text-lg">Gates</span>
                  <span className="text-2xl font-black my-2">{state.gates.length}</span>
                  <button 
                      onClick={() => handleExpand('gate')}
                      disabled={state.money < EXPANSION_COSTS.gate}
                      className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                  >
                      Build ({formatMoney(EXPANSION_COSTS.gate)})
                  </button>
              </div>
              <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg">
                  <span className="font-bold text-lg">Cargo Bays</span>
                  <span className="text-2xl font-black my-2">{state.cargoBays.length}</span>
                  <button 
                      onClick={() => handleExpand('cargo_bay')}
                      disabled={state.money < EXPANSION_COSTS.cargo_bay}
                      className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                  >
                      Build ({formatMoney(EXPANSION_COSTS.cargo_bay)})
                  </button>
              </div>
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">Landside & Terminal Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Parking Lot */}
              <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
                <span className="font-semibold text-lg">Parking Lot</span>
                {state.parkingLot.level === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-base-content-secondary mb-4">Build a parking lot to generate daily income.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span>Level {state.parkingLot.level}</span>
                      <span className="text-base-content-secondary">Capacity: {state.parkingLot.capacity} cars</span>
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
                    {state.parkingLot.level === 0 ? 'Build Parking Lot' : `Upgrade to Level ${state.parkingLot.level + 1}`} ({formatMoney(PARKING_LOT_UPGRADES[state.parkingLot.level].cost)})
                  </button>
                )}
              </div>
              {/* Cargo Warehouse */}
               <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
                  <span className="font-semibold text-lg">Cargo Warehouse</span>
                  {state.cargoWarehouse.level === 0 ? (
                     <div className="text-center p-4">
                        <p className="text-base-content-secondary mb-4">Build a warehouse to store and profit from cargo.</p>
                     </div>
                  ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span>Level {state.cargoWarehouse.level}</span>
                        <span className="text-base-content-secondary">Capacity: {state.cargoWarehouse.capacity} pkgs</span>
                      </div>
                  )}
                   {state.cargoWarehouse.level < CARGO_WAREHOUSE_UPGRADES.length && state.cargoWarehouse.level === 0 && (
                      <button
                        onClick={() => dispatch({ type: 'UPGRADE_CARGO_WAREHOUSE' })}
                        disabled={state.money < CARGO_WAREHOUSE_UPGRADES[state.cargoWarehouse.level].cost}
                        className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                      >
                       Build Warehouse ({formatMoney(CARGO_WAREHOUSE_UPGRADES[0].cost)})
                      </button>
                   )}
                   {state.cargoWarehouse.level > 0 && (
                      <p className="text-center text-sm text-base-content-secondary py-4">Manage and upgrade in the Cargo view.</p>
                   )}
              </div>
               {/* Check-in Desks */}
               <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
                  <span className="font-semibold text-lg">Check-in Desks</span>
                   {state.checkInDesks.level === 0 ? (
                     <div className="text-center p-4">
                        <p className="text-base-content-secondary mb-4">Build check-in desks to process passengers.</p>
                         <button
                            onClick={() => dispatch({ type: 'UPGRADE_CHECK_IN' })}
                            disabled={state.money < CHECK_IN_DESK_UPGRADES[0].cost}
                            className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                          >
                           Build Desks ({formatMoney(CHECK_IN_DESK_UPGRADES[0].cost)})
                         </button>
                     </div>
                  ) : (
                      <p className="text-center text-sm text-base-content-secondary py-4">Manage and upgrade in the Terminal view.</p>
                  )}
              </div>
              {/* Security Lanes */}
               <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
                  <span className="font-semibold text-lg">Security Lanes</span>
                   {state.securityLanes.level === 0 ? (
                     <div className="text-center p-4">
                        <p className="text-base-content-secondary mb-4">Build security lanes for passenger screening.</p>
                         <button
                            onClick={() => dispatch({ type: 'UPGRADE_SECURITY' })}
                            disabled={state.money < SECURITY_LANE_UPGRADES[0].cost}
                            className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                          >
                           Build Security ({formatMoney(SECURITY_LANE_UPGRADES[0].cost)})
                         </button>
                     </div>
                  ) : (
                      <p className="text-center text-sm text-base-content-secondary py-4">Manage and upgrade in the Terminal view.</p>
                  )}
              </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default InfrastructureView;
