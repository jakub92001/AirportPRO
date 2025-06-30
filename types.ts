
export enum FlightStatus {
  Scheduled = 'Scheduled',
  OnTime = 'On Time',
  Delayed = 'Delayed',
  Taxiing = 'Taxiing',
  Boarding = 'Boarding',
  Departing = 'Departing',
  InAir = 'In Air',
  Landed = 'Landed',
  ArrivedAtGate = 'Arrived at Gate',
  Servicing = 'Servicing',
  ReadyForDeparture = 'Ready for Departure', // New Status
  Cancelled = 'Cancelled',
  EmergencyLanding = 'Emergency Landing',
  Pushback = 'Pushback',
  Deicing = 'Deicing',
}

export enum FlightType {
  Arrival = 'Arrival',
  Departure = 'Departure',
}

export enum PlaneSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export interface Flight {
  id: string;
  type: FlightType;
  airline: Airline;
  flightNumber: string;
  destination: string;
  origin: string;
  arrivalTime: number; // Replaces 'time'
  departureTime: number | null; // New
  gateOccupancyStartTime: number | null; // New
  status: FlightStatus;
  gateId: string | null;
  planeModel: string;
  planeSize: PlaneSize;
  isCargo: boolean;
  popularity: number;
  contractId: string;
  passengers: number;
}

export interface Gate {
  id:string;
  isOccupied: boolean;
  flightId: string | null;
}

export interface CargoBay {
  id: string;
  isOccupied: boolean;
  flightId: string | null;
}

export enum WeatherCondition {
  Sunny = 'Sunny',
  Cloudy = 'Cloudy',
  Rainy = 'Rainy',
  Stormy = 'Stormy',
  Foggy = 'Foggy',
  Snowy = 'Snowy',
}

export interface Weather {
  condition: WeatherCondition;
  temperature: number; // Celsius
  delayChance: number;
}

export enum ContractType {
    Airline = 'Airline',
    Supplier = 'Supplier',
    Transport = 'Transport',
    FuelSupplier = 'Fuel Supplier',
    Logistics = 'Logistics',
}

export interface Airline {
    id: string;
    name: string;
    logoColor: string;
    logoUrl?: string;
    fleet: { model: string; size: PlaneSize }[];
    isCargoOnly?: boolean;
}

export interface ContractOption {
    id: string;
    type: ContractType;
    name: string;
    description: string;
    cost: number;
    durationDays: number; // duration in game days
    reputationRequired: number;
    basePricePerLiter?: number;
    dailyReputationBonus?: number;
    airlineId?: string;
    penalty: number;
    pickupRatePerPackage?: number;
}

export interface ActiveContract extends ContractOption {
    expiryTime: number; // timestamp
    pricePerLiter?: number;
    satisfaction: number;
    renewalOffered: boolean;
}

export enum VehicleType {
    Catering = 'Catering',
    Fuel = 'Fuel',
    Baggage = 'Baggage',
    Stairs = 'Stairs',
    CargoLoader = 'Cargo Loader',
    CargoTransporter = 'Cargo Transporter',
    FollowMe = 'Follow Me',
    Ambulance = 'Ambulance',
    FireTruck = 'Fire Truck',
    Snowplow = 'Snowplow',
    Forklift = 'Forklift',
    Pushback = 'Pushback', // New vehicle
    Deicing = 'Deicing',   // New vehicle
}

export interface Vehicle {
    id: string;
    type: VehicleType;
    isBusy: boolean;
    flightId: string | null;
    health: number;
}

export interface ParkingLot {
    level: number;
    capacity: number;
    dailyFee: number;
}

export interface FuelDelivery {
    amount: number;
    arrivalTime: number;
}

export interface FuelStorage {
    level: number;
    capacity: number;
}

export interface CargoPackage {
    id: string;
    flightId: string;
    value: number;
}

export interface CargoWarehouse {
    level: number;
    capacity: number;
    packages: CargoPackage[];
}

export interface LogisticsTruck {
    id: string;
    companyName: string;
    removeAtTime: number;
}

export enum EmployeeType {
    AirTrafficController = 'Air Traffic Controller',
    WarehouseOperative = 'Warehouse Operative',
    MarketingSpecialist = 'Marketing Specialist',
    CheckInAgent = 'Check-in Agent',
    BaggageHandler = 'Baggage Handler',
    MaintenanceTechnician = 'Maintenance Technician',
    SecurityGuard = 'Security Guard',
    PassengerServiceAgent = 'Passenger Service Agent',
    Logistician = 'Logistician',
    Administrator = 'Administrator',
    HRManager = 'HR Manager',
}

export type Personnel = Record<EmployeeType, number>;

export interface CheckInDesk {
    level: number;
    capacityPerAgent: number;
}

export interface SecurityLane {
    level: number;
    capacity: number;
}

