import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { FUEL_STORAGE_UPGRADES, FUEL_DELIVERY_OPTIONS } from '../constants';
import Icon from './Icon';
import { ContractType } from '../types';
import dayjs from 'dayjs';

const FuelManagementView: React.FC = () => {
  const { state, dispatch } = useGameState();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };
  const formatMoneyPrecise = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  };

  const activeFuelContract = state.activeContracts.find(c => c.type === ContractType.FuelSupplier);
  const currentFuelPrice = activeFuelContract?.pricePerLiter ?? state.marketFuelPrice;

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-base-content mb-4">Fuel Management</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Fuel Storage Section */}
        <div>
          <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">Fuel Storage</h3>
          <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center font-semibold">
                  <div className="flex items-center gap-2">
                      <Icon name="fuel-tank" className="w-5 h-5 text-brand-orange" />
                      <span>Storage Level {state.fuelStorage.level}</span>
                  </div>
                  <span className="font-mono text-sm">{state.fuel.toLocaleString()} / {state.fuelStorage.capacity.toLocaleString()} L</span>
              </div>
              <div className="w-full bg-base-100 rounded-full h-2.5">
                  <div 
                      className="bg-brand-orange h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${(state.fuel / state.fuelStorage.capacity) * 100}%` }}
                  ></div>
              </div>
              
              {state.fuelStorage.level < FUEL_STORAGE_UPGRADES.length ? (
                  <button
                    onClick={() => dispatch({ type: 'UPGRADE_FUEL_STORAGE' })}
                    disabled={state.money < FUEL_STORAGE_UPGRADES[state.fuelStorage.level].cost}
                    className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed mt-2"
                  >
                    Upgrade to {FUEL_STORAGE_UPGRADES[state.fuelStorage.level].capacity.toLocaleString()}L ({formatMoney(FUEL_STORAGE_UPGRADES[state.fuelStorage.level].cost)})
                  </button>
              ) : (
                  <p className="text-sm text-center text-base-content-secondary">Storage at max level.</p>
              )}
          </div>
        </div>

        {/* Order Fuel Section */}
        <div>
          <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">Order Fuel Delivery</h3>
          <div className="space-y-3 bg-base-300 p-4 rounded-lg shadow">
              {activeFuelContract ? (
                  <div className='text-sm mb-3'>
                      <p>Active Supplier: <span className='font-bold text-brand-green'>{activeFuelContract.name}</span></p>
                      <p>Contract Price: <span className='font-bold text-brand-green'>{formatMoneyPrecise(currentFuelPrice)} / Liter</span></p>
                  </div>
                ) : (
                  <div className='text-sm mb-3'>
                      <p className='text-brand-yellow'>No active fuel contract.</p>
                      <p>Spot Market Price: <span className='font-bold text-brand-red'>{formatMoneyPrecise(state.marketFuelPrice)} / Liter</span></p>
                  </div>
                )}
              <div className="space-y-2">
                  {FUEL_DELIVERY_OPTIONS.map((option, index) => {
                      const cost = option.amount * currentFuelPrice;
                      return (
                          <div key={index} className="flex items-center justify-between bg-base-100 p-2 rounded-md text-sm">
                              <div>
                                  <span className="font-bold">{option.amount.toLocaleString()} L</span>
                                  <span className="text-base-content-secondary ml-2">({option.deliveryTimeHours}h)</span>
                              </div>
                              <button
                                  onClick={() => dispatch({ type: 'ORDER_FUEL_DELIVERY', payload: {
                                      amount: option.amount,
                                      cost,
                                      arrivalTime: state.time + option.deliveryTimeHours * 60 * 60 * 1000
                                  }})}
                                  disabled={state.money < cost}
                                  className="bg-brand-blue text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                              >
                                  Order ({formatMoney(cost)})
                              </button>
                          </div>
                      );
                  })}
              </div>
                {state.fuelDeliveries.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-base-100">
                      <h5 className="text-md font-semibold mb-2">Pending Deliveries:</h5>
                      <ul className="list-disc list-inside text-sm text-base-content-secondary space-y-1">
                          {state.fuelDeliveries.map((delivery, index) => (
                              <li key={index}>
                                  {delivery.amount.toLocaleString()}L arriving at {dayjs(delivery.arrivalTime).format('HH:mm')}
                              </li>
                          ))}
                      </ul>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelManagementView;