
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { PlaneSize } from '../types';
import Icon from './Icon';
import { YOUR_AIRPORT_ID } from '../constants';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDays = (days: number[]) => days.map(d => dayNames[d]).join(', ');
const formatTime = (time: {hour: number, minute: number}) => `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

const PopularityStars: React.FC<{ popularity: number }> = ({ popularity }) => {
    const stars = Math.round(popularity / 20); // 1-5 stars
    return (
        <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < stars ? 'text-brand-yellow' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const getPlaneIconName = (size: PlaneSize) => {
    if (size === PlaneSize.Small) return 'plane-sm';
    if (size === PlaneSize.Large) return 'plane-lg';
    return 'plane-md';
}

const FlightProposalsView: React.FC = () => {
    const { state, dispatch } = useGameState();

    const proposedRoutes = state.flightRouteProposals.sort((a,b) => b.popularity - a.popularity);

    const handleAccept = (proposalId: string) => {
        dispatch({ type: 'ACCEPT_ROUTE_PROPOSAL', payload: { proposalId } });
    };

    const handleReject = (proposalId: string) => {
        dispatch({ type: 'REJECT_ROUTE_PROPOSAL', payload: { proposalId } });
    };

    return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-base-content mb-4">Flight Route Proposals</h2>
            <div className="flex-grow overflow-y-auto pr-2">
                {proposedRoutes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-base-content-secondary text-center">
                        <Icon name="clipboard-check" className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-semibold">All Clear!</h3>
                        <p>There are no new route proposals at the moment.</p>
                        <p className="text-sm mt-2">Sign more airline contracts to receive proposals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {proposedRoutes.map(proposal => {
                            const arrivalTime = proposal.arrivalTime;
                            const departureTime = { 
                                hour: (arrivalTime.hour + proposal.turnaroundHours) % 24, 
                                minute: arrivalTime.minute 
                            };

                            return (
                                <div key={proposal.id} className="bg-base-300 rounded-lg p-4 flex flex-col justify-between shadow-md">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {proposal.airline.logoUrl && <img src={proposal.airline.logoUrl} alt={proposal.airline.name} className="w-5 h-5 object-contain" />}
                                                <span className="font-bold text-base-content">{proposal.airline.name}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${proposal.isCargo ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                {proposal.isCargo ? 'Cargo' : 'Passenger'}
                                            </span>
                                        </div>
                                        <div className="text-center my-3 py-3 border-y border-base-100">
                                            <p className="text-sm text-base-content-secondary">Route</p>
                                            <p className="text-lg font-black text-white">{proposal.remoteCity} &harr; {YOUR_AIRPORT_ID}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-base-content-secondary">Aircraft</span>
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <Icon name={getPlaneIconName(proposal.planeSize)} className="w-4 h-4" />
                                                    <span>{proposal.planeModel}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-base-content-secondary">Popularity</span>
                                                <PopularityStars popularity={proposal.popularity} />
                                            </div>
                                            <div className="bg-base-100 p-2 rounded-md mt-2">
                                                <p className="text-center font-bold text-brand-yellow text-sm mb-1">{formatDays(proposal.daysOfWeek)}</p>
                                                <div className="text-xs text-center space-x-2">
                                                    <span>Arrival: <strong>{formatTime(arrivalTime)}</strong></span>
                                                    <span>&bull;</span>
                                                    <span>Departure: <strong>{formatTime(departureTime)}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button 
                                            onClick={() => handleReject(proposal.id)}
                                            className="w-full bg-brand-red/80 text-white font-bold py-2 px-3 rounded-md hover:bg-brand-red transition duration-200 text-sm"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleAccept(proposal.id)}
                                            className="w-full bg-brand-green text-white font-bold py-2 px-3 rounded-md hover:bg-green-500 transition duration-200 text-sm"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightProposalsView;