export enum AmenityType {
    Retail = 'Retail Shops',
    FoodCourt = 'Food Court',
}

export interface Amenity {
    id: string;
    type: AmenityType;
    level: number;
}

export interface FlightRouteProposal {
  id: string;
  airline: Airline;
  remoteCity: string;
  planeModel: string;
  planeSize: PlaneSize;
  isCargo: boolean;
  popularity: number;
  contractId: string;
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  arrivalTime: { hour: number; minute: number };
  turnaroundHours: number;
}

export interface ActiveFlightRoute extends FlightRouteProposal {
  lastFlightGenerationTime: number; // Timestamp of the last time flights were generated for this route
}


export interface GameState {
  time: number;
  money: number;
  reputation: number;
  weather: Weather;
  flights: Flight[];
  gates: Gate[];
  cargoBays: CargoBay[];
  availableAirlines: Airline[];
  activeContracts: ActiveContract[];
  notifications: GameNotification[];
  vehicles: Vehicle[];
  parkingLot: ParkingLot;
  fuelStorage: FuelStorage;
  fuel: number;
  fuelDeliveries: FuelDelivery[];
  lastDayProcessed: number;
  cargoWarehouse: CargoWarehouse;
  lastLogisticsPickupTime: number;
  runwaySnowDepth: number;
  isRunwayBlocked: boolean;
  runwayBlockedUntil: number;
  snowplowClearingUntil: number;
  logisticsTrucks: LogisticsTruck[];
  personnel: Personnel;
  isHrAutomationEnabled: boolean;
  lastSalaryPaymentTime: number;
  passengerSatisfaction: number;
  checkInDesks: CheckInDesk;
  securityLanes: SecurityLane;
  marketFuelPrice: number;
  flightRouteProposals: FlightRouteProposal[];
  activeFlightRoutes: ActiveFlightRoute[];
  checkInQueue: number; // New
  securityQueue: number; // New
  amenities: Amenity[]; // New
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  time: number;
}

// Reducer Actions
export type GameAction =
  | { type: 'TICK'; payload: { newTime: number } }
  | { type: 'UPDATE_WEATHER'; payload: Weather }
  | { type: 'ADD_FLIGHT'; payload: Flight }
  | { type: 'ADD_FLIGHTS'; payload: Flight[] }
  | { type: 'UPDATE_FLIGHT'; payload: Partial<Flight> & { id: string } }
  | { type: 'REMOVE_FLIGHT'; payload: { id: string } }
  | { type: 'SIGN_CONTRACT'; payload: ActiveContract }
  | { type: 'RENEW_CONTRACT'; payload: { contractId: string } }
  | { type: 'TERMINATE_CONTRACT'; payload: { contractId: string } }
  | { type: 'ADD_ROUTE_PROPOSAL'; payload: FlightRouteProposal }
  | { type: 'ACCEPT_ROUTE_PROPOSAL'; payload: { proposalId: string } }
  | { type: 'REJECT_ROUTE_PROPOSAL'; payload: { proposalId: string } }
  | { type: 'ASSIGN_GATE'; payload: { flightId: string; gateId: string } }
  | { type: 'ASSIGN_CARGO_BAY'; payload: { flightId: string; bayId: string } }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<GameNotification, 'id' | 'time'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'ADJUST_MONEY'; payload: number }
  | { type: 'PURCHASE_VEHICLE'; payload: { type: VehicleType; cost: number } }
  | { type: 'SELL_VEHICLE'; payload: { vehicleId: string } }
  | { type: 'REPAIR_VEHICLE'; payload: { vehicleId: string } }
  | { type: 'EXPAND_INFRASTRUCTURE'; payload: { type: 'gate' | 'cargo_bay'; cost: number } }
  | { type: 'UPGRADE_PARKING_LOT' }
  | { type: 'SET_PARKING_FEE'; payload: number }
  | { type: 'UPGRADE_FUEL_STORAGE' }
  | { type: 'ORDER_FUEL_DELIVERY'; payload: FuelDelivery & { cost: number } }
  | { type: 'UPGRADE_CARGO_WAREHOUSE' }
  | { type: 'TRIGGER_EMERGENCY'; payload: { flightId: string } }
  | { type: 'CLEAR_RUNWAY' }
  | { type: 'HIRE_EMPLOYEE'; payload: { type: EmployeeType } }
  | { type: 'FIRE_EMPLOYEE'; payload: { type: EmployeeType } }
  | { type: 'TOGGLE_HR_AUTOMATION' }
  | { type: 'UPGRADE_CHECK_IN' }
  | { type: 'UPGRADE_SECURITY' }
  | { type: 'BUILD_AMENITY'; payload: { type: AmenityType; cost: number } } // New
  | { type: 'UPGRADE_AMENITY'; payload: { amenityId: string; cost: number } }; // New
