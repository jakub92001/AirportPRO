
import { gameReducer } from '../hooks/useGameState';
import { GameState, GameAction } from '../types';
import { INITIAL_GAME_STATE, TICK_INTERVAL_MS } from '../constants';

type StateListener = (state: GameState) => void;

class MultiplayerService {
    private state: GameState = INITIAL_GAME_STATE;
    private listeners: Set<StateListener> = new Set();
    private gameLoopInterval: any | null = null;
    private isConnected = false;
    public username = '';

    constructor() {
        this.dispatch = this.dispatch.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.connect = this.connect.bind(this);
        this.getState = this.getState.bind(this);
    }

    getState(): GameState {
        return this.state;
    }
    
    subscribe(listener: StateListener): void {
        this.listeners.add(listener);
        listener(this.state); // Immediately notify with current state
    }

    unsubscribe(listener: StateListener): void {
        this.listeners.delete(listener);
    }
    
    private notifyListeners(): void {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    dispatch(action: GameAction): void {
        // In a real app, this action would be sent to a server.
        // The server would run the reducer and broadcast the new state.
        // Here, we simulate that process locally.
        this.state = gameReducer(this.state, action);
        this.notifyListeners();
    }
    
    connect(username: string): Promise<void> {
        return new Promise((resolve) => {
            console.log(`Connecting as ${username}...`);
            this.username = username;
            
            // Simulate network delay
            setTimeout(() => {
                this.isConnected = true;
                
                // Initialize state and start the game loop
                // In a real app, we'd fetch the initial state from the server.
                this.dispatch({ type: 'SET_GAME_STATE', payload: INITIAL_GAME_STATE });

                if (this.gameLoopInterval) {
                    clearInterval(this.gameLoopInterval);
                }
                
                this.gameLoopInterval = setInterval(() => {
                    // The new time is generated here to simulate a server tick
                    this.dispatch({ type: 'TICK', payload: { newTime: Date.now() } });
                }, TICK_INTERVAL_MS);

                console.log("Connected.");
                resolve();
            }, 1000);
        });
    }

    disconnect(): void {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
        this.isConnected = false;
        this.username = '';
        console.log("Disconnected.");
    }
}

// Export a singleton instance
export const multiplayerService = new MultiplayerService();