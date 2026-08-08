from decimal import Decimal
from sqlalchemy.orm import Session
from ..models.user import User, UserRole, KYCStatus
from ..models.vehicle import Vehicle, VehicleStatus, VerificationStatus
from ..models.token import VehicleToken
from ..core.security import get_password_hash
from .rarity import calculate_rarity_score
import logging

logger = logging.getLogger(__name__)

VEHICLES_SEED_DATA = [
    {
        "make": "McLaren",
        "model": "F1",
        "year": 1994,
        "description": "The McLaren F1 is widely considered the greatest road car ever built. Engineered by Gordon Murray with a BMW S70/2 V12 engine producing 627 hp, it was the world's fastest production car for over a decade. Every detail was engineered without compromise.",
        "total_valuation": Decimal("20000000.00"),
        "token_symbol": "MCLF1",
        "production_units": 106,
        "custom_features": {
            "engine": "BMW S70/2 6.1L V12, 627 hp",
            "top_speed": "391 km/h (243 mph) — World Record 1994",
            "weight": "1,138 kg — Gold-foil engine bay insulation",
            "seating": "Central driver seat with 2 passenger seats",
            "gearbox": "6-speed manual transaxle",
            "chassis": "Full carbon fiber monocoque — first production car",
            "doors": "Dihedral (butterfly) doors"
        },
        "rarity_factors": ["Only 106 road cars ever built", "Central driver position", "Gold-lined engine bay", "Naturally aspirated V12"],
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "1988", "event": "Project initiated by Gordon Murray at McLaren Cars"},
            {"date": "1992", "event": "XP1 prototype completed — world debut"},
            {"date": "1994", "event": "Production begins — 106 road cars total"},
            {"date": "1994-03-31", "event": "Sets world record: 391 km/h at Volkswagen test track"},
            {"date": "1998", "event": "Final road car delivered — production ends"},
            {"date": "2022", "event": "Chassis #29 sold at Gooding & Company for $20.5M USD"}
        ]
    },
    {
        "make": "Ferrari",
        "model": "LaFerrari",
        "year": 2015,
        "description": "Ferrari's first series production hybrid vehicle and the company's most powerful road car. The LaFerrari represents the pinnacle of Ferrari's road car program, combining a V12 petrol engine with an electric HY-KERS system derived directly from Formula 1.",
        "total_valuation": Decimal("4500000.00"),
        "token_symbol": "FELAFF",
        "production_units": 499,
        "custom_features": {
            "engine": "6.3L F140 V12 + HY-KERS electric, 963 hp combined",
            "acceleration": "0-100 km/h in 2.9s",
            "weight": "1,255 kg",
            "hybrid_system": "KERS from F1 — 161 hp electric motor",
            "top_speed": "350+ km/h",
            "aero": "Active aerodynamics with movable underbody flaps",
            "transmission": "7-speed dual-clutch F1 DCT"
        },
        "rarity_factors": ["499 units only — sold out before production", "Last naturally-aspirated Ferrari flagship", "Direct F1 technology transfer", "Buyer selection required Ferrari approval"],
        "images": [
            "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200",
            "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200"
        ],
        "passport_timeline": [
            {"date": "2013", "event": "World debut at Geneva Motor Show"},
            {"date": "2013", "event": "All 499 units pre-sold immediately"},
            {"date": "2013-2016", "event": "Production run at Maranello"},
            {"date": "2016", "event": "Aperta (open-top) variant announced — 210 units"},
            {"date": "2023", "event": "Market values reach $4M-$9.5M range"},
            {"date": "2024", "event": "Incorporated into VaultWheel marketplace"}
        ]
    },
    {
        "make": "Lamborghini",
        "model": "Sesto Elemento",
        "year": 2012,
        "description": "The Sesto Elemento (Italian for 'Sixth Element', i.e. Carbon) is Lamborghini's most extreme road-legal car. Built almost entirely from carbon fiber, it achieved a power-to-weight ratio of 1.75 hp/kg — one of the highest ever for a road car.",
        "total_valuation": Decimal("3000000.00"),
        "token_symbol": "LBSEST",
        "production_units": 20,
        "custom_features": {
            "engine": "5.2L V10 Naturally Aspirated, 570 hp",
            "weight": "999 kg — full carbon fiber body",
            "acceleration": "0-100 km/h in 2.5s",
            "power_to_weight": "1.75 hp/kg",
            "chassis": "Forged composite monocoque",
            "wheels": "Full carbon fiber forged composite wheels",
            "production": "Only 20 units ever built"
        },
        "rarity_factors": ["Only 20 units in existence", "Entirely carbon fiber construction", "Track-focused road legal", "999kg — lightest Lamborghini ever"],
        "images": [
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "2010", "event": "Concept debuted at Paris Motor Show"},
            {"date": "2011", "event": "Production decision announced — 20 units"},
            {"date": "2012", "event": "Delivery to 20 selected customers worldwide"},
            {"date": "2014", "event": "All 20 units delivered"},
            {"date": "2024", "event": "Current market value: $2.5M–$4M+"}
        ]
    },
    {
        "make": "Ferrari",
        "model": "Enzo",
        "year": 2003,
        "description": "Named after the company's founder, the Ferrari Enzo was the pinnacle of Ferrari's road car program at the time. It used technology derived directly from Ferrari's F1 racing programme of the 2000s.",
        "total_valuation": Decimal("4000000.00"),
        "token_symbol": "FERENZ",
        "production_units": 400,
        "custom_features": {
            "engine": "6.0L Tipo F140 V12, 660 hp",
            "acceleration": "0-100 km/h in 3.1s",
            "top_speed": "355 km/h",
            "weight": "1,365 kg",
            "aerodynamics": "Active F1-derived aerodynamics",
            "brakes": "Brembo carbon-ceramic — first Ferrari production car",
            "transmission": "6-speed sequential paddle-shift gearbox"
        },
        "rarity_factors": ["Named after Enzo Ferrari himself", "400 units — last 40 donated to earthquake relief", "First Ferrari with carbon-ceramic brakes", "F1-derived active aero"],
        "images": [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200"
        ],
        "passport_timeline": [
            {"date": "2002", "event": "World debut at Paris Motor Show"},
            {"date": "2002-2004", "event": "399 units sold; last 40 donated to 2004 earthquake relief"},
            {"date": "2013", "event": "XX Programme track variant developed"},
            {"date": "2020", "event": "Auction records: $3.3M+ at Sotheby's"}
        ]
    },
    {
        "make": "Pagani",
        "model": "Huayra BC",
        "year": 2016,
        "description": "The Pagani Huayra BC (named after Benny Caiola, Pagani's first customer) is the track-focused variant of the Huayra. It is considered one of the most extreme and beautiful road cars ever created.",
        "total_valuation": Decimal("4200000.00"),
        "token_symbol": "PGHBC",
        "production_units": 20,
        "custom_features": {
            "engine": "Mercedes-AMG M158 6.0L V12 BiTurbo, 789 hp",
            "weight": "1,218 kg",
            "torque": "1,100 Nm",
            "active_aero": "4 aerodynamic flaps + underbody venturi tunnels",
            "materials": "Carbotanium (Carbon + Titanium) body panels",
            "exhaust": "Titanium exhaust with active valves",
            "production": "Only 20 units worldwide"
        },
        "rarity_factors": ["Only 20 units", "Named after Pagani's first customer", "Carbotanium construction", "Active 4-flap aero system"],
        "images": [
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "2016", "event": "World debut at Geneva Motor Show"},
            {"date": "2016", "event": "All 20 units pre-sold at $2.5M each"},
            {"date": "2017-2018", "event": "Deliveries worldwide"},
            {"date": "2023", "event": "Values exceed $4M at auction"}
        ]
    },
    {
        "make": "Bugatti",
        "model": "Veyron 16.4 Super Sport",
        "year": 2010,
        "description": "The Bugatti Veyron Super Sport was the world's fastest production car at launch, reaching 431.072 km/h. It features a quad-turbocharged 8.0L W16 engine producing 1,200 hp.",
        "total_valuation": Decimal("3000000.00"),
        "token_symbol": "BUGVSS",
        "production_units": 30,
        "custom_features": {
            "engine": "8.0L W16 Quad-Turbo, 1,200 hp",
            "top_speed": "431.072 km/h — Guinness World Record",
            "acceleration": "0-100 km/h in 2.5s, 0-300 in 14.6s",
            "torque": "1,500 Nm",
            "weight": "1,838 kg",
            "gearbox": "7-speed DSG",
            "fuel_consumption": "600L/100km at top speed"
        },
        "rarity_factors": ["30 Super Sport units", "Guinness Record holder 2010", "Highest production car power output of its era", "Exposed carbon fiber body"],
        "images": [
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "2010", "event": "Debut at Pebble Beach Concours d'Elegance"},
            {"date": "2010-07-04", "event": "Guinness Record: 431.072 km/h at Ehra-Lessien"},
            {"date": "2011", "event": "30 units delivered globally"},
            {"date": "2012", "event": "Production ends"}
        ]
    },
    {
        "make": "Koenigsegg",
        "model": "Agera RS",
        "year": 2017,
        "description": "The Koenigsegg Agera RS broke multiple world records in 2017, achieving a two-way average speed of 444.6 km/h on a Nevada highway. Only 25 units were ever built.",
        "total_valuation": Decimal("4000000.00"),
        "token_symbol": "KGARS",
        "production_units": 25,
        "custom_features": {
            "engine": "5.0L twin-turbo V8, 1,341 hp on E85",
            "top_speed": "444.6 km/h — World Record 2017",
            "acceleration": "0-400-0 km/h in 36.44 seconds — World Record",
            "weight": "1,395 kg",
            "carbon_fiber": "Full carbon fiber body, wheels, and interior",
            "aerodynamics": "Active rear wing + front splitter",
            "production": "Only 25 units worldwide"
        },
        "rarity_factors": ["25 units only", "Multiple Guinness Records holder 2017", "0-400-0 km/h world record", "Custom spec for each customer"],
        "images": [
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200"
        ],
        "passport_timeline": [
            {"date": "2015", "event": "Agera RS announced at Geneva"},
            {"date": "2017-10-01", "event": "0-400-0 km/h world record: 36.44s"},
            {"date": "2017-11-04", "event": "Two-way average speed record: 444.6 km/h in Nevada"},
            {"date": "2018", "event": "Final unit delivered — production ends"}
        ]
    },
    {
        "make": "Lexus",
        "model": "LFA",
        "year": 2012,
        "description": "The Lexus LFA is widely regarded as one of the greatest driver's cars ever made. Developed over 10 years with a Yamaha-designed 4.8L V10 that revs to 9,000 rpm and produces an iconic sound unlike any other car.",
        "total_valuation": Decimal("950000.00"),
        "token_symbol": "LXLFA",
        "production_units": 500,
        "custom_features": {
            "engine": "4.8L 1LR-GUE V10 by Yamaha, 553 hp @ 8,700 rpm",
            "redline": "9,000 rpm — analog tachometer can't keep up digitally",
            "carbon_fiber": "65% carbon fiber reinforced polymer body",
            "weight": "1,480 kg",
            "exhaust": "Titanium exhaust system",
            "gearbox": "6-speed automated sequential (ASG)",
            "sound": "Sound engineered with Yamaha — considered best V10 sound ever"
        },
        "rarity_factors": ["500 units globally — 10 year development", "Yamaha-developed V10 — unrepeatable", "65% carbon fiber body", "Values tripled in 10 years"],
        "images": [
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "2000", "event": "Development begins — 10-year project"},
            {"date": "2009", "event": "World debut at Tokyo Motor Show"},
            {"date": "2010-2012", "event": "500 units produced in Motomachi, Japan"},
            {"date": "2012", "event": "Nürburgring Package variant: 50 units with Akrapovic exhaust"},
            {"date": "2024", "event": "Market values: $900K–$1.6M+ for Nürburgring spec"}
        ]
    },
    {
        "make": "Porsche",
        "model": "Carrera GT",
        "year": 2004,
        "description": "The Porsche Carrera GT is widely regarded as the last true analogue supercar. Its naturally aspirated 5.7L V10 engine and lack of electronic driver aids make it one of the most demanding and rewarding cars ever built.",
        "total_valuation": Decimal("1500000.00"),
        "token_symbol": "PRCGT",
        "production_units": 1270,
        "custom_features": {
            "engine": "5.7L V10 Naturally Aspirated, 612 hp",
            "redline": "8,400 rpm",
            "weight": "1,380 kg",
            "ceramic_clutch": "Carbon-ceramic clutch — notoriously difficult",
            "chassis": "Full carbon fiber monocoque",
            "gearbox": "6-speed manual — wooden shift knob",
            "top_speed": "330 km/h"
        },
        "rarity_factors": ["Last analogue Porsche supercar", "No electronic driver aids", "Carbon ceramic clutch unique feel", "Values tripled since production"],
        "images": [
            "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200"
        ],
        "passport_timeline": [
            {"date": "2000", "event": "Le Mans prototype LMP2000 project origins"},
            {"date": "2003", "event": "World debut at Geneva Motor Show"},
            {"date": "2004-2006", "event": "1,270 units produced in Leipzig"},
            {"date": "2023", "event": "Average auction price: $1.2M–$2M+"}
        ]
    },
    {
        "make": "Mitsubishi",
        "model": "Pajero Signature Edition",
        "year": 2020,
        "description": "The Mitsubishi Pajero Signature Edition is the final chapter of the legendary Pajero nameplate — a limited farewell edition produced exclusively for the UAE market. Only 500 units were built, each individually numbered, with exclusive gold badging, star-light roof headliner, and premium sport package.",
        "total_valuation": Decimal("90000.00"),
        "token_symbol": "MTPAJ",
        "production_units": 500,
        "custom_features": {
            "engine": "3.8L V6, 247 hp — 4WD Super-Select system",
            "roof_headliner": "Star-Light LED headliner — fiber optic starfield",
            "badges": "Gold Mitsubishi logo and edition badges",
            "exterior": "Piano Black grille, contrasting roof, 18\" sport alloys",
            "interior": "Black leather with white stitching + carbon fiber trim",
            "numbering": "Individually numbered unit (e.g. 173/500)",
            "dealer": "Al Habtoor Motors UAE — Final Edition"
        },
        "rarity_factors": ["500 units UAE only — farewell edition", "Individually numbered units", "Last ever Pajero produced", "Star-Light fiber optic roof"],
        "images": [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        ],
        "passport_timeline": [
            {"date": "2020-01", "event": "Al Habtoor Motors announces Signature Edition — 500 units"},
            {"date": "2020-03", "event": "Official launch in Dubai — units numbered sequentially"},
            {"date": "2020-06", "event": "All 500 units sold within UAE market"},
            {"date": "2021", "event": "Mitsubishi officially discontinues Pajero globally"},
            {"date": "2024", "event": "Incorporated into VaultWheel as the gateway collectible"}
        ]
    }
]

def seed_database(db: Session):
    """Seeds the database with 10 collectible vehicles if empty."""
    existing_count = db.query(Vehicle).count()
    if existing_count > 0:
        logger.info(f"Database already has {existing_count} vehicles. Skipping seed.")
        return
    
    logger.info("Seeding database with 10 collectible vehicles...")
    
    # Create admin user
    admin = db.query(User).filter(User.email == "admin@vaultwheel.io").first()
    if not admin:
        admin = User(
            email="admin@vaultwheel.io",
            full_name="VaultWheel Admin",
            password_hash=get_password_hash("Admin2024!"),
            role=UserRole.ADMIN,
            kyc_status=KYCStatus.APPROVED,
            fiat_balance=Decimal("99999999.99")
        )
        db.add(admin)
        db.flush()
    
    # Create demo buyer for judges
    demo_buyer = db.query(User).filter(User.email == "demo@vaultwheel.io").first()
    if not demo_buyer:
        demo_buyer = User(
            email="demo@vaultwheel.io",
            full_name="Demo Investor",
            password_hash=get_password_hash("Demo@2024"),
            role=UserRole.BUYER,
            kyc_status=KYCStatus.APPROVED,
            fiat_balance=Decimal("250000.00")
        )
        db.add(demo_buyer)
    
    # Create all 10 vehicles
    for i, vdata in enumerate(VEHICLES_SEED_DATA):
        rarity_score = calculate_rarity_score({
            "production_units": vdata["production_units"],
            "custom_features": vdata["custom_features"],
            "passport_data": {"timeline": vdata["passport_timeline"]},
            "total_valuation": float(vdata["total_valuation"])
        })
        
        vehicle = Vehicle(
            make=vdata["make"],
            model=vdata["model"],
            year=vdata["year"],
            description=vdata["description"],
            total_valuation=vdata["total_valuation"],
            custom_features=vdata["custom_features"],
            rarity_score=rarity_score,
            verification_status=VerificationStatus.APPROVED,
            status=VehicleStatus.ACTIVE,
            images=vdata["images"],
            passport_data={
                "production_units": vdata["production_units"],
                "rarity_factors": vdata["rarity_factors"],
                "timeline": vdata["passport_timeline"]
            },
            is_active=True
        )
        db.add(vehicle)
        db.flush()
        
        # Create token for this vehicle
        total_supply = 1000
        price_per_token = vdata["total_valuation"] / total_supply
        
        token = VehicleToken(
            vehicle_id=vehicle.id,
            total_supply=total_supply,
            available_supply=total_supply,
            price_per_token=price_per_token,
            token_symbol=vdata["token_symbol"],
            erc1155_token_id=i + 1  # ERC-1155 token ID 1-10
        )
        db.add(token)
    
    db.commit()
    logger.info("Database seeded successfully with 10 vehicles!")
