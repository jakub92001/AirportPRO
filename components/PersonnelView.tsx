
import React, { useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { PERSONNEL_DEFINITIONS } from '../constants';
import { EmployeeType } from '../types';
import Icon from './Icon';

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const PersonnelView: React.FC = () => {
    const { state, dispatch } = useGameState();

    const { totalStaff, dailySalaryCost } = useMemo(() => {
        let staffCount = 0;
        let salaryCost = 0;
        PERSONNEL_DEFINITIONS.forEach(def => {
            const count = state.personnel[def.type] || 0;
            staffCount += count;
            salaryCost += count * (def.monthlySalary / 30);
        });
        return { totalStaff: staffCount, dailySalaryCost: salaryCost };
    }, [state.personnel]);

    const handleHire = (type: EmployeeType) => {
        dispatch({ type: 'HIRE_EMPLOYEE', payload: { type } });
    };

    const handleFire = (type: EmployeeType) => {
        dispatch({ type: 'FIRE_EMPLOYEE', payload: { type } });
    };

    const isAutomationDisabled = state.personnel[EmployeeType.HRManager] === 0;

    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <header className="flex-shrink-0 mb-4 pb-4 border-b border-base-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-base-content">Personnel Management</h2>
                <div className="flex gap-4 text-center sm:text-right">
                    <div className="bg-base-300 p-2 rounded-md">
                        <div className="text-xs text-base-content-secondary uppercase font-semibold">Total Staff</div>
                        <div className="text-lg font-bold text-brand-blue">{totalStaff}</div>
                    </div>
                    <div className="bg-base-300 p-2 rounded-md">
                        <div className="text-xs text-base-content-secondary uppercase font-semibold">Total Daily Salary</div>
                        <div className="text-lg font-bold text-brand-red">{formatMoney(dailySalaryCost)}</div>
                    </div>
                </div>
            </header>
            
            <div className="mb-4 bg-base-300 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon name="hr-manager" className="w-6 h-6 text-brand-orange" />
                    <div>
                        <h4 className="font-bold">HR Automation</h4>
                        <p className="text-xs text-base-content-secondary">Requires at least one HR Manager. Automatically hires/fires staff to meet operational demands.</p>
                    </div>
                </div>
                 <label htmlFor="hr-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            id="hr-toggle"
                            className="sr-only"
                            checked={state.isHrAutomationEnabled}
                            onChange={() => dispatch({ type: 'TOGGLE_HR_AUTOMATION' })}
                            disabled={isAutomationDisabled}
                        />
                        <div className={`block ${isAutomationDisabled ? 'bg-base-100' : 'bg-gray-600'} w-14 h-8 rounded-full`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${state.isHrAutomationEnabled && !isAutomationDisabled ? 'translate-x-6 bg-brand-green' : ''}`}></div>
                    </div>
                </label>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {PERSONNEL_DEFINITIONS.map(def => {
                        const count = state.personnel[def.type] || 0;
                        const isHrControlled = state.isHrAutomationEnabled && def.type !== EmployeeType.HRManager;
                        return (
                            <div key={def.type} className="bg-base-300 rounded-lg p-4 flex flex-col shadow-md">
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon name={def.icon} className="w-7 h-7 text-base-content-secondary" />
                                    <h3 className="font-bold text-base-content text-lg">{def.name}</h3>
                                </div>
                                <p className="text-xs text-base-content-secondary flex-grow mb-3">{def.description}</p>
                                <div className="text-sm space-y-2 py-2 border-y border-base-100/50">
                                    <div className="flex justify-between"><span>Salary (Month):</span> <span className="font-semibold">{formatMoney(def.monthlySalary)}</span></div>
                                    <div className="flex justify-between"><span>Hired:</span> <span className="font-bold text-brand-blue">{count}</span></div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleFire(def.type)}
                                        disabled={count === 0 || isHrControlled}
                                        className="w-full bg-brand-red/80 text-white font-bold py-2 rounded-md hover:bg-brand-red transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => handleHire(def.type)}
                                        disabled={state.money < (def.monthlySalary / 30) || isHrControlled}
                                        className="w-full bg-brand-green/90 text-white font-bold py-2 rounded-md hover:bg-brand-green transition disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                 {isHrControlled && <p className="text-center text-xs text-brand-orange mt-2">Managed by HR</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PersonnelView;
