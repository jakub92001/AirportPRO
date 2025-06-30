import React, { useState, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { CONTRACT_OPTIONS } from '../constants';
import { ContractOption, ContractType, ActiveContract } from '../types';
import NegotiationModal from './NegotiationModal';
import dayjs from 'dayjs';

const ContractsView: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [negotiatingContract, setNegotiatingContract] = useState<ContractOption | null>(null);

  const handleSignContract = (contract: ActiveContract) => {
    dispatch({
      type: 'SIGN_CONTRACT',
      payload: contract,
    });
  };
  
  const handleSignDirectly = (contract: ContractOption) => {
      const expiryTime = state.time + contract.durationDays * 24 * 60 * 60 * 1000;
      const activeContract: ActiveContract = { ...contract, expiryTime, satisfaction: 100, renewalOffered: false };

      if (contract.type === ContractType.FuelSupplier) {
          activeContract.pricePerLiter = contract.basePricePerLiter;
      }
      
      handleSignContract(activeContract);
  }

  const handleTerminateContract = (contract: ActiveContract) => {
      if (window.confirm(`Are you sure you want to terminate the contract with ${contract.name}? This will cost $${contract.penalty.toLocaleString()} and cannot be undone.`)) {
        dispatch({ type: 'TERMINATE_CONTRACT', payload: { contractId: contract.id } });
      }
  }

  const isContractActive = (contractId: string) => state.activeContracts.some(c => c.id === contractId);

  const activeFuelContract = state.activeContracts.find(c => c.type === ContractType.FuelSupplier);

  const contractCategories = useMemo(() => {
    const airlineContracts = CONTRACT_OPTIONS.filter(c => c.type === ContractType.Airline);
    const otherContracts = CONTRACT_OPTIONS.filter(c => c.type !== ContractType.Airline);
    return [
      { title: 'Airline Contracts', contracts: airlineContracts },
      { title: 'Logistics & Services', contracts: otherContracts },
    ];
  }, []);

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-base-content mb-4">Contracts Management</h2>
      
      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {contractCategories.map(category => (
          <div key={category.title}>
            <h3 className="text-lg font-semibold text-base-content-secondary mb-2 border-b border-base-300 pb-2">{category.title}</h3>
            <div className="space-y-3">
              {category.contracts.map(contract => {
                const isFuelContract = contract.type === ContractType.FuelSupplier;
                const isDisabled = isContractActive(contract.id) || (isFuelContract && activeFuelContract && activeFuelContract.id !== contract.id);

                return (
                <div key={contract.id} className="bg-base-300 p-4 rounded-lg shadow">
                  <p className="font-bold text-lg text-base-content">{contract.name}</p>
                  <p className="text-sm text-base-content-secondary my-2">{contract.description}</p>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          {isFuelContract ? (
                              <span className="text-brand-orange font-semibold">Base Price: ${contract.basePricePerLiter?.toFixed(2)}/L</span>
                          ) : contract.type === ContractType.Logistics ? (
                              <span className="text-brand-green font-semibold">Revenue: ${contract.pickupRatePerPackage}/package</span>
                          ) : (
                              <span className="text-brand-red font-semibold">Cost: ${contract.cost.toLocaleString()}</span>
                          )}
                          <span className="text-brand-yellow font-semibold">Rep: {contract.reputationRequired}+</span>
                          <span className="text-brand-blue font-semibold">Duration: {contract.durationDays} days</span>
                          {contract.penalty > 0 && (
                              <span className="text-brand-red/70 font-semibold">Penalty: ${contract.penalty.toLocaleString()}</span>
                          )}
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                      <button
                          onClick={() => setNegotiatingContract(contract)}
                          disabled={isDisabled || state.reputation < contract.reputationRequired}
                          className="bg-brand-orange text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                      >
                          Negotiate
                      </button>
                      <button
                          onClick={() => handleSignDirectly(contract)}
                          disabled={isDisabled || state.money < contract.cost || state.reputation < contract.reputationRequired}
                          className="bg-brand-blue text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                      >
                          {isContractActive(contract.id) ? 'Active' : 'Sign'}
                        </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        ))}
        
        <div>
          <h3 className="text-lg font-semibold text-base-content-secondary mb-2 mt-4 border-b border-base-300 pb-2">Active Contracts</h3>
          {state.activeContracts.length > 0 ? (
            <div className="space-y-2">
              {state.activeContracts.map(contract => (
                <div key={contract.id} className="bg-base-300 p-3 rounded-md">
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className="font-bold text-base-content">{contract.name}</p>
                            <p className="text-sm text-base-content-secondary">
                                Expires: {dayjs(contract.expiryTime).format('YYYY-MM-DD HH:mm')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {contract.type === ContractType.FuelSupplier && (
                                <p className="font-bold text-brand-green">${contract.pricePerLiter?.toFixed(2)}/L</p>
                            )}
                             {contract.type === ContractType.Logistics && (
                                <p className="font-bold text-brand-green">${contract.pickupRatePerPackage}/pkg</p>
                            )}
                            {contract.penalty > 0 && (
                                <button
                                    onClick={() => handleTerminateContract(contract)}
                                    disabled={state.money < contract.penalty}
                                    className="bg-brand-red text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-600 disabled:bg-base-100 disabled:text-base-content-secondary disabled:cursor-not-allowed"
                                >
                                    Terminate (${contract.penalty.toLocaleString()})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content-secondary text-center py-4">No active contracts.</p>
          )}
        </div>
      </div>
      <NegotiationModal
        isOpen={!!negotiatingContract}
        contract={negotiatingContract}
        onClose={() => setNegotiatingContract(null)}
        onSign={handleSignContract}
        currentTime={state.time}
      />
    </div>
  );
};

export default ContractsView;