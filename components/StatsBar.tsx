
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import Icon from './Icon';

const StatsBar: React.FC = () => {
    const { state } = useGameState();

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    };
    
    const fuelPercentage = state.fuelStorage.capacity > 0 ? (state.fuel / state.fuelStorage.capacity) * 100 : 0;
    const fuelColor = fuelPercentage > 50 ? 'text-brand-green' : fuelPercentage > 20 ? 'text-brand-yellow' : 'text-brand-red';

    return (
        <div className="bg-base-200 p-3 rounded-lg shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center md:justify-start space-x-3 bg-base-300 p-3 rounded-md">
                <Icon name="money" className="w-7 h-7 text-brand-green" />
                <div>
                    <div className="text-sm text-base-content-secondary">Funds</div>
                    <div className="font-mono text-lg font-bold text-base-content">{formatMoney(state.money)}</div>
                </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 bg-base-300 p-3 rounded-md">
                <Icon name="reputation" className="w-7 h-7 text-brand-yellow" />
                <div>
                    <div className="text-sm text-base-content-secondary">Reputation</div>
                    <div className="font-mono text-lg font-bold text-base-content">{state.reputation.toFixed(1)} / 100</div>
                </div>
            </div>
             <div className="flex items-center justify-center md:justify-start space-x-3 bg-base-300 p-3 rounded-md">
                <Icon name="fuel-tank" className="w-7 h-7 text-brand-orange" />
                <div>
                    <div className="text-sm text-base-content-secondary">Fuel</div>
                    <div className={`font-mono text-lg font-bold ${fuelColor}`}>{state.fuel.toLocaleString()} L</div>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
