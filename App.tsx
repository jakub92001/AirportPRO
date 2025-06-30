
import React, { useState, useEffect } from 'react';
import { GameStateContext, gameReducer } from './hooks/useGameState';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';
import Scheduler from './components/Scheduler';
import Icon from './components/Icon';
import ContractsView from './components/ContractsView';
import FuelManagementView from './components/FuelManagementView';
import VehiclesView from './components/VehiclesView';
import InfrastructureView from './components/InfrastructureView';
import FlightProposalsView from './components/FlightProposalsView';
import CargoView from './components/CargoView';
import PersonnelView from './components/PersonnelView';
import TerminalView from './components/TerminalView';
import { GameState, Weather } from './types';
import { fetchAndParseWeather } from './services/weatherService';
import { multiplayerService } from './services/multiplayerService';
import LoginView from './components/LoginView';

type View = 'dashboard' | 'scheduler' | 'contracts' | 'infrastructure' | 'fuel' | 'vehicles' | 'proposals' | 'cargo' | 'personnel' | 'terminal';

const Navbar: React.FC<{ activeView: View; setView: (view: View) => void }> = ({ activeView, setView }) => {
    const navButtonClass = (view: View) => 
        `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeView === view
            ? 'bg-brand-blue text-white'
            : 'text-base-content-secondary hover:bg-base-300'
        }`;

    return (
        <nav className="bg-base-200 p-2 flex justify-center items-center gap-1 sm:gap-2 shadow-md flex-shrink-0 flex-wrap">
            <button onClick={() => setView('dashboard')} className={navButtonClass('dashboard')} aria-label="Dashboard">
                <Icon name="layout" className="w-5 h-5" />
                <span className="hidden md:inline">Dashboard</span>
            </button>
            <button onClick={() => setView('scheduler')} className={navButtonClass('scheduler')} aria-label="Scheduler">
                <Icon name="schedule" className="w-5 h-5" />
                <span className="hidden md:inline">Scheduler</span>
            </button>
             <button onClick={() => setView('proposals')} className={navButtonClass('proposals')} aria-label="Flight Proposals">
                <Icon name="clipboard-check" className="w-5 h-5" />
                <span className="hidden md:inline">Proposals</span>
            </button>
             <button onClick={() => setView('terminal')} className={navButtonClass('terminal')} aria-label="Terminal">
                <Icon name="terminal" className="w-5 h-5" />
                <span className="hidden md:inline">Terminal</span>
            </button>
            <button onClick={() => setView('contracts')} className={navButtonClass('contracts')} aria-label="Contracts">
                <Icon name="contract" className="w-5 h-5" />
                <span className="hidden md:inline">Contracts</span>
            </button>
             <button onClick={() => setView('personnel')} className={navButtonClass('personnel')} aria-label="Personnel">
                <Icon name="users" className="w-5 h-5" />
                <span className="hidden md:inline">Personnel</span>
            </button>
            <button onClick={() => setView('infrastructure')} className={navButtonClass('infrastructure')} aria-label="Infrastructure">
                <Icon name="building" className="w-5 h-5" />
                <span className="hidden md:inline">Infrastructure</span>
            </button>
            <button onClick={() => setView('cargo')} className={navButtonClass('cargo')} aria-label="Cargo">
                <Icon name="box" className="w-5 h-5" />
                <span className="hidden md:inline">Cargo</span>
            </button>
            <button onClick={() => setView('fuel')} className={navButtonClass('fuel')} aria-label="Fuel Management">
                <Icon name="fuel-tank" className="w-5 h-5" />
                <span className="hidden md:inline">Fuel</span>
            </button>
            <button onClick={() => setView('vehicles')} className={navButtonClass('vehicles')} aria-label="Vehicles">
                <Icon name="garage" className="w-5 h-5" />
                <span className="hidden md:inline">Vehicles</span>
            </button>
        </nav>
    );
}

const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(multiplayerService.getState());
  
  useEffect(() => {
    const handleStateChange = (newState: GameState) => {
        setState(newState);
    };

    multiplayerService.subscribe(handleStateChange);
    
    return () => {
        multiplayerService.unsubscribe(handleStateChange);
    };
  }, []);

  return (
    <GameStateContext.Provider value={{ state, dispatch: multiplayerService.dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};


const Game: React.FC = () => {
  const { dispatch } = multiplayerService;
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const weather = await fetchAndParseWeather('EPKK');
        if (isMounted) {
          dispatch({ type: 'UPDATE_WEATHER', payload: weather });
        }
      } catch (error) {
        console.error("Failed to fetch live weather:", error);
        // Do not dispatch an error notification to avoid spamming the user on network issues
      }
    };

    // Fetch immediately on mount
    fetchWeather();

    // Then fetch every hour
    const intervalId = setInterval(fetchWeather, 60 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [dispatch]);


  return (
    <>
      <div className="h-screen w-screen bg-base-100 flex flex-col">
        <Navbar activeView={view} setView={setView} />
        <div className="flex-grow p-4 overflow-hidden">
            {view === 'dashboard' && <Dashboard />}
            {view === 'scheduler' && <Scheduler />}
            {view === 'contracts' && <ContractsView />}
            {view === 'fuel' && <FuelManagementView />}
            {view === 'vehicles' && <VehiclesView />}
            {view === 'infrastructure' && <InfrastructureView />}
            {view === 'proposals' && <FlightProposalsView />}
            {view === 'cargo' && <CargoView />}
            {view === 'personnel' && <PersonnelView />}
            {view === 'terminal' && <TerminalView />}
        </div>
      </div>
      <Notifications />
    </>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleLogin = async (username: string) => {
    setIsConnecting(true);
    await multiplayerService.connect(username);
    setIsConnecting(false);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
      return <LoginView onLogin={handleLogin} isConnecting={isConnecting} />;
  }
  
  return (
    <GameStateProvider>
      <Game />
    </GameStateProvider>
  );
};

export default App;