import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { CONTRACT_OPTIONS } from '../constants';
import { ContractOption, ContractType } from '../types';
import dayjs from 'dayjs';

const ContractsPanel: React.FC = () => {
  const { state, dispatch } = useGameState();

  const handleSignContract = (contract: ContractOption) => {
    const expiryTime = state.time + contract.durationDays * 24 * 60 * 60 * 1000;
    dispatch({
      type: 'SIGN_CONTRACT',
      payload: { ...contract, expiryTime, satisfaction: 100, renewalOffered: false },
    });
  };
  
  const isContractActive = (contractId: string) => state.activeContracts.some(c => c.id === contractId);

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-bold text-base-content mb-4">Contracts</h2>
      
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        <div>
          <h3 className="text-md font-semibold text-base-content-secondary mb-2">Available Contracts</h3>
          <div className="space-y-2">
            {CONTRACT_OPTIONS.map(contract => (
              <div key={contract.id} className="bg-base-300 p-3 rounded-md">
                <p className="font-bold text-base-content">{contract.name}</p>
                <p className="text-sm text-base-content-secondary mb-2">{contract.description}</p>
                <div className="flex justify-between items-center text-sm">
                   <div className="flex space-x-4">
                        <span className="text-brand-red">Cost: ${contract.cost.toLocaleString()}</span>
                        <span className="text-brand-yellow">Rep: {contract.reputationRequired}+</span>
                   </div>
                   <button
                    onClick={() => handleSignContract(contract)}
                    disabled={state.money < contract.cost || state.reputation < contract.reputationRequired || isContractActive(contract.id)}
                    className="bg-brand-blue text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                  >
                    {isContractActive(contract.id) ? 'Active' : 'Sign'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-base-content-secondary mb-2 mt-4">Active Contracts</h3>
          {state.activeContracts.length > 0 ? (
            <div className="space-y-2">
              {state.activeContracts.map(contract => (
                <div key={contract.id} className="bg-base-300 p-3 rounded-md">
                  <p className="font-bold text-base-content">{contract.name}</p>
                  <p className="text-sm text-base-content-secondary">
                    Expires: {dayjs(contract.expiryTime).format('YYYY-MM-DD HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content-secondary text-center py-4">No active contracts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPanel;