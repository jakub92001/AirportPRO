
import { createContext, useContext, Dispatch } from 'react';
import { GameState, GameAction, Flight, FlightStatus, ActiveContract, Gate, Airline, ContractType, Vehicle, VehicleType, PlaneSize, CargoBay, FuelDelivery, CargoPackage, WeatherCondition, EmployeeType, ContractOption, LogisticsTruck, FlightType, FlightRouteProposal, ActiveFlightRoute, Amenity, AmenityType } from '../types';
import { INITIAL_GAME_STATE, AIRLINES, CITIES, FLIGHT_REVENUE_BASE, FLIGHT_COST_BASE, REQUIRED_SERVICES_PASSENGER, REQUIRED_SERVICES_CARGO, PARKING_LOT_UPGRADES, FUEL_CONSUMPTION, FUEL_STORAGE_UPGRADES, VEHICLE_DEFINITIONS, VEHICLE_HEALTH_DEGRADATION, VEHICLE_SELL_MULTIPLIER, FLIGHT_PROPOSAL_REJECT_REPUTATION_PENALTY, LANDED_FLIGHT_PENALTY_DELAY_MS, LANDED_FLIGHT_REPUTATION_PENALTY, TAXIING_DURATION_MS, SERVICING_TIME_MS, CARGO_PACKAGES_PER_PLANE, LOGISTICS_PICKUP_INTERVAL_MS, LOGISTICS_PICKUP_SIZE_PER_CONTRACT, CARGO_WAREHOUSE_UPGRADES, REQUIRED_SERVICES_EMERGENCY, EMERGENCY_PROBABILITY, EMERGENCY_REWARD, EMERGENCY_REPUTATION_BONUS, EMERGENCY_REPUTATION_PENALTY, EMERGENCY_RUNWAY_BLOCK_DURATION_MS, SNOW_ACCUMULATION_RATE, MAX_SNOW_DEPTH, SNOWPLOW_DISPATCH_DURATION_MS, SNOW_CLEARING_RATE, LOGISTICS_TRUCK_DURATION_MS, FORKLIFT_PACKAGE_HANDLING_BONUS, CANCELLED_FLIGHT_REPUTATION_PENALTY, CONTRACT_SATISFACTION_BONUS, CONTRACT_SATISFACTION_PENALTY, INITIAL_PERSONNEL, PERSONNEL_DEFINITIONS, EXPANSION_COSTS, TIME_MULTIPLIER, INITIAL_FUEL_PRICE, PUSHBACK_DURATION_MS, DEICING_DURATION_MS, PASSENGER_SATISFACTION_PENALTY_DELAY, PASSENGERS_PER_PLANE, CHECK_IN_DESK_UPGRADES, SECURITY_LANE_UPGRADES, CONTRACT_OPTIONS, TICK_INTERVAL_MS, BOARDING_TIME_MS, YOUR_AIRPORT_ID, PASSENGER_ARRIVAL_WINDOW_MS, QUEUE_SATISFACTION_PENALTY_FACTOR, AMENITY_UPGRADES } from '../constants';

declare const dayjs: any;

export const GameStateContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
} | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// This is a placeholder for a more complex time management inside the reducer
let nextEventTimes: { [flightId: string]: number } = {};

const generateFlightsFromRoute = (route: ActiveFlightRoute, startTime: number, existingFlights: Flight[]): Flight[] => {
    const newFlights: Flight[] = [];
    const generationLookaheadDays = 7;
    const startGenerationDay = dayjs(startTime).startOf('day');
        
    for (let i = 0; i < generationLookaheadDays; i++) {
        const currentGenerationDay = startGenerationDay.add(i, 'day');
        const dayOfWeek = currentGenerationDay.day();

        if (route.daysOfWeek.includes(dayOfWeek)) {
            const flightId = `F-${route.id}-${currentGenerationDay.format('YYYYMMDD')}`;
            if (existingFlights.some(f => f.id === flightId)) {
                continue; // Skip if already exists
            }

            const arrivalTime = currentGenerationDay
                .hour(route.arrivalTime.hour)
                .minute(route.arrivalTime.minute)
                .valueOf();
            
            if (arrivalTime < startTime) continue;

            const newFlight: Flight = {
                id: flightId,
                type: FlightType.Arrival,
                airline: route.airline,
                flightNumber: `${route.airline.id.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
                destination: YOUR_AIRPORT_ID,
                origin: route.remoteCity,
                arrivalTime: arrivalTime,
                departureTime: null,
                gateOccupancyStartTime: null,
                status: FlightStatus.Scheduled,
                gateId: null,
                planeModel: route.planeModel,
                planeSize: route.planeSize,
                isCargo: route.isCargo,
                popularity: route.popularity,
                contractId: route.contractId,
                passengers: route.isCargo ? 0 : Math.floor(PASSENGERS_PER_PLANE[route.planeSize] * (0.8 + Math.random() * 0.2)),
            };
            newFlights.push(newFlight);
        }
    }
    return newFlights;
}


export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'TICK': {
        let newState = { ...state };
        let newVehicles = [...newState.vehicles];
        let newFlights = [...newState.flights];
        let newNotifications: GameState['notifications'] = []; // Start with fresh notifications for the tick to avoid duplicates
        const newTime = action.payload.newTime;

        // --- OPTIMIZATION: Create a pool of available vehicles for this tick. ---
        // This avoids repeatedly searching the full vehicles array inside the flight loop,
        // which is a major cause of UI lag ("stuck buttons") as the airport grows.
        const availableVehiclePool: { [key in VehicleType]?: Vehicle[] } = {};
        for (const v of newVehicles) {
            if (!v.isBusy) {
                if (!availableVehiclePool[v.type]) {
                    availableVehiclePool[v.type] = [];
                }
                availableVehiclePool[v.type]!.push(v);
            }
        }

        // --- Daily Processing ---
        const currentDay = dayjs(newTime).startOf('day').valueOf();
        if (currentDay > newState.lastDayProcessed) {
            let dailyMoneyChange = 0;
            let dailyReputationChange = 0;

            // Parking Income
            if (newState.parkingLot.level > 0) {
                dailyMoneyChange += newState.parkingLot.capacity * newState.parkingLot.dailyFee * 0.8;
            }
            // Contract Reputation Bonuses
            newState.activeContracts.forEach(c => {
                if (c.dailyReputationBonus) dailyReputationChange += c.dailyReputationBonus;
            });
            
            // Personnel Bonuses
            dailyReputationChange += (newState.personnel[EmployeeType.MarketingSpecialist] || 0) * 0.05;
            dailyReputationChange += (newState.personnel[EmployeeType.SecurityGuard] || 0) * 0.02;

            // Fuel Price Fluctuation
            const priceChange = (Math.random() - 0.5) * 0.1; // Fluctuate by max +/- $0.05
            newState.marketFuelPrice = Math.max(1.0, newState.marketFuelPrice + priceChange);

            newState.money += dailyMoneyChange;
            newState.reputation = Math.min(100, Math.max(0, newState.reputation + dailyReputationChange));
            newState.lastDayProcessed = currentDay;
        }

        // --- Generate Flights from Active Routes ---
        let newlyGeneratedFlights: Flight[] = [];
        newState.activeFlightRoutes = newState.activeFlightRoutes.map(route => {
            if (newTime > route.lastFlightGenerationTime + (24 * 60 * 60 * 1000)) {
                const generated = generateFlightsFromRoute(route, newTime, newFlights);
                newlyGeneratedFlights.push(...generated);
                return { ...route, lastFlightGenerationTime: newTime };
            }
            return route;
        });
        if (newlyGeneratedFlights.length > 0) {
            newFlights.push(...newlyGeneratedFlights);
        }

        // --- Monthly Salary Processing ---
        const currentMonth = dayjs(newTime).month();
        const lastPaymentMonth = dayjs(state.lastSalaryPaymentTime).month();
        if (currentMonth !== lastPaymentMonth) {
            let totalSalaryCost = 0;
            PERSONNEL_DEFINITIONS.forEach(def => {
                totalSalaryCost += (newState.personnel[def.type] || 0) * def.monthlySalary;
            });

            if (newState.money < totalSalaryCost) {
                newState.reputation = Math.max(0, newState.reputation - 10);
                newNotifications.push({ id: `${newTime}-salary-fail`, message: `Could not pay monthly staff salaries! Major reputation loss.`, type: 'error', time: newTime });
            } else {
                newState.money -= totalSalaryCost;
                newNotifications.push({ id: `${newTime}-salary-paid`, message: `Paid monthly salaries of ${totalSalaryCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`, type: 'info', time: newTime });
            }
            newState.lastSalaryPaymentTime = newTime;
        }
        
        // --- Generate Flight Route Proposals ---
        newState.activeContracts.forEach(contract => {
            if (contract.type !== ContractType.Airline || !contract.airlineId) return;
            const airline = state.availableAirlines.find(a => a.id === contract.airlineId);
            if (!airline) return;
            
            if(newState.flightRouteProposals.some(p => p.contractId === contract.id)) return;
            if(newState.activeFlightRoutes.some(r => r.contractId === contract.id)) return;

            const prob = 0.005 * (TIME_MULTIPLIER/60) * (contract.satisfaction / 50);

            if (Math.random() < prob) {
                 const plane = airline.fleet[Math.floor(Math.random() * airline.fleet.length)];
                 const remoteCity = CITIES[Math.floor(Math.random() * CITIES.length)];
                 const numDays = Math.floor(Math.random() * 3) + 2; // 2-4 days a week
                 const daysOfWeek = [...new Set(Array.from({ length: numDays }, () => Math.floor(Math.random() * 7)))].sort();

                 const newProposal: FlightRouteProposal = {
                    id: `R${newTime}${Math.random().toString(16).substring(2,8)}`,
                    airline,
                    remoteCity,
                    planeModel: plane.model,
                    planeSize: plane.size,
                    isCargo: !!airline.isCargoOnly,
                    popularity: Math.floor(Math.random() * 40) + 30 + Math.floor(state.reputation / 4),
                    contractId: contract.id,
                    daysOfWeek,
                    arrivalTime: { hour: Math.floor(Math.random() * 24), minute: [0, 15, 30, 45][Math.floor(Math.random() * 4)] },
                    turnaroundHours: Math.floor(Math.random() * 2) + 2, // 2-3 hours
                 };
                 newNotifications.push({ id: newProposal.id, message: `New route proposal from ${airline.name}.`, type: 'info', time: newTime });
                 newState = gameReducer(newState, { type: 'ADD_ROUTE_PROPOSAL', payload: newProposal });
            }
        });

        // --- Passenger Flow Simulation ---
        let passengersArrivingThisTick = 0;
        newFlights.forEach(f => {
            if (f.type === FlightType.Departure && f.departureTime && !f.isCargo) {
                const arrivalWindowStart = f.departureTime - PASSENGER_ARRIVAL_WINDOW_MS;
                const arrivalWindowEnd = f.departureTime - 30 * 60 * 1000; // Stop arriving 30 mins before
                if (newTime >= arrivalWindowStart && newTime < arrivalWindowEnd) {
                    const totalWindowDurationMs = arrivalWindowEnd - arrivalWindowStart;
                    const tickDurationMs = TICK_INTERVAL_MS * TIME_MULTIPLIER;
                    const passengersPerTick = (f.passengers / totalWindowDurationMs) * tickDurationMs;
                    passengersArrivingThisTick += passengersPerTick;
                }
            }
        });

        newState.checkInQueue = (newState.checkInQueue || 0) + passengersArrivingThisTick;
        const checkInCapacityPerHour = (newState.personnel[EmployeeType.CheckInAgent] || 0) * (newState.checkInDesks.capacityPerAgent || 0);
        const checkInProcessRatePerTick = (checkInCapacityPerHour / (60 * 60 * 1000)) * (TICK_INTERVAL_MS * TIME_MULTIPLIER);
        const passengersProcessedAtCheckIn = Math.min(newState.checkInQueue, checkInProcessRatePerTick);
        newState.checkInQueue -= passengersProcessedAtCheckIn;
        newState.securityQueue = (newState.securityQueue || 0) + passengersProcessedAtCheckIn;
        
        const securityCapacityPerHour = (newState.personnel[EmployeeType.SecurityGuard] || 0) * (newState.securityLanes.capacity || 0);
        const securityProcessRatePerTick = (securityCapacityPerHour / (60 * 60 * 1000)) * (TICK_INTERVAL_MS * TIME_MULTIPLIER);
        const passengersProcessedAtSecurity = Math.min(newState.securityQueue, securityProcessRatePerTick);
        newState.securityQueue -= passengersProcessedAtSecurity;

        // --- Satisfaction and Amenity Income ---
        const queuePenalty = (newState.checkInQueue + newState.securityQueue) * QUEUE_SATISFACTION_PENALTY_FACTOR;
        newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - queuePenalty);

        if (passengersProcessedAtSecurity > 0 && newState.amenities.length > 0) {
            let totalAmenityIncome = 0;
            let totalSatisfactionBonus = 0;
            newState.amenities.forEach(amenity => {
                const upgradeLevels = AMENITY_UPGRADES[amenity.type];
                if(upgradeLevels && amenity.level > 0 && amenity.level <= upgradeLevels.length) {
                    const def = upgradeLevels[amenity.level - 1];
                    totalAmenityIncome += passengersProcessedAtSecurity * def.incomePerPassenger;
                    totalSatisfactionBonus += def.satisfactionBonus;
                }
            });
            newState.money += totalAmenityIncome;
            newState.passengerSatisfaction = Math.min(100, newState.passengerSatisfaction + totalSatisfactionBonus);
        }

        // --- Event & State Updates ---
        // Snow accumulation & runway status
        if (newState.weather.condition === WeatherCondition.Snowy && !newState.snowplowClearingUntil) {
            newState.runwaySnowDepth = Math.min(MAX_SNOW_DEPTH + 1, newState.runwaySnowDepth + SNOW_ACCUMULATION_RATE);
            if (newState.runwaySnowDepth >= MAX_SNOW_DEPTH && !newState.isRunwayBlocked && newState.runwayBlockedUntil === 0) {
                newState.isRunwayBlocked = true;
                newNotifications.push({ id: `${newTime}-runway-snow-closed`, message: `Runway closed due to heavy snow! Dispatch snowplows to clear it.`, type: 'error', time: newTime });
            }
        }
        if (newState.runwayBlockedUntil > 0 && newTime >= newState.runwayBlockedUntil) {
            newState.isRunwayBlocked = false;
            newState.runwayBlockedUntil = 0;
            const emergencyVehicles = newVehicles.filter(v => REQUIRED_SERVICES_EMERGENCY.includes(v.type) && v.isBusy);
            emergencyVehicles.forEach(v => { v.isBusy = false; v.flightId = null; });
        }
        if (newState.snowplowClearingUntil > 0 && newTime >= newState.snowplowClearingUntil) {
             newState.snowplowClearingUntil = 0;
             const activeSnowplow = newVehicles.find(v => v.type === VehicleType.Snowplow && v.isBusy);
             if(activeSnowplow) { activeSnowplow.isBusy = false; }
             newNotifications.push({ id: `${newTime}-runway-cleared`, message: `Runway has been cleared of snow.`, type: 'success', time: newTime });
        }
        
        // Random Emergency Event Trigger
        const inAirFlights = newFlights.filter(f => f.status === FlightStatus.InAir && f.type === FlightType.Arrival && !f.isCargo);
        if (inAirFlights.length > 0 && Math.random() < (EMERGENCY_PROBABILITY * (TIME_MULTIPLIER/60))) {
             const flightToEndanger = inAirFlights[Math.floor(Math.random() * inAirFlights.length)];
             return gameReducer(newState, { type: 'TRIGGER_EMERGENCY', payload: { flightId: flightToEndanger.id } });
        }
        
        // Logistics Pickups
        newState.logisticsTrucks = newState.logisticsTrucks.filter(t => t.removeAtTime > newTime);
        const activeLogisticsContracts = newState.activeContracts.filter(c => c.type === ContractType.Logistics);
        if (activeLogisticsContracts.length > 0 && newState.cargoWarehouse.packages.length > 0 && newTime > (newState.lastLogisticsPickupTime + LOGISTICS_PICKUP_INTERVAL_MS)) {
             let packagesToCollect = LOGISTICS_PICKUP_SIZE_PER_CONTRACT * activeLogisticsContracts.length;
             const forkliftBonus = 1 + (newState.vehicles.filter(v => v.type === VehicleType.Forklift).length * FORKLIFT_PACKAGE_HANDLING_BONUS);
             const warehouseBonus = 1 + ((newState.personnel[EmployeeType.WarehouseOperative] || 0) * 0.1);
             packagesToCollect = Math.floor(packagesToCollect * forkliftBonus * warehouseBonus);
             
             const collectedPackages = newState.cargoWarehouse.packages.splice(0, packagesToCollect);
             
             if(collectedPackages.length > 0) {
                let logisticsRevenue = 0;
                const logisticianBonus = 1 + ((newState.personnel[EmployeeType.Logistician] || 0) * 0.05);

                activeLogisticsContracts.forEach(c => {
                    logisticsRevenue += (c.pickupRatePerPackage || 250) * (collectedPackages.length / activeLogisticsContracts.length) * logisticianBonus;
                    const truck: LogisticsTruck = { id: `${c.id}-${newTime}`, companyName: c.name, removeAtTime: newTime + LOGISTICS_TRUCK_DURATION_MS };
                    newState.logisticsTrucks.push(truck);
                });
                newState.money += Math.floor(logisticsRevenue);
                newNotifications.push({id:`${newTime}-logistics`, message: `Logistics partners picked up ${collectedPackages.length} packages for $${Math.floor(logisticsRevenue).toLocaleString()}.`, type: 'success', time: newTime });
             }
             newState.lastLogisticsPickupTime = newTime;
        }

        // HR Automation
        if (newState.isHrAutomationEnabled && newState.personnel[EmployeeType.HRManager] > 0) {
            const atcTarget = Math.ceil((newState.gates.length + newState.cargoBays.length) / 2);
            if(newState.personnel[EmployeeType.AirTrafficController] < atcTarget) {
                 newState = gameReducer(newState, { type: 'HIRE_EMPLOYEE', payload: { type: EmployeeType.AirTrafficController }});
            } else if (newState.personnel[EmployeeType.AirTrafficController] > atcTarget + 1) {
                 newState = gameReducer(newState, { type: 'FIRE_EMPLOYEE', payload: { type: EmployeeType.AirTrafficController }});
            }
        }

        // Vehicle passive repair
        const repairAmount = (newState.personnel[EmployeeType.MaintenanceTechnician] || 0) * 0.05;
        if (repairAmount > 0) {
            newVehicles = newVehicles.map(v => 
                (!v.isBusy && v.health < 100) ? { ...v, health: Math.min(100, v.health + repairAmount) } : v
            );
        }

        // ATC Capacity Check & Passenger Satisfaction decay from delays
        const activeAirTraffic = newFlights.filter(f => [FlightStatus.InAir, FlightStatus.Landed, FlightStatus.Taxiing, FlightStatus.Departing, FlightStatus.Pushback, FlightStatus.Deicing, FlightStatus.EmergencyLanding].includes(f.status)).length;
        const atcCapacity = (newState.personnel[EmployeeType.AirTrafficController] || 0) * 2;
        if (activeAirTraffic > atcCapacity) {
            newState.reputation = Math.max(0, newState.reputation - 0.01);
            newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - 0.02);
        }

        // Fuel deliveries
        const arrivedDeliveries = newState.fuelDeliveries.filter(d => newTime >= d.arrivalTime);
        if (arrivedDeliveries.length > 0) {
            const totalFuelArrived = arrivedDeliveries.reduce((sum, d) => sum + d.amount, 0);
            newState.fuel = Math.min(newState.fuelStorage.capacity, newState.fuel + totalFuelArrived);
            newState.fuelDeliveries = newState.fuelDeliveries.filter(d => newTime < d.arrivalTime);
            newNotifications.push({ id: `${newTime}-fuel`, message: `${totalFuelArrived.toLocaleString()}L of fuel delivered.`, type: 'success', time: newTime });
        }
        
        // Flight Lifecycle
        newFlights = newFlights.map(flight => {
            let f = {...flight};
            const nextEventTime = nextEventTimes[f.id] || f.arrivalTime;
            if (newTime < nextEventTime) return f;

            switch(f.status) {
                case FlightStatus.InAir:
                    if (f.type === FlightType.Arrival) {
                        if (newState.isRunwayBlocked) {
                            nextEventTimes[f.id] = newTime + 5 * 60 * 1000; // Hold for 5 mins
                            newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - PASSENGER_SATISFACTION_PENALTY_DELAY);
                        } else {
                            f.status = FlightStatus.Landed;
                            nextEventTimes[f.id] = newTime;
                        }
                    } else { // Departure
                        return null; // Mark for removal
                    }
                    break;
                case FlightStatus.Landed: {
                    const followMe = availableVehiclePool[VehicleType.FollowMe]?.pop();
                     if (followMe) {
                         followMe.isBusy = true;
                         followMe.flightId = f.id;
                         f.status = FlightStatus.Taxiing;
                         nextEventTimes[f.id] = newTime + TAXIING_DURATION_MS;
                     } else {
                         newState.reputation -= 0.01;
                         nextEventTimes[f.id] = newTime + 1 * 60 * 1000; // Wait 1 min for a car
                     }
                    break;
                }
                case FlightStatus.Taxiing: {
                     f.status = FlightStatus.ArrivedAtGate;
                     f.gateOccupancyStartTime = newTime;
                     const followMe = newVehicles.find(v => v.flightId === f.id && v.type === VehicleType.FollowMe);
                     if(followMe) { followMe.isBusy = false; followMe.flightId = null; }
                     nextEventTimes[f.id] = newTime;
                    break;
                }
                case FlightStatus.ArrivedAtGate: {
                    const servicesNeeded = f.isCargo ? REQUIRED_SERVICES_CARGO : REQUIRED_SERVICES_PASSENGER;
                    const allServicesAvailable = servicesNeeded.every(type =>
                        availableVehiclePool[type] && availableVehiclePool[type]!.length > 0
                    );

                    if (allServicesAvailable) {
                        servicesNeeded.forEach(serviceType => {
                            const serviceVehicle = availableVehiclePool[serviceType]!.pop()!;
                            serviceVehicle.isBusy = true;
                            serviceVehicle.flightId = f.id;
                        });
                        f.status = FlightStatus.Servicing;
                        nextEventTimes[f.id] = newTime + SERVICING_TIME_MS;
                    } else {
                        nextEventTimes[f.id] = newTime + 1 * 60 * 1000; // Wait for services
                    }
                    break;
                }
                case FlightStatus.Servicing: {
                    // Turnaround logic: transform arrival into departure
                    f.type = FlightType.Departure;
                    [f.origin, f.destination] = [f.destination, f.origin]; // Swap
                    const oldNum = parseInt(f.flightNumber.replace(/\D/g, '')) || 100;
                    f.flightNumber = `${f.airline.id.substring(0, 2).toUpperCase()}${oldNum + 1}`;
                    f.status = FlightStatus.ReadyForDeparture;
                    f.departureTime = newTime + BOARDING_TIME_MS + PUSHBACK_DURATION_MS;
                    f.passengers = f.isCargo ? 0 : Math.floor(PASSENGERS_PER_PLANE[f.planeSize] * (0.8 + Math.random() * 0.2));

                    const servicesNeeded = f.isCargo ? REQUIRED_SERVICES_CARGO : REQUIRED_SERVICES_PASSENGER;
                    newVehicles.forEach(v => {
                        if (v.flightId === f.id && servicesNeeded.includes(v.type)) {
                            v.isBusy = false;
                            v.flightId = null;
                            v.health = Math.max(0, v.health - VEHICLE_HEALTH_DEGRADATION);
                        }
                    });
                    nextEventTimes[f.id] = newTime;
                    break;
                }
                case FlightStatus.ReadyForDeparture: {
                    let baseTurnaround = 0;
                    if (!f.isCargo) {
                        const checkInCapacity = (newState.personnel[EmployeeType.CheckInAgent] || 0) * (newState.checkInDesks.capacityPerAgent || 20);
                        const securityCapacity = newState.securityLanes.capacity * (newState.personnel[EmployeeType.SecurityGuard] || 0);
                        const baggageHandlers = newState.personnel[EmployeeType.BaggageHandler] || 0;
                        
                        let passengerProcessingCapacity = Math.min(checkInCapacity, securityCapacity);
                        if (passengerProcessingCapacity < f.passengers) {
                            baseTurnaround += SERVICING_TIME_MS * 0.5; // Penalty for insufficient terminal facilities
                            newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - PASSENGER_SATISFACTION_PENALTY_DELAY * 2);
                        }
                        // Baggage handler bonus
                        baseTurnaround -= Math.min(SERVICING_TIME_MS * 0.3, baseTurnaround * (baggageHandlers * 0.02));
                    }
                    f.status = FlightStatus.Boarding;
                    nextEventTimes[f.id] = newTime + BOARDING_TIME_MS + baseTurnaround;
                    break;
                }
                 case FlightStatus.Boarding: {
                    if (f.gateId) {
                        const pushback = availableVehiclePool[VehicleType.Pushback]?.pop();
                        if(pushback) {
                            pushback.isBusy = true;
                            pushback.flightId = f.id;
                            f.status = FlightStatus.Pushback;
                            nextEventTimes[f.id] = newTime + PUSHBACK_DURATION_MS;
                        } else {
                            newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - PASSENGER_SATISFACTION_PENALTY_DELAY);
                            nextEventTimes[f.id] = newTime + 1 * 60 * 1000;
                        }
                    }
                    break;
                }
                case FlightStatus.Pushback: {
                    const pushback = newVehicles.find(v => v.flightId === f.id && v.type === VehicleType.Pushback);
                    if(pushback) { pushback.isBusy = false; pushback.flightId = null; }
                    
                    const needsDeicing = newState.weather.temperature <= 3 && [WeatherCondition.Rainy, WeatherCondition.Snowy, WeatherCondition.Foggy].includes(newState.weather.condition);
                    if (needsDeicing) {
                        const deicer = availableVehiclePool[VehicleType.Deicing]?.pop();
                        if(deicer){
                            deicer.isBusy = true;
                            deicer.flightId = f.id;
                            f.status = FlightStatus.Deicing;
                            nextEventTimes[f.id] = newTime + DEICING_DURATION_MS;
                        } else {
                            newState.passengerSatisfaction = Math.max(0, newState.passengerSatisfaction - PASSENGER_SATISFACTION_PENALTY_DELAY * 2);
                            nextEventTimes[f.id] = newTime + 1 * 60 * 1000;
                        }
                    } else {
                        f.status = FlightStatus.Departing;
                        nextEventTimes[f.id] = newTime;
                    }
                    break;
                }
                case FlightStatus.Deicing: {
                    const deicer = newVehicles.find(v => v.flightId === f.id && v.type === VehicleType.Deicing);
                    if(deicer) { deicer.isBusy = false; deicer.flightId = null; }
                    f.status = FlightStatus.Departing;
                    nextEventTimes[f.id] = newTime;
                    break;
                }
                 case FlightStatus.Departing: {
                    let revenueMultiplier = f.planeSize === PlaneSize.Medium ? 1.5 : f.planeSize === PlaneSize.Large ? 2.5 : 1;
                    const popularityBonus = 1 + (f.popularity - 50) / 100;
                    
                    let passengerServiceBonus = 1;
                    if (!f.isCargo) {
                        passengerServiceBonus = 1 + ((newState.personnel[EmployeeType.PassengerServiceAgent] || 0) * 0.005) + (newState.passengerSatisfaction / 1000);
                    }

                    const revenue = (FLIGHT_REVENUE_BASE + (f.isCargo ? 2000 : 0)) * revenueMultiplier * popularityBonus * passengerServiceBonus;
                    const cost = FLIGHT_COST_BASE * revenueMultiplier;
                    newState.money += revenue - cost;
                    newState.reputation = Math.min(100, newState.reputation + 0.1);
                    
                    const contract = newState.activeContracts.find(c => c.id === f.contractId);
                    if (contract) {
                        contract.satisfaction = Math.min(100, contract.satisfaction + CONTRACT_SATISFACTION_BONUS);
                    }

                    const locationId = f.gateId;
                    if (locationId) {
                        if (locationId.startsWith('G')) {
                            const gateIndex = newState.gates.findIndex(g => g.id === locationId);
                            if(gateIndex > -1) newState.gates[gateIndex] = {...newState.gates[gateIndex], isOccupied: false, flightId: null};
                        } else {
                            const bayIndex = newState.cargoBays.findIndex(b => b.id === locationId);
                            if(bayIndex > -1) newState.cargoBays[bayIndex] = {...newState.cargoBays[bayIndex], isOccupied: false, flightId: null};
                        }
                    }
                    f.gateId = null;
                    f.gateOccupancyStartTime = null;
                    f.status = FlightStatus.InAir;
                    nextEventTimes[f.id] = newTime + 5 * 60 * 1000; // Cleanup after 5 mins
                    break;
                }
                 case FlightStatus.Scheduled: {
                    if (newTime > f.arrivalTime && !f.gateId) {
                        f.status = FlightStatus.Cancelled;
                        delete nextEventTimes[f.id];
                        newState.reputation = Math.max(0, newState.reputation - CANCELLED_FLIGHT_REPUTATION_PENALTY);
                        newNotifications.push({ id: `${newTime}-${f.id}`, message: `Flight ${f.flightNumber} cancelled (no gate assigned).`, type: 'error', time: newTime });

                        const contract = newState.activeContracts.find(c => c.id === f.contractId);
                        if (contract) {
                             contract.satisfaction = Math.max(0, contract.satisfaction - CONTRACT_SATISFACTION_PENALTY);
                        }
                    } else if (newTime > f.arrivalTime - (2 * 60 * 60 * 1000) && f.gateId) {
                        f.status = FlightStatus.InAir;
                        nextEventTimes[f.id] = f.arrivalTime;
                    }
                     break;
                 }
                case FlightStatus.EmergencyLanding: {
                    if(newTime > newState.runwayBlockedUntil) {
                        return null; // Mark for removal
                    }
                    break;
                }
            }
            return f;
        }).filter(f => {
            if (f === null || f.status === FlightStatus.Cancelled) {
                if(f) delete nextEventTimes[f.id];
                return false;
            }
            return true;
        }) as Flight[];
        
        return { ...newState, time: newTime, flights: newFlights, vehicles: newVehicles, notifications: [...state.notifications, ...newNotifications] };
    }
    case 'SET_GAME_STATE': {
        let parsed = action.payload;

        // Migration for flights from old 'time' to new 'arrivalTime'
        if (Array.isArray(parsed.flights)) {
            parsed.flights = parsed.flights.map((f: any) => {
                if (f.time && !f.arrivalTime) {
                    f.arrivalTime = f.time;
                    delete f.time;
                }
                if (f.status === 'Proposed') {
                    f.status = FlightStatus.Scheduled;
                }
                 if (f.departureTime === undefined) f.departureTime = null;
                 if (f.gateOccupancyStartTime === undefined) f.gateOccupancyStartTime = null;
                return f;
            });
        }
        
        parsed.runwaySnowDepth = parsed.runwaySnowDepth || 0;
        parsed.isRunwayBlocked = parsed.isRunwayBlocked || false;
        parsed.runwayBlockedUntil = parsed.runwayBlockedUntil || 0;
        parsed.snowplowClearingUntil = parsed.snowplowClearingUntil || 0;
        parsed.logisticsTrucks = parsed.logisticsTrucks || [];
        parsed.personnel = { ...INITIAL_PERSONNEL, ...(parsed.personnel || {}) };
        parsed.isHrAutomationEnabled = parsed.isHrAutomationEnabled || false;
        parsed.lastSalaryPaymentTime = parsed.lastSalaryPaymentTime || parsed.time || Date.now();
        parsed.activeContracts = (parsed.activeContracts || []).map(c => ({
            ...c,
            satisfaction: c.satisfaction ?? 100,
            renewalOffered: c.renewalOffered ?? false,
        }));
        parsed.passengerSatisfaction = parsed.passengerSatisfaction ?? 80;
        parsed.checkInDesks = parsed.checkInDesks ?? { level: 0, capacityPerAgent: 0 };
        parsed.securityLanes = parsed.securityLanes ?? { level: 0, capacity: 0 };
        parsed.marketFuelPrice = parsed.marketFuelPrice ?? INITIAL_FUEL_PRICE;
        parsed.flightRouteProposals = parsed.flightRouteProposals || [];
        parsed.activeFlightRoutes = (parsed.activeFlightRoutes || []).map(r => ({
            ...r,
            lastFlightGenerationTime: r.lastFlightGenerationTime || 0
        }));
        parsed.checkInQueue = parsed.checkInQueue || 0;
        parsed.securityQueue = parsed.securityQueue || 0;
        parsed.amenities = parsed.amenities || [];


        // Migration: Remove groundCrews if it exists from an old save
        if ('groundCrews' in parsed) {
            delete (parsed as any).groundCrews;
        }

        return parsed;
    }
    case 'UPDATE_WEATHER':
        return { ...state, weather: action.payload };
    case 'ADD_FLIGHT':
        return { ...state, flights: [...state.flights, action.payload] };
    case 'ADD_FLIGHTS':
        return { ...state, flights: [...state.flights, ...action.payload] };
    case 'UPDATE_FLIGHT': {
        const { id } = action.payload;
        const flightBeforeUpdate = state.flights.find(f => f.id === id);
        if (!flightBeforeUpdate) return state;

        const flightAfterUpdate = { ...flightBeforeUpdate, ...action.payload };

        let newGates = state.gates;
        let newCargoBays = state.cargoBays;

        // If a gate is being assigned for the first time via drag-and-drop
        if (action.payload.gateId && !flightBeforeUpdate.gateId) {
            const locationId = action.payload.gateId;

            if (locationId.startsWith('G')) {
                newGates = state.gates.map(g => 
                    g.id === locationId ? { ...g, isOccupied: true, flightId: id } : g
                );
            } else { // It's a cargo bay
                newCargoBays = state.cargoBays.map(b => 
                    b.id === locationId ? { ...b, isOccupied: true, flightId: id } : b
                );
            }

            // And set next event time correctly with the new arrivalTime
            if (flightAfterUpdate.arrivalTime) {
                 nextEventTimes[id] = flightAfterUpdate.arrivalTime - (2 * 60 * 60 * 1000);
            }
        }
        
        return { 
            ...state, 
            flights: state.flights.map(f => f.id === id ? flightAfterUpdate : f),
            gates: newGates,
            cargoBays: newCargoBays,
        };
    }
    case 'REMOVE_FLIGHT':
        return { ...state, flights: state.flights.filter(f => f.id !== action.payload.id) };
    case 'SIGN_CONTRACT': {
        const contract = action.payload;
        const adminDiscount = 1 - Math.min(0.25, (state.personnel[EmployeeType.Administrator] || 0) * 0.005);
        const finalCost = Math.floor(contract.cost * adminDiscount);

        if (state.money < finalCost) {
            return {
                ...state,
                notifications: [...state.notifications, { id: Date.now().toString(), message: `Not enough funds to sign ${contract.name}.`, type: 'error', time: state.time }]
            };
        }
        
        let newActiveContracts = [...state.activeContracts, contract];
        if (contract.type === ContractType.FuelSupplier) {
            newActiveContracts = newActiveContracts.filter(c => c.type !== ContractType.FuelSupplier || c.id === contract.id);
        }
        
        let newAvailableAirlines = [...state.availableAirlines];
        let newFlights = [...state.flights];
        const newTime = state.time;

        if (contract.type === ContractType.Airline && contract.airlineId) {
            const airline = AIRLINES.find(a => a.id === contract.airlineId);
            if (airline && !newAvailableAirlines.some(a => a.id === airline.id)) {
                newAvailableAirlines.push(airline);

                // Add an inaugural flight that arrives soon
                const isCargo = !!airline.isCargoOnly;
                const plane = airline.fleet[Math.floor(Math.random() * airline.fleet.length)];
                const city = CITIES[Math.floor(Math.random() * CITIES.length)];
                const inauguralFlight: Flight = {
                    id: `F${newTime}${Math.random().toString(16).substring(2,6)}inaugural`,
                    type: FlightType.Arrival,
                    airline,
                    flightNumber: `${airline.id.substring(0,2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
                    destination: YOUR_AIRPORT_ID,
                    origin: city,
                    // Arrival time between 5 and 20 game minutes from now
                    arrivalTime: newTime + (Math.floor(Math.random() * 16) + 5) * 60 * 1000,
                    departureTime: null,
                    gateOccupancyStartTime: null,
                    status: FlightStatus.Scheduled,
                    gateId: null,
                    planeModel: plane.model,
                    planeSize: plane.size,
                    isCargo,
                    // Higher popularity and passenger load for the first flight
                    popularity: Math.floor(Math.random() * 20) + 80, 
                    contractId: contract.id,
                    passengers: isCargo ? 0 : Math.floor(PASSENGERS_PER_PLANE[plane.size] * (0.9 + Math.random() * 0.1)),
                };
                newFlights.push(inauguralFlight);
            }
        }
        
        let message = adminDiscount < 1 && contract.cost > 0 ? `Contract signed with ${contract.name}. Admin discount applied!` : `Contract signed with ${contract.name}.`;
        if (newFlights.length > state.flights.length) {
            message += ' Their first flight is on its way!';
        }

        return {
            ...state,
            money: state.money - finalCost,
            activeContracts: newActiveContracts,
            availableAirlines: newAvailableAirlines,
            flights: newFlights,
            notifications: [...state.notifications, { id: Date.now().toString(), message, type: 'success', time: state.time }]
        };
    }
    case 'TERMINATE_CONTRACT': {
        const { contractId } = action.payload;
        const contractToEnd = state.activeContracts.find(c => c.id === contractId);
        if (!contractToEnd || state.money < contractToEnd.penalty) {
            const msg = !contractToEnd ? "Contract not found." : "Not enough funds for termination penalty.";
            return { ...state, notifications: [...state.notifications, { id: Date.now().toString(), message: msg, type: 'error', time: state.time }]};
        }
        
        let newAvailableAirlines = [...state.availableAirlines];
        if (contractToEnd.type === ContractType.Airline) {
            newAvailableAirlines = newAvailableAirlines.filter(a => a.id !== contractToEnd.airlineId);
        }

        return {
            ...state,
            money: state.money - contractToEnd.penalty,
            activeContracts: state.activeContracts.filter(c => c.id !== contractId),
            availableAirlines: newAvailableAirlines,
            reputation: Math.max(0, state.reputation - 5),
            notifications: [...state.notifications, { id: Date.now().toString(), message: `Contract with ${contractToEnd.name} terminated.`, type: 'warning', time: state.time }]
        };
    }
    case 'RENEW_CONTRACT': {
        const { contractId } = action.payload;
        const contractToRenew = state.activeContracts.find(c => c.id === contractId);
        if (!contractToRenew || !contractToRenew.renewalOffered) return state;

        const originalOption = CONTRACT_OPTIONS.find(c => c.id === contractId);
        if (!originalOption) return state;
        
        const newDurationDays = Math.floor(originalOption.durationDays * 1.25);
        const newExpiryTime = contractToRenew.expiryTime + (newDurationDays - originalOption.durationDays) * 24 * 60 * 60 * 1000;
        const renewalCost = Math.floor(originalOption.cost * 0.5);

        if (state.money < renewalCost) {
            return { ...state, notifications: [...state.notifications, {id: Date.now().toString(), message: `Not enough money to renew ${contractToRenew.name}`, type: 'error', time: state.time }] };
        }

        const newContracts = state.activeContracts.map(c => {
            if (c.id === contractId) {
                return {
                    ...c,
                    cost: renewalCost,
                    durationDays: newDurationDays,
                    expiryTime: newExpiryTime,
                    renewalOffered: false,
                    satisfaction: 100,
                };
            }
            return c;
        });

        return {
            ...state,
            money: state.money - renewalCost,
            activeContracts: newContracts,
            notifications: [...state.notifications, {id: Date.now().toString(), message: `Contract with ${contractToRenew.name} renewed on favorable terms!`, type: 'success', time: state.time }]
        };
    }
    case 'ADD_ROUTE_PROPOSAL':
        return { ...state, flightRouteProposals: [...state.flightRouteProposals, action.payload] };
    case 'ACCEPT_ROUTE_PROPOSAL': {
        const { proposalId } = action.payload;
        const proposal = state.flightRouteProposals.find(p => p.id === proposalId);
        if (!proposal) return state;

        const newActiveRoute: ActiveFlightRoute = {
            ...proposal,
            lastFlightGenerationTime: state.time,
        };

        const newFlights = generateFlightsFromRoute(newActiveRoute, state.time, state.flights);

        return {
            ...state,
            flightRouteProposals: state.flightRouteProposals.filter(p => p.id !== proposalId),
            activeFlightRoutes: [...state.activeFlightRoutes, newActiveRoute],
            flights: [...state.flights, ...newFlights],
            notifications: [...state.notifications, {id: Date.now().toString(), message: `New route with ${proposal.airline.name} accepted!`, type: 'success', time: state.time }]
        };
    }
    case 'REJECT_ROUTE_PROPOSAL': {
        return {
            ...state,
            flightRouteProposals: state.flightRouteProposals.filter(p => p.id !== action.payload.proposalId),
            reputation: Math.max(0, state.reputation - FLIGHT_PROPOSAL_REJECT_REPUTATION_PENALTY),
        };
    }
    case 'ASSIGN_GATE': {
        const { flightId, gateId } = action.payload;
        const flight = state.flights.find(f => f.id === flightId);
        if(!flight) return state;
        
        const newState = {
            ...state,
            flights: state.flights.map(f => f.id === flightId ? { ...f, gateId: gateId } : f),
            gates: state.gates.map(g => g.id === gateId ? { ...g, isOccupied: true, flightId: flightId } : g),
        };
        // Set up the first event for this scheduled flight
        nextEventTimes[flightId] = flight.arrivalTime - (2 * 60 * 60 * 1000); // 2 hours before arrival
        return newState;
    }
     case 'ASSIGN_CARGO_BAY': {
        const { flightId, bayId } = action.payload;
        const flight = state.flights.find(f => f.id === flightId);
        if(!flight) return state;

        const newState = {
            ...state,
            flights: state.flights.map(f => f.id === flightId ? { ...f, gateId: bayId } : f),
            cargoBays: state.cargoBays.map(b => b.id === bayId ? { ...b, isOccupied: true, flightId: flightId } : b)
        };
        // Set up the first event for this scheduled flight
        nextEventTimes[flightId] = flight.arrivalTime - (2 * 60 * 60 * 1000); // 2 hours before arrival
        return newState;
    }
    case 'HIRE_EMPLOYEE': {
        const { type } = action.payload;
        const def = PERSONNEL_DEFINITIONS.find(d => d.type === type);
        if (!def) return state;

        const hireCost = def.monthlySalary;
        if (state.money < hireCost) {
            return { ...state, notifications: [...state.notifications, { id: Date.now().toString(), message: `Not enough funds to hire ${type}.`, type: 'error', time: state.time }] };
        }

        const newPersonnel = { ...state.personnel };
        newPersonnel[type] = (newPersonnel[type] || 0) + 1;

        return { ...state, money: state.money - hireCost, personnel: newPersonnel };
    }
    case 'FIRE_EMPLOYEE': {
        const { type } = action.payload;
        if ((state.personnel[type] || 0) <= 0) return state;
        const newPersonnel = { ...state.personnel };
        newPersonnel[type] -= 1;
        return { ...state, personnel: newPersonnel };
    }
    case 'TOGGLE_HR_AUTOMATION': {
        if ((state.personnel[EmployeeType.HRManager] || 0) === 0) {
            return { ...state, notifications: [...state.notifications, { id: Date.now().toString(), message: `You must hire an HR Manager to enable automation.`, type: 'warning', time: state.time }] };
        }
        return { ...state, isHrAutomationEnabled: !state.isHrAutomationEnabled };
    }
    case 'PURCHASE_VEHICLE': {
        const { type, cost } = action.payload;
        const adminDiscount = 1 - Math.min(0.25, (state.personnel[EmployeeType.Administrator] || 0) * 0.005);
        const finalCost = Math.floor(cost * adminDiscount);

        if (state.money < finalCost) return { ...state, notifications: [...state.notifications, { id: Date.now().toString(), message: `Not enough funds to purchase vehicle.`, type: 'error', time: state.time }] };
        
        const newVehicle: Vehicle = { id: `V${Date.now()}${Math.random().toString(36).substring(2, 5)}`, type, isBusy: false, flightId: null, health: 100 };
        const message = adminDiscount < 1 ? `Purchased new ${type} for $${finalCost.toLocaleString()} (Admin discount applied).` : `Purchased new ${type}.`;

        return { ...state, money: state.money - finalCost, vehicles: [...state.vehicles, newVehicle], notifications: [...state.notifications, { id: Date.now().toString(), message, type: 'success', time: state.time }] };
    }
    case 'EXPAND_INFRASTRUCTURE': {
        const adminDiscount = 1 - Math.min(0.25, (state.personnel[EmployeeType.Administrator] || 0) * 0.005);
        const finalCost = Math.floor(action.payload.cost * adminDiscount);

        if(state.money < finalCost) return state;
        let newState = { ...state, money: state.money - finalCost};
        const message = adminDiscount < 1 ? `(Admin discount applied).` : '';
        if (action.payload.type === 'gate') {
            const newGateId = `G${state.gates.length + 1}`;
            newState.gates.push({ id: newGateId, isOccupied: false, flightId: null });
            newState.notifications.push({id: Date.now().toString(), message: `New Gate ${newGateId} constructed ${message}`, type: 'success', time: state.time});
        } else if (action.payload.type === 'cargo_bay') {
            const newBayId = `C${state.cargoBays.length + 1}`;
            newState.cargoBays.push({ id: newBayId, isOccupied: false, flightId: null });
            newState.notifications.push({id: Date.now().toString(), message: `New Cargo Bay ${newBayId} constructed ${message}`, type: 'success', time: state.time});
        }
        return newState;
    }
     case 'UPGRADE_PARKING_LOT': {
        const currentLevel = state.parkingLot.level;
        if (currentLevel >= PARKING_LOT_UPGRADES.length) return state;
        const upgrade = PARKING_LOT_UPGRADES[currentLevel];
        if (state.money < upgrade.cost) return state;
        return {
            ...state,
            money: state.money - upgrade.cost,
            parkingLot: {
                level: currentLevel + 1,
                capacity: upgrade.capacity,
                dailyFee: state.parkingLot.dailyFee
            }
        };
    }
    case 'SET_PARKING_FEE':
        return { ...state, parkingLot: { ...state.parkingLot, dailyFee: action.payload } };
    case 'UPGRADE_FUEL_STORAGE': {
        const currentLevel = state.fuelStorage.level;
        if (currentLevel >= FUEL_STORAGE_UPGRADES.length) return state;
        const upgrade = FUEL_STORAGE_UPGRADES[currentLevel];
        if (state.money < upgrade.cost) return state;
        return {
            ...state,
            money: state.money - upgrade.cost,
            fuelStorage: {
                level: currentLevel + 1,
                capacity: upgrade.capacity
            }
        };
    }
    case 'ORDER_FUEL_DELIVERY': {
        if (state.money < action.payload.cost) return state;
        if (state.fuel + action.payload.amount > state.fuelStorage.capacity) {
            return { ...state, notifications: [...state.notifications, { id: Date.now().toString(), message: `Not enough storage for fuel delivery.`, type: 'error', time: state.time }] };
        }
        return {
            ...state,
            money: state.money - action.payload.cost,
            fuelDeliveries: [...state.fuelDeliveries, { amount: action.payload.amount, arrivalTime: action.payload.arrivalTime }]
        };
    }
    case 'UPGRADE_CARGO_WAREHOUSE': {
        const currentLevel = state.cargoWarehouse.level;
        if (currentLevel >= CARGO_WAREHOUSE_UPGRADES.length) return state;
        const upgrade = CARGO_WAREHOUSE_UPGRADES[currentLevel];
        if (state.money < upgrade.cost) return state;
        return {
            ...state,
            money: state.money - upgrade.cost,
            cargoWarehouse: {
                ...state.cargoWarehouse,
                level: currentLevel + 1,
                capacity: upgrade.capacity
            }
        };
    }
    case 'TRIGGER_EMERGENCY': {
        const { flightId } = action.payload;
        const emergencyFlight = state.flights.find(f => f.id === flightId);
        if (!emergencyFlight || emergencyFlight.status !== FlightStatus.InAir) return state;
        
        const hasAmbulance = state.vehicles.some(v => v.type === VehicleType.Ambulance && !v.isBusy);
        const hasFireTruck = state.vehicles.some(v => v.type === VehicleType.FireTruck && !v.isBusy);

        if (hasAmbulance && hasFireTruck) {
            const newVehicles = [...state.vehicles];
            const ambulance = newVehicles.find(v => v.type === VehicleType.Ambulance && !v.isBusy)!;
            const fireTruck = newVehicles.find(v => v.type === VehicleType.FireTruck && !v.isBusy)!;
            ambulance.isBusy = true;
            ambulance.flightId = flightId;
            fireTruck.isBusy = true;
            fireTruck.flightId = flightId;

            return {
                ...state,
                flights: state.flights.map(f => f.id === flightId ? { ...f, status: FlightStatus.EmergencyLanding, arrivalTime: state.time } : f),
                vehicles: newVehicles,
                money: state.money + EMERGENCY_REWARD,
                reputation: Math.min(100, state.reputation + EMERGENCY_REPUTATION_BONUS),
                isRunwayBlocked: true,
                runwayBlockedUntil: state.time + EMERGENCY_RUNWAY_BLOCK_DURATION_MS,
                notifications: [...state.notifications, { id: Date.now().toString(), message: `Emergency successfully handled for ${emergencyFlight.flightNumber}!`, type: 'success', time: state.time }]
            };
        } else {
             return {
                ...state,
                reputation: Math.max(0, state.reputation - EMERGENCY_REPUTATION_PENALTY),
                flights: state.flights.filter(f => f.id !== flightId), // The flight is lost
                notifications: [...state.notifications, { id: Date.now().toString(), message: `Failed to handle emergency for ${emergencyFlight.flightNumber} due to lack of vehicles! Catastrophic reputation loss.`, type: 'error', time: state.time }]
            };
        }
    }
    case 'CLEAR_RUNWAY': {
        if (state.runwaySnowDepth <= 0 || state.snowplowClearingUntil > 0) return state;
        const snowplow = state.vehicles.find(v => v.type === VehicleType.Snowplow && !v.isBusy);
        if (!snowplow) return state;

        const newVehicles = state.vehicles.map(v => v.id === snowplow.id ? { ...v, isBusy: true } : v);
        let snowDepth = state.runwaySnowDepth;
        let clearTimeMs = 0;
        while(snowDepth > 0) {
            snowDepth -= SNOW_CLEARING_RATE;
            clearTimeMs += (TICK_INTERVAL_MS / TIME_MULTIPLIER);
        }
        
        return {
            ...state,
            vehicles: newVehicles,
            runwaySnowDepth: 0,
            isRunwayBlocked: false,
            snowplowClearingUntil: state.time + SNOWPLOW_DISPATCH_DURATION_MS
        };
    }
    case 'SELL_VEHICLE': {
        const { vehicleId } = action.payload;
        const vehicleToSell = state.vehicles.find(v => v.id === vehicleId);
        if (!vehicleToSell || vehicleToSell.isBusy) return state;
        
        const vehicleDef = VEHICLE_DEFINITIONS.find(def => def.type === vehicleToSell.type);
        if (!vehicleDef) return state;

        const sellPrice = Math.floor(vehicleDef.cost * VEHICLE_SELL_MULTIPLIER * (vehicleToSell.health / 100));

        return {
            ...state,
            money: state.money + sellPrice,
            vehicles: state.vehicles.filter(v => v.id !== vehicleId)
        };
    }
    case 'REPAIR_VEHICLE': {
        const { vehicleId } = action.payload;
        const vehicleToRepair = state.vehicles.find(v => v.id === vehicleId);
        if (!vehicleToRepair || vehicleToRepair.health >= 100) return state;

        const vehicleDef = VEHICLE_DEFINITIONS.find(def => def.type === vehicleToRepair.type)!;
        const healthToRestore = 100 - vehicleToRepair.health;
        const repairCost = Math.floor(healthToRestore * (vehicleDef.cost * 0.004));

        if (state.money < repairCost) return state;

        return {
            ...state,
            money: state.money - repairCost,
            vehicles: state.vehicles.map(v => v.id === vehicleId ? { ...v, health: 100 } : v)
        };
    }
    case 'UPGRADE_CHECK_IN': {
        const currentLevel = state.checkInDesks.level;
        if (currentLevel >= CHECK_IN_DESK_UPGRADES.length) return state;
        const upgrade = CHECK_IN_DESK_UPGRADES[currentLevel];
        if (state.money < upgrade.cost) return state;
        return {
            ...state,
            money: state.money - upgrade.cost,
            checkInDesks: {
                level: currentLevel + 1,
                capacityPerAgent: upgrade.capacityPerAgent,
            }
        };
    }
    case 'UPGRADE_SECURITY': {
        const currentLevel = state.securityLanes.level;
        if (currentLevel >= SECURITY_LANE_UPGRADES.length) return state;
        const upgrade = SECURITY_LANE_UPGRADES[currentLevel];
        if (state.money < upgrade.cost) return state;
        return {
            ...state,
            money: state.money - upgrade.cost,
            securityLanes: {
                level: currentLevel + 1,
                capacity: upgrade.capacity,
            }
        };
    }
    case 'BUILD_AMENITY': {
        if (state.money < action.payload.cost) return state;
        const newAmenity: Amenity = {
            id: `${action.payload.type}-${Date.now()}`,
            type: action.payload.type,
            level: 1,
        };
        return {
            ...state,
            money: state.money - action.payload.cost,
            amenities: [...state.amenities, newAmenity],
        };
    }
    case 'UPGRADE_AMENITY': {
        if (state.money < action.payload.cost) return state;
        return {
            ...state,
            money: state.money - action.payload.cost,
            amenities: state.amenities.map(a =>
                a.id === action.payload.amenityId ? { ...a, level: a.level + 1 } : a
            ),
        };
    }
    default:
      return state;
  }
};
