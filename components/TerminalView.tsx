
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import Icon from './Icon';
import { CHECK_IN_DESK_UPGRADES, SECURITY_LANE_UPGRADES, AMENITY_UPGRADES } from '../constants';
import { EmployeeType, AmenityType, Amenity } from '../types';

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const Gauge: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    const percentage = Math.max(0, Math.min(100, value));
    const color = percentage > 70 ? 'text-brand-green' : percentage > 40 ? 'text-brand-yellow' : 'text-brand-red';
    const rotation = (percentage / 100) * 180;
    
    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto">
            {/* Background Arc */}
            <div className="absolute w-full h-full rounded-t-full border-[1.5rem] border-base-300 border-b-0" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
            {/* Foreground Arc */}
            <div className="absolute w-full h-full rounded-t-full border-[1.5rem] border-b-0 border-transparent transition-transform duration-500" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 100%' }}>
                 <div className={`absolute w-full h-full rounded-t-full border-[1.5rem] border-b-0 ${color.replace('text-','border-')} `} style={{ clipPath: 'inset(0 50% 0 0)'}}></div>
            </div>
             <div className="absolute w-full h-full rounded-t-full border-transparent border-b-0" style={{ clipPath: 'inset(0 0 50% 0)' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className={`text-3xl font-bold ${color}`}>{value.toFixed(0)}%</span>
                    <span className="block text-xs uppercase font-semibold text-base-content-secondary">{label}</span>
                </div>
            </div>
        </div>
    );
};

const AmenityCard: React.FC<{
    type: AmenityType;
    icon: 'shop' | 'food';
    color: string;
}> = ({ type, icon, color }) => {
    const { state, dispatch } = useGameState();
    const amenity = state.amenities.find(a => a.type === type);
    const amenityUpgrades = AMENITY_UPGRADES[type];

    const handleBuild = () => {
        const cost = amenityUpgrades[0].cost;
        if (state.money >= cost) {
            dispatch({ type: 'BUILD_AMENITY', payload: { type, cost } });
        }
    };

    const handleUpgrade = () => {
        if (!amenity || amenity.level >= amenityUpgrades.length) return;
        const cost = amenityUpgrades[amenity.level].cost;
        if (state.money >= cost) {
            dispatch({ type: 'UPGRADE_AMENITY', payload: { amenityId: amenity.id, cost } });
        }
    };

    const benefits = amenity ? amenityUpgrades[amenity.level - 1] : null;
    const nextBenefits = amenity && amenity.level < amenityUpgrades.length ? amenityUpgrades[amenity.level] : null;

    return (
        <div className="bg-base-300 p-4 rounded-lg shadow-md flex flex-col">
            <div className={`flex items-center gap-3 mb-3`}>
                <Icon name={icon} className={`w-8 h-8 ${color}`} />
                <h3 className="font-bold text-lg">{type}</h3>
            </div>
            {!amenity ? (
                 <div className="text-center text-base-content-secondary py-8 flex-grow flex flex-col items-center justify-center">
                    <p className="mb-4">Build to generate extra revenue and improve satisfaction.</p>
                     <button
                        onClick={handleBuild}
                        disabled={state.money < amenityUpgrades[0].cost}
                        className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                    >
                        Build ({formatMoney(amenityUpgrades[0].cost)})
                    </button>
                 </div>
            ) : (
                <>
                    <div className="space-y-2 text-sm mb-4 flex-grow">
                        <p className="flex justify-between"><span>Level:</span> <span className="font-semibold">{amenity.level}</span></p>
                        <p className="flex justify-between"><span>Income:</span> <span className="font-semibold text-brand-green">${benefits?.incomePerPassenger.toFixed(2)} / PAX</span></p>
                         <p className="flex justify-between"><span>Satisfaction Boost:</span> <span className="font-semibold text-brand-yellow">+{(benefits!.satisfactionBonus * 100).toFixed(2)}%</span></p>
                    </div>
                    {nextBenefits ? (
                        <button
                            onClick={handleUpgrade}
                            disabled={state.money < nextBenefits.cost}
                            className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                        >
                            Upgrade to Level {amenity.level + 1} ({formatMoney(nextBenefits.cost)})
                        </button>
                    ) : (
                        <p className="text-center text-sm text-brand-green font-semibold mt-4">Max Level Reached</p>
                    )}
                </>
            )}
        </div>
    );
};


const TerminalView: React.FC = () => {
    const { state, dispatch } = useGameState();
    
    const checkInLevel = state.checkInDesks.level;
    const canUpgradeCheckIn = checkInLevel < CHECK_IN_DESK_UPGRADES.length;
    const checkInUpgrade = canUpgradeCheckIn ? CHECK_IN_DESK_UPGRADES[checkInLevel] : null;

    const securityLevel = state.securityLanes.level;
    const canUpgradeSecurity = securityLevel < SECURITY_LANE_UPGRADES.length;
    const securityUpgrade = canUpgradeSecurity ? SECURITY_LANE_UPGRADES[securityLevel] : null;

    const checkInCapacity = state.personnel[EmployeeType.CheckInAgent] * state.checkInDesks.capacityPerAgent;
    const securityCapacity = state.personnel[EmployeeType.SecurityGuard] * state.securityLanes.capacity;
    
    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <header className="flex-shrink-0 mb-4 pb-4 border-b border-base-300 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-base-content">Passenger Terminal</h2>
                 <div className="flex gap-4 items-center">
                     <div className="text-center bg-base-300 p-2 rounded-lg shadow-inner">
                         <p className="text-xs uppercase text-base-content-secondary">Check-in Queue</p>
                         <p className="text-2xl font-bold text-brand-orange">{Math.floor(state.checkInQueue)}</p>
                     </div>
                      <div className="text-center bg-base-300 p-2 rounded-lg shadow-inner">
                         <p className="text-xs uppercase text-base-content-secondary">Security Queue</p>
                         <p className="text-2xl font-bold text-brand-red">{Math.floor(state.securityQueue)}</p>
                     </div>
                    <div className="bg-base-100/50 p-2 rounded-lg">
                        <Gauge value={state.passengerSatisfaction} label="Satisfaction" />
                    </div>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-base-content-secondary mb-3">Terminal Amenities</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <AmenityCard type={AmenityType.Retail} icon="shop" color="text-brand-green" />
                    <AmenityCard type={AmenityType.FoodCourt} icon="food" color="text-brand-yellow" />
                </div>
                
                <h3 className="text-lg font-semibold text-base-content-secondary mb-3 mt-6">Passenger Processing</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Check-in Desks */}
                    <div className="bg-base-300 p-4 rounded-lg shadow-md flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <Icon name="ticket" className="w-8 h-8 text-brand-blue" />
                            <h3 className="font-bold text-lg">Check-in Desks</h3>
                        </div>
                        {checkInLevel === 0 ? (
                            <p className="text-center text-base-content-secondary py-8">Build check-in desks in the Infrastructure view to get started.</p>
                        ) : (
                            <>
                                <div className="space-y-2 text-sm mb-4 flex-grow">
                                    <p className="flex justify-between"><span>Level:</span> <span className="font-semibold">{checkInLevel}</span></p>
                                    <p className="flex justify-between"><span>Agents:</span> <span className="font-semibold">{state.personnel[EmployeeType.CheckInAgent]}</span></p>
                                    <p className="flex justify-between"><span>Efficiency:</span> <span className="font-semibold">{state.checkInDesks.capacityPerAgent} PAX / agent</span></p>
                                    <p className="flex justify-between font-bold text-base"><span>Total Throughput:</span> <span className="text-brand-blue">{checkInCapacity.toLocaleString()} PAX / hour</span></p>
                                </div>
                                {canUpgradeCheckIn && checkInUpgrade && (
                                    <button
                                        onClick={() => dispatch({ type: 'UPGRADE_CHECK_IN' })}
                                        disabled={state.money < checkInUpgrade.cost}
                                        className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                    >
                                        Upgrade to Level {checkInLevel + 1} ({formatMoney(checkInUpgrade.cost)})
                                    </button>
                                )}
                                {!canUpgradeCheckIn && <p className="text-center text-sm text-brand-green font-semibold mt-4">Max Level Reached</p>}
                            </>
                        )}
                    </div>

                    {/* Security Lanes */}
                     <div className="bg-base-300 p-4 rounded-lg shadow-md flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <Icon name="shield-check" className="w-8 h-8 text-brand-orange" />
                            <h3 className="font-bold text-lg">Security Lanes</h3>
                        </div>
                        {securityLevel === 0 ? (
                            <p className="text-center text-base-content-secondary py-8">Build security lanes in the Infrastructure view to get started.</p>
                        ) : (
                            <>
                                <div className="space-y-2 text-sm mb-4 flex-grow">
                                    <p className="flex justify-between"><span>Level:</span> <span className="font-semibold">{securityLevel}</span></p>
                                    <p className="flex justify-between"><span>Guards Active:</span> <span className="font-semibold">{state.personnel[EmployeeType.SecurityGuard]}</span></p>
                                    <p className="flex justify-between"><span>Capacity / Lane:</span> <span className="font-semibold">{state.securityLanes.capacity} PAX / hour</span></p>
                                    <p className="flex justify-between font-bold text-base"><span>Total Throughput:</span> <span className="text-brand-orange">{securityCapacity.toLocaleString()} PAX / hour</span></p>
                                </div>
                                {canUpgradeSecurity && securityUpgrade && (
                                    <button
                                        onClick={() => dispatch({ type: 'UPGRADE_SECURITY' })}
                                        disabled={state.money < securityUpgrade.cost}
                                        className="w-full bg-brand-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                    >
                                        Upgrade to Level {securityLevel + 1} ({formatMoney(securityUpgrade.cost)})
                                    </button>
                                )}
                                {!canUpgradeSecurity && <p className="text-center text-sm text-brand-green font-semibold mt-4">Max Level Reached</p>}
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TerminalView;
