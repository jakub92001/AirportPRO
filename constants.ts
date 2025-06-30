import { GameState, WeatherCondition, Gate, Airline, ContractOption, ContractType, VehicleType, PlaneSize, CargoBay, EmployeeType, AmenityType } from './types';

export const TICK_INTERVAL_MS = 1000; // 1 second per game tick
export const TIME_MULTIPLIER = 1; // Game time is now 1:1 with real time
export const YOUR_AIRPORT_ID = 'EPKK';

export const AIRLINES: Airline[] = [
    { 
        id: 'ryanair', name: 'Ryanair', logoColor: 'bg-blue-800', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ryanair_logo.svg/2560px-Ryanair_logo.svg.png',
        fleet: [
            { model: 'B737-800', size: PlaneSize.Medium },
            { model: 'B737 MAX 8', size: PlaneSize.Medium },
            { model: 'A320', size: PlaneSize.Medium },
        ]
    },
    { 
        id: 'lufthansa', name: 'Lufthansa', logoColor: 'bg-yellow-400', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/2560px-Lufthansa_Logo_2018.svg.png',
        fleet: [
            { model: 'A320neo', size: PlaneSize.Medium },
            { model: 'A321neo', size: PlaneSize.Medium },
            { model: 'A350-900', size: PlaneSize.Large },
            { model: 'B747-8', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'emirates', name: 'Emirates', logoColor: 'bg-red-700', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/2560px-Emirates_logo.svg.png',
        fleet: [
            { model: 'A380-800', size: PlaneSize.Large },
            { model: 'B777-300ER', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'wizzair', name: 'Wizz Air', logoColor: 'bg-pink-600', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Wizz_Air_logo.svg/2560px-Wizz_Air_logo.svg.png',
        fleet: [
            { model: 'A320-200', size: PlaneSize.Medium },
            { model: 'A321neo', size: PlaneSize.Medium },
        ]
    },
    { 
        id: 'fedex', name: 'FedEx Express', logoColor: 'bg-purple-600', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/2560px-FedEx_Express.svg.png',
        isCargoOnly: true,
        fleet: [
            { model: 'ATR 72', size: PlaneSize.Small },
            { model: 'B757-200F', size: PlaneSize.Medium },
            { model: 'MD-11F', size: PlaneSize.Large },
            { model: 'B777F', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'delta', name: 'Delta Air Lines', logoColor: 'bg-blue-900', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/2560px-Delta_logo.svg.png',
        fleet: [
            { model: 'A220-300', size: PlaneSize.Small },
            { model: 'A321', size: PlaneSize.Medium },
            { model: 'A350-900', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'american', name: 'American Airlines', logoColor: 'bg-gray-400', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/American_Airlines_logo_2013.svg/2560px-American_Airlines_logo_2013.svg.png',
        fleet: [
            { model: 'B737-800', size: PlaneSize.Medium },
            { model: 'B787-9', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'klm', name: 'KLM', logoColor: 'bg-blue-400', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/KLM_logo.svg/2560px-KLM_logo.svg.png',
        fleet: [
            { model: 'E195-E2', size: PlaneSize.Small },
            { model: 'B737-800', size: PlaneSize.Medium },
            { model: 'B787-10', size: PlaneSize.Large },
        ]
    },
    { 
        id: 'dhl', name: 'DHL Aviation', logoColor: 'bg-yellow-500', logoUrl: 'https://upload.wikimedia.org/wikipedia/de/thumb/c/ca/DHL_Aviation_logo.svg/2560px-DHL_Aviation_logo.svg.png',
        isCargoOnly: true,
        fleet: [
            { model: 'B757-200PCF', size: PlaneSize.Medium },
            { model: 'B767-300F', size: PlaneSize.Medium },
            { model: 'A330-200F', size: PlaneSize.Large },
        ]
    },
];

export const CITIES = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles', 'Chicago', 'Hong Kong', 'Frankfurt', 'Warsaw', 'Dublin', 'Budapest', 'Amsterdam', 'Atlanta', 'Dallas'
];

export const INITIAL_GATES: Gate[] = [
    { id: 'G1', isOccupied: false, flightId: null },
    { id: 'G2', isOccupied: false, flightId: null },
];

export const INITIAL_CARGO_BAYS: CargoBay[] = [];

export const INITIAL_FUEL_PRICE = 2.5; // per Liter, used when no contract is active

export const INITIAL_PERSONNEL: GameState['personnel'] = {
    [EmployeeType.AirTrafficController]: 2,
    [EmployeeType.WarehouseOperative]: 0,
    [EmployeeType.MarketingSpecialist]: 0,
    [EmployeeType.CheckInAgent]: 0,
    [EmployeeType.BaggageHandler]: 0,
    [EmployeeType.MaintenanceTechnician]: 0,
    [EmployeeType.SecurityGuard]: 0,
    [EmployeeType.PassengerServiceAgent]: 0,
    [EmployeeType.Logistician]: 0,
    [EmployeeType.Administrator]: 0,
    [EmployeeType.HRManager]: 0,
};

export const INITIAL_GAME_STATE: GameState = {
  time: new Date().getTime(),
  money: 2000000,
  reputation: 50,
  weather: {
    condition: WeatherCondition.Sunny,
    temperature: 22,
    delayChance: 0.05,
  },
  flights: [],
  gates: INITIAL_GATES,
  cargoBays: INITIAL_CARGO_BAYS,
  vehicles: [],
  availableAirlines: [],
  activeContracts: [],
  notifications: [],
  parkingLot: { level: 0, capacity: 0, dailyFee: 25 },
  fuelStorage: { level: 0, capacity: 100000 },
  fuel: 50000,
  fuelDeliveries: [],
  lastDayProcessed: 0,
  cargoWarehouse: { level: 0, capacity: 0, packages: [] },
  lastLogisticsPickupTime: 0,
  runwaySnowDepth: 0,
  isRunwayBlocked: false,
  runwayBlockedUntil: 0,
  snowplowClearingUntil: 0,
  logisticsTrucks: [],
  personnel: INITIAL_PERSONNEL,
  isHrAutomationEnabled: false,
  lastSalaryPaymentTime: 0,
  passengerSatisfaction: 80,
  checkInDesks: { level: 0, capacityPerAgent: 0 },
  securityLanes: { level: 0, capacity: 0 },
  marketFuelPrice: INITIAL_FUEL_PRICE,
  flightRouteProposals: [],
  activeFlightRoutes: [],
  checkInQueue: 0,
  securityQueue: 0,
  amenities: [],
};

export const CONTRACT_OPTIONS: ContractOption[] = [
    // Airline Contracts
    { id: 'c1', type: ContractType.Airline, name: 'Wizz Air Agreement', description: 'Handle regional flights for the budget carrier Wizz Air.', cost: 15000, durationDays: 14, reputationRequired: 0, airlineId: 'wizzair', penalty: 5000 },
    { id: 'c2', type: ContractType.Airline, name: 'Ryanair Partnership', description: 'A major contract for one of Europe\'s biggest airlines.', cost: 30000, durationDays: 30, reputationRequired: 25, airlineId: 'ryanair', penalty: 15000 },
    { id: 'c3', type: ContractType.Airline, name: 'FedEx Cargo Hub', description: 'Become a hub for FedEx Express cargo operations. Requires good logistics.', cost: 60000, durationDays: 30, reputationRequired: 40, airlineId: 'fedex', penalty: 30000 },
    { id: 'c4', type: ContractType.Airline, name: 'Lufthansa Alliance', description: 'Join the big leagues with Germany\'s flag carrier. High traffic, high standards.', cost: 120000, durationDays: 30, reputationRequired: 65, airlineId: 'lufthansa', penalty: 50000 },
    { id: 'c5', type: ContractType.Airline, name: 'Emirates Luxury Routes', description: 'Service the prestigious Emirates fleet of large aircraft. Requires top-tier facilities.', cost: 250000, durationDays: 60, reputationRequired: 80, airlineId: 'emirates', penalty: 100000 },
    { id: 'c6', type: ContractType.Airline, name: 'Delta Domestic Hub', description: 'Connect the USA with a major Delta Air Lines contract.', cost: 80000, durationDays: 30, reputationRequired: 50, airlineId: 'delta', penalty: 40000 },
    { id: 'c7', type: ContractType.Airline, name: 'American Airlines Routes', description: 'Handle a mix of domestic and international flights for American Airlines.', cost: 95000, durationDays: 30, reputationRequired: 55, airlineId: 'american', penalty: 45000 },
    { id: 'c8', type: ContractType.Airline, name: 'KLM European Gateway', description: 'Become a key partner for Royal Dutch Airlines in Europe.', cost: 70000, durationDays: 30, reputationRequired: 45, airlineId: 'klm', penalty: 35000 },
    { id: 'c9', type: ContractType.Airline, name: 'DHL Global Cargo', description: 'A massive contract for time-sensitive global cargo.', cost: 150000, durationDays: 45, reputationRequired: 60, airlineId: 'dhl', penalty: 70000 },

    // Fuel Supplier Contracts
    { id: 'fs1', type: ContractType.FuelSupplier, name: 'FuelFast Standard Contract', description: 'A reliable choice for steady fuel supply.', cost: 0, durationDays: 30, reputationRequired: 10, basePricePerLiter: 2.30, penalty: 0 },
    { id: 'fs2', type: ContractType.FuelSupplier, name: 'PetroGlobal Bulk Agreement', description: 'Lower prices for a longer commitment and higher reputation.', cost: 0, durationDays: 60, reputationRequired: 45, basePricePerLiter: 2.15, penalty: 0 },
    { id: 'fs3', type: ContractType.FuelSupplier, name: 'EcoFuel Green Initiative', description: 'Slightly more expensive, but provides a small daily reputation boost.', cost: 10000, durationDays: 30, reputationRequired: 30, basePricePerLiter: 2.40, dailyReputationBonus: 0.2, penalty: 0 },

    // Transport Contracts
    { id: 't1', type: ContractType.Transport, name: 'City Bus Connection', description: 'Establish a bus line to the city. Increases daily reputation.', cost: 40000, durationDays: 30, reputationRequired: 40, dailyReputationBonus: 0.5, penalty: 0 },
    { id: 't2', type: ContractType.Transport, name: 'Airport Express Train', description: 'High-speed train link. Greatly increases daily reputation.', cost: 250000, durationDays: 60, reputationRequired: 70, dailyReputationBonus: 1.5, penalty: 0 },
    
    // Logistics Contracts
    { id: 'l1', type: ContractType.Logistics, name: 'InPost Parcel Service', description: 'Partner with InPost for reliable local and national parcel pickup.', cost: 10000, durationDays: 30, reputationRequired: 20, penalty: 2000, pickupRatePerPackage: 250 },
    { id: 'l2', type: ContractType.Logistics, name: 'UPS Ground Contract', description: 'A contract with a global logistics leader, UPS, for frequent cargo pickups.', cost: 45000, durationDays: 60, reputationRequired: 50, penalty: 10000, pickupRatePerPackage: 320 },
];

export const PARKING_LOT_UPGRADES = [
    { cost: 75000, capacity: 50 },   // Level 1
    { cost: 150000, capacity: 120 },  // Level 2
    { cost: 300000, capacity: 250 },  // Level 3
    { cost: 500000, capacity: 500 },  // Level 4
];

export const CARGO_WAREHOUSE_UPGRADES = [
    { cost: 120000, capacity: 100 },  // Level 1
    { cost: 250000, capacity: 250 },  // Level 2
    { cost: 500000, capacity: 600 },  // Level 3
];

export const CARGO_PACKAGES_PER_PLANE = {
    [PlaneSize.Small]: 10,
    [PlaneSize.Medium]: 25,
    [PlaneSize.Large]: 50,
};

export const PASSENGERS_PER_PLANE = {
    [PlaneSize.Small]: 50,
    [PlaneSize.Medium]: 180,
    [PlaneSize.Large]: 400,
};

export const CHECK_IN_DESK_UPGRADES = [
    { cost: 50000, capacityPerAgent: 20 },  // Level 1
    { cost: 100000, capacityPerAgent: 35 },  // Level 2
    { cost: 200000, capacityPerAgent: 50 },  // Level 3
];

export const SECURITY_LANE_UPGRADES = [
    { cost: 80000, capacity: 100 },  // Level 1
    { cost: 160000, capacity: 220 },  // Level 2
    { cost: 320000, capacity: 450 },  // Level 3
];

export const AMENITY_UPGRADES = {
    [AmenityType.Retail]: [
        { cost: 90000, incomePerPassenger: 5, satisfactionBonus: 0.001 }, // Level 1
        { cost: 180000, incomePerPassenger: 12, satisfactionBonus: 0.002 },// Level 2
        { cost: 350000, incomePerPassenger: 25, satisfactionBonus: 0.004 },// Level 3
    ],
    [AmenityType.FoodCourt]: [
        { cost: 120000, incomePerPassenger: 8, satisfactionBonus: 0.002 }, // Level 1
        { cost: 240000, incomePerPassenger: 18, satisfactionBonus: 0.004 },// Level 2
        { cost: 480000, incomePerPassenger: 35, satisfactionBonus: 0.008 },// Level 3
    ],
};

export const LOGISTICS_PICKUP_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 game hours
export const LOGISTICS_PICKUP_SIZE_PER_CONTRACT = 15; // Packages per truck
export const LOGISTICS_TRUCK_DURATION_MS = 15 * 60 * 1000; // 15 game minutes

export const FUEL_CONSUMPTION = {
    [PlaneSize.Small]: 3000,
    [PlaneSize.Medium]: 8000,
    [PlaneSize.Large]: 20000,
};

export const FUEL_STORAGE_UPGRADES = [
    { cost: 60000, capacity: 250000 },   // Level 1
    { cost: 150000, capacity: 750000 },  // Level 2
    { cost: 400000, capacity: 2000000 }, // Level 3
];

export const FUEL_DELIVERY_OPTIONS = [
    { amount: 25000, deliveryTimeHours: 2 },
    { amount: 75000, deliveryTimeHours: 4 },
    { amount: 200000, deliveryTimeHours: 8 },
];

export const VEHICLE_DEFINITIONS = [
    { type: VehicleType.FollowMe, name: 'Follow Me Car', cost: 18000, icon: 'follow-me' as const },
    { type: VehicleType.Catering, name: 'Catering Truck', cost: 20000, icon: 'catering' as const },
    { type: VehicleType.Fuel, name: 'Fuel Truck', cost: 30000, icon: 'fuel' as const },
    { type: VehicleType.Baggage, name: 'Baggage Cart', cost: 15000, icon: 'baggage' as const },
    { type: VehicleType.Stairs, name: 'Passenger Stairs', cost: 25000, icon: 'stairs' as const },
    { type: VehicleType.CargoLoader, name: 'Cargo Loader', cost: 35000, icon: 'cargoloader' as const },
    { type: VehicleType.CargoTransporter, name: 'Cargo Transporter', cost: 28000, icon: 'cargotransporter' as const },
    { type: VehicleType.Ambulance, name: 'Ambulance', cost: 45000, icon: 'ambulance' as const },
    { type: VehicleType.FireTruck, name: 'Fire Truck', cost: 80000, icon: 'fire-truck' as const },
    { type: VehicleType.Snowplow, name: 'Snowplow', cost: 65000, icon: 'snowplow' as const },
    { type: VehicleType.Forklift, name: 'Forklift', cost: 12000, icon: 'forklift' as const },
    { type: VehicleType.Pushback, name: 'Pushback Tug', cost: 40000, icon: 'pushback' as const },
    { type: VehicleType.Deicing, name: 'De-icing Truck', cost: 75000, icon: 'deicing' as const },
];

export const FORKLIFT_PACKAGE_HANDLING_BONUS = 0.15; // 15% more packages handled per forklift

export const VEHICLE_SELL_MULTIPLIER = 0.6;
export const VEHICLE_HEALTH_DEGRADATION = 2; // Health points lost per service

export const REQUIRED_SERVICES_PASSENGER: VehicleType[] = [VehicleType.Catering, VehicleType.Fuel, VehicleType.Baggage, VehicleType.Stairs];
export const REQUIRED_SERVICES_CARGO: VehicleType[] = [VehicleType.Fuel, VehicleType.CargoLoader, VehicleType.CargoTransporter];
export const REQUIRED_SERVICES_EMERGENCY: VehicleType[] = [VehicleType.Ambulance, VehicleType.FireTruck];


export const EXPANSION_COSTS = {
    gate: 150000,
    cargo_bay: 180000,
};

export const FLIGHT_REVENUE_BASE = 8000;
export const FLIGHT_COST_BASE = 2000;

export const PUSHBACK_DURATION_MS = 3 * 60 * 1000; // 3 game minutes
export const DEICING_DURATION_MS = 7 * 60 * 1000; // 7 game minutes
export const PASSENGER_SATISFACTION_PENALTY_DELAY = 0.1;
export const QUEUE_SATISFACTION_PENALTY_FACTOR = 0.0001; // Penalty per passenger in queue per tick
export const PASSENGER_ARRIVAL_WINDOW_MS = 3 * 60 * 60 * 1000; // Passengers start arriving 3h before departure

export const SERVICING_TIME_MS = 45 * 60 * 1000; // 45 game minutes for servicing
export const BOARDING_TIME_MS = 20 * 60 * 1000; // 20 game minutes for boarding

export const FLIGHT_PROPOSAL_REJECT_REPUTATION_PENALTY = 0.2;
export const LANDED_FLIGHT_PENALTY_DELAY_MS = 2 * 60 * 60 * 1000; // 2 game hours
export const LANDED_FLIGHT_REPUTATION_PENALTY = 0.5;
export const CANCELLED_FLIGHT_REPUTATION_PENALTY = 2;
export const FAILED_SERVICE_REPUTATION_PENALTY = 1;
export const CONTRACT_SATISFACTION_BONUS = 1.5;
export const CONTRACT_SATISFACTION_PENALTY = 3;


export const TAXIING_DURATION_MS = 5 * 60 * 1000; // 5 game minutes

// Emergency Constants
export const EMERGENCY_PROBABILITY = 0.005; // Chance per tick for an InAir flight to become an emergency
export const EMERGENCY_REWARD = 100000;
export const EMERGENCY_REPUTATION_BONUS = 5;
export const EMERGENCY_REPUTATION_PENALTY = 15;
export const EMERGENCY_RUNWAY_BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 game minutes

// Snow Constants
export const SNOW_ACCUMULATION_RATE = 0.5; // cm per tick during Snowy weather
export const MAX_SNOW_DEPTH = 10; // cm, runway closes at this depth
export const SNOW_CLEARING_RATE = 2.5; // cm per tick when snowplow is active
export const SNOWPLOW_DISPATCH_DURATION_MS = 15 * 60 * 1000; // 15 game minutes for a full clear cycle

// Personnel Constants
export interface PersonnelDefinition {
    type: EmployeeType;
    name: string;
    description: string;
    monthlySalary: number;
    icon: any;
}

export const PERSONNEL_DEFINITIONS: PersonnelDefinition[] = [
    { type: EmployeeType.AirTrafficController, name: 'Air Traffic Controller', description: 'Each controller handles 2 concurrent flights. Exceeding capacity causes reputation penalties.', monthlySalary: 8000, icon: 'atc' },
    { type: EmployeeType.MaintenanceTechnician, name: 'Maintenance Technician', description: 'Passively repairs idle vehicles over time, reducing manual repair costs.', monthlySalary: 5000, icon: 'maintenance-tech' },
    { type: EmployeeType.CheckInAgent, name: 'Check-in Agent', description: 'Increases check-in throughput, reducing ground time for passenger flights.', monthlySalary: 3000, icon: 'check-in' },
    { type: EmployeeType.BaggageHandler, name: 'Baggage Handler', description: 'Reduces passenger flight turnaround time.', monthlySalary: 3000, icon: 'baggage-handler' },
    { type: EmployeeType.PassengerServiceAgent, name: 'Passenger Service Agent', description: 'Improves passenger satisfaction, slightly increasing revenue from all passenger flights.', monthlySalary: 4000, icon: 'passenger-service' },
    { type: EmployeeType.SecurityGuard, name: 'Security Guard', description: 'Enhances airport security capacity and provides a small steady reputation boost.', monthlySalary: 3200, icon: 'security' },
    { type: EmployeeType.WarehouseOperative, name: 'Warehouse Operative', description: 'Speeds up warehouse operations, increasing the number of packages handled per pickup.', monthlySalary: 3500, icon: 'warehouse-staff' },
    { type: EmployeeType.Logistician, name: 'Logistician', description: 'Optimizes cargo handling, increasing the revenue earned per package from logistics partners.', monthlySalary: 7000, icon: 'logistician' },
    { type: EmployeeType.MarketingSpecialist, name: 'Marketing Specialist', description: 'Generates a consistent daily boost to your airport\'s reputation, attracting more attention.', monthlySalary: 6000, icon: 'marketing' },
    { type: EmployeeType.Administrator, name: 'Administrator', description: 'Provides a small discount on all new infrastructure and vehicle purchases.', monthlySalary: 7500, icon: 'admin' },
    { type: EmployeeType.HRManager, name: 'HR Manager', description: 'Enables automated personnel management to hire/fire staff based on airport needs.', monthlySalary: 9000, icon: 'hr-manager' },
];