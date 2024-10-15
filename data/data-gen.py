import random

# Define the data for industries, disciplines, sizes, durations, and location types
industries = [
    "Business", "Design & Arts", "Engineering", "IT & Computer Science", "Law, Legal Studies & Justice",
    "Health", "Education", "Science", "Social Sciences & Communication", "Food & Hospitality", "Trades & Services"
]

disciplines = [
    "Economics", "Human Resources", "Management", "Accounting, Commerce & Finance", "Hospitality, Tourism & Retail",
    "Marketing, Advertising & Public Relations", "Animation, Visual Effects & Post Production", "Creative Arts",
    "Media Studies", "Fashion Design", "Film & TV", "Graphic Design & Visual Arts", "Journalism & Writing",
    "Music & Performing Arts", "Aerospace Engineering", "Software Engineering", "Automotive & Transport Engineering",
    "Biomedical Engineering", "Civil Engineering & Construction", "Mechanical Engineering", "Mechatronic Engineering",
    "Electrical Engineering", "Chemical Engineering", "Industrial Engineering", "Robotics Engineering",
    "Environmental Engineering", "Marine Engineering", "Manufacturing Engineering", "Mining Engineering",
    "Artificial Intelligence", "Computer Graphics & Animations", "Computer Systems & Networks", "Cyber Security",
    "Data Science", "Design & User Experience", "Video Game Development", "Criminal Justice", "Corporate Law",
    "Law Enforcement", "Nursing", "Pharmacist", "Dentistry & Orthopediatrics", "Exercise & Sports Science",
    "Midwifery", "Occupational Therapy", "Paramedics", "Physiotherapy", "Psychology", "Primary Teaching", "Secondary Teaching",
    "Special Education", "Tertiary Education", "Astronomy", "Biochemistry", "Biology", "Chemistry", "Geology",
    "Genetics", "Food Science", "Forensic Science", "Environmental Science", "Physics", "Marine Science",
    "Veterinary Science", "Criminology", "International Studies", "Languages & Linguistics", "Literature", "Philosophy",
    "Social Work", "Politics", "Culinary Arts", "Hotel Management", "Carers", "Carpentry", "Electrician", "Plumping",
    "Flooring, Plastering & Tiling", "Heating, Ventilation & Cooling", "Bricklaying & Stonemasonry", "Surveying"
]

keywords = {
    "Economics": ["macroeconomics", "microeconomics", "fiscal policy", "monetary policy", "inflation", "economic growth", "GDP", "supply and demand", "international trade", "exchange rates"],
    "Human Resources": ["recruitment", "talent acquisition", "employee relations", "compensation", "benefits", "HR policies", "workforce planning", "onboarding", "performance management", "diversity and inclusion"],
    "Management": ["leadership", "strategic planning", "operations management", "project management", "change management", "business strategy", "organizational behavior", "decision making", "team management", "performance evaluation"],
    "Accounting, Commerce & Finance": ["financial accounting", "auditing", "taxation", "corporate finance", "cost accounting", "budgeting", "investment analysis", "cash flow", "financial statements", "balance sheets"],
    "Hospitality, Tourism & Retail": ["customer service", "event planning", "hotel management", "tourism marketing", "food and beverage", "lodging", "retail sales", "guest relations", "inventory management", "travel industry"],
    "Marketing, Advertising & Public Relations": ["digital marketing", "branding", "SEO", "social media marketing", "advertising campaigns", "public relations", "content marketing", "market research", "email marketing", "promotion"],
    "Animation, Visual Effects & Post Production": ["3D modeling", "animation", "visual effects", "motion graphics", "post-production", "CGI", "rendering", "storyboarding", "special effects", "character animation"],
    "Creative Arts": ["fine arts", "painting", "sculpture", "mixed media", "performance art", "installation art", "visual arts", "art history", "contemporary art", "digital arts"],
    "Media Studies": ["mass media", "broadcasting", "journalism", "film studies", "media theory", "communication", "television", "radio", "media literacy", "news production"],
    "Fashion Design": ["fashion illustration", "textile design", "garment construction", "pattern making", "couture", "fashion merchandising", "clothing design", "trend analysis", "fashion marketing", "fashion shows"],
    "Film & TV": ["screenwriting", "cinematography", "film production", "directing", "editing", "lighting design", "documentary filmmaking", "storyboarding", "film theory", "TV production"],
    "Graphic Design & Visual Arts": ["typography", "branding", "web design", "logo design", "print design", "layout", "digital illustration", "user interface design", "motion design", "graphic software"],
    "Journalism & Writing": ["news writing", "editorial", "investigative journalism", "feature writing", "creative writing", "copywriting", "broadcast journalism", "interviewing", "media ethics", "storytelling"],
    "Music & Performing Arts": ["music theory", "composition", "stage performance", "theater", "musical instruments", "acting", "choreography", "vocal performance", "musical theater", "music production"],
    "Aerospace Engineering": ["aerodynamics", "spacecraft design", "propulsion systems", "orbital mechanics", "flight dynamics", "aviation technology", "navigation systems", "aerospace materials", "rocket engines", "unmanned aerial vehicles"],
    "Software Engineering": ["software development", "programming languages", "algorithms", "data structures", "software architecture", "agile development", "version control", "web development", "mobile apps", "cloud computing"],
    "Automotive & Transport Engineering": ["vehicle dynamics", "engine design", "electric vehicles", "autonomous vehicles", "transmission systems", "aerodynamics", "fuel efficiency", "automotive safety", "transport logistics", "traffic management"],
    "Biomedical Engineering": ["biomaterials", "medical devices", "tissue engineering", "prosthetics", "biomechanics", "medical imaging", "genetic engineering", "biosensors", "healthcare technology", "rehabilitation engineering"],
    "Civil Engineering & Construction": ["structural analysis", "construction management", "building design", "transportation engineering", "urban planning", "environmental engineering", "concrete technology", "bridge design", "hydrology", "geotechnical engineering"],
    "Mechanical Engineering": ["thermodynamics", "fluid mechanics", "mechanical design", "energy systems", "robotics", "HVAC systems", "manufacturing processes", "mechatronics", "machine design", "automation"],
    "Mechatronic Engineering": ["control systems", "robotics", "automation", "electronics", "sensors", "microcontrollers", "actuators", "mechanical systems", "embedded systems", "system integration"],
    "Electrical Engineering": ["circuit design", "power systems", "electromagnetism", "signal processing", "semiconductors", "microelectronics", "digital circuits", "electrical machines", "telecommunications", "renewable energy systems"],
    "Chemical Engineering": ["process engineering", "chemical reactions", "thermodynamics", "material science", "polymer engineering", "catalysis", "petrochemicals", "biotechnology", "waste management", "process control"],
    "Industrial Engineering": ["manufacturing systems", "operations research", "supply chain management", "quality control", "lean manufacturing", "process optimization", "ergonomics", "production planning", "logistics", "factory automation"],
    "Robotics Engineering": ["robot design", "automation", "robotic arms", "artificial intelligence", "sensor technology", "machine learning", "control systems", "human-robot interaction", "actuators", "mobile robotics"],
    "Environmental Engineering": ["waste management", "water treatment", "air quality control", "sustainability", "pollution control", "environmental impact assessment", "renewable energy", "climate change", "ecosystem restoration", "environmental law"],
    "Marine Engineering": ["ship design", "marine propulsion", "offshore engineering", "hydrodynamics", "naval architecture", "submersibles", "maritime safety", "ocean engineering", "underwater vehicles", "marine systems"],
    "Manufacturing Engineering": ["manufacturing processes", "automation", "production planning", "lean manufacturing", "supply chain management", "CNC machining", "quality control", "industrial design", "factory automation", "materials science"],
    "Mining Engineering": ["mineral extraction", "mine planning", "geotechnical engineering", "rock mechanics", "mineral processing", "drilling technology", "surface mining", "underground mining", "mine safety", "resource management"],
    "Artificial Intelligence": ["machine learning", "neural networks", "deep learning", "natural language processing", "computer vision", "AI ethics", "reinforcement learning", "robotics", "data mining", "predictive analytics"],
    "Computer Graphics & Animations": ["3D modeling", "rendering", "animation", "visual effects", "motion capture", "graphic design", "texture mapping", "lighting design", "video game design", "interactive media"],
    "Computer Systems & Networks": ["network security", "computer architecture", "distributed systems", "cloud computing", "virtualization", "internet protocols", "data communication", "firewalls", "wireless networks", "LAN/WAN"],
    "Cyber Security": ["encryption", "network security", "penetration testing", "firewalls", "incident response", "malware analysis", "data protection", "cyber threat intelligence", "digital forensics", "identity management"],
    "Data Science": ["data analysis", "big data", "machine learning", "data mining", "statistical modeling", "data visualization", "predictive analytics", "data wrangling", "artificial intelligence", "business intelligence"],
    "Design & User Experience": ["user interface design", "user experience", "interaction design", "wireframing", "prototyping", "usability testing", "UI/UX design", "responsive design", "visual design", "user research"],
    "Video Game Development": ["game programming", "game design", "3D modeling", "level design", "game engines", "multiplayer games", "game physics", "artificial intelligence", "sound design", "game production"],
    "Criminal Justice": ["criminology", "law enforcement", "criminal law", "forensic science", "policing", "corrections", "crime prevention", "criminal investigations", "court systems", "juvenile justice"],
    "Corporate Law": ["corporate governance", "contract law", "mergers and acquisitions", "intellectual property", "employment law", "securities regulation", "compliance", "corporate finance", "litigation", "commercial transactions"],
    "Law Enforcement": ["policing", "investigations", "patrol operations", "criminal investigations", "community policing", "traffic enforcement", "forensic analysis", "crime prevention", "public safety", "law enforcement tactics"],
    "Nursing": ["patient care", "clinical practice", "nursing ethics", "public health", "pediatrics", "geriatric care", "critical care", "mental health nursing", "emergency care", "nursing management"],
    "Pharmacist": ["pharmacy practice", "drug dispensing", "pharmacology", "clinical pharmacy", "medication management", "pharmaceutical science", "prescription drugs", "drug interactions", "patient counseling", "pharmacy ethics"],
    "Dentistry & Orthopediatrics": ["dental care", "orthodontics", "oral surgery", "prosthodontics", "periodontics", "endodontics", "dental hygiene", "oral health", "pediatric dentistry", "implantology"],
    "Exercise & Sports Science": ["kinesiology", "exercise physiology", "sports nutrition", "strength and conditioning", "biomechanics", "fitness training", "sports psychology", "rehabilitation", "exercise testing", "sports medicine"],
    "Midwifery": ["childbirth", "prenatal care", "postnatal care", "neonatal care", "obstetrics", "maternal health", "family planning", "birthing techniques", "midwifery education", "pregnancy care"],
    "Occupational Therapy": ["occupational therapy", "rehabilitation", "workplace ergonomics", "assistive technology", "physical rehabilitation", "mental health therapy", "disability management", "patient care", "therapeutic techniques", "recovery plans"],
    "Paramedics": ["emergency medical care", "trauma care", "ambulance services", "emergency response", "CPR", "advanced life support", "patient transport", "pre-hospital care", "paramedic training", "first aid"],
    "Physiotherapy": ["physical therapy", "rehabilitation", "musculoskeletal therapy", "exercise therapy", "manual therapy", "sports injuries", "pain management", "movement disorders", "neurological physiotherapy", "cardiopulmonary therapy"],
    "Psychology": ["clinical psychology", "cognitive psychology", "behavioral therapy", "developmental psychology", "counseling psychology", "forensic psychology", "neuropsychology", "psychotherapy", "child psychology", "social psychology"],
    "Primary Teaching": ["elementary education", "curriculum development", "classroom management", "teaching strategies", "early childhood education", "educational psychology", "reading and literacy", "child development", "lesson planning", "student assessment"],
    "Secondary Teaching": ["high school education", "subject-specific teaching", "adolescent development", "lesson planning", "classroom management", "curriculum design", "student engagement", "educational psychology", "student assessment", "behavioral management"],
    "Special Education": ["inclusive education", "learning disabilities", "behavioral interventions", "speech therapy", "physical disabilities", "individualized education plans", "assistive technology", "autism spectrum disorders", "developmental delays", "sensory processing disorders"],
    "Tertiary Education": ["university teaching", "curriculum development", "higher education policy", "educational research", "adult education", "learning technologies", "student engagement", "academic writing", "teaching methodologies", "postgraduate education"],
    "Astronomy": ["astrophysics", "celestial mechanics", "telescope design", "stellar evolution", "planetary science", "cosmology", "space exploration", "black holes", "galaxies", "space missions"],
    "Biochemistry": ["molecular biology", "protein synthesis", "genetic engineering", "metabolism", "enzyme kinetics", "biochemical pathways", "cell biology", "DNA replication", "biotechnology", "biomolecules"],
    "Biology": ["ecology", "genetics", "evolutionary biology", "cell biology", "marine biology", "zoology", "botany", "environmental biology", "microbiology", "biological diversity"],
    "Chemistry": ["organic chemistry", "inorganic chemistry", "physical chemistry", "analytical chemistry", "chemical reactions", "thermodynamics", "molecular structure", "polymer chemistry", "biochemistry", "nanotechnology"],
    "Geology": ["earth science", "mineralogy", "paleontology", "geophysics", "geochemistry", "seismology", "volcanology", "plate tectonics", "fossil analysis", "earth materials"],
    "Genetics": ["genomics", "DNA sequencing", "gene therapy", "genetic engineering", "molecular genetics", "heredity", "population genetics", "genetic mutations", "genetic diseases", "epigenetics"],
    "Food Science": ["nutrition", "food safety", "food processing", "food chemistry", "food microbiology", "food technology", "food quality", "sensory analysis", "dietary supplements", "functional foods"],
    "Forensic Science": ["forensic analysis", "crime scene investigation", "DNA profiling", "toxicology", "fingerprint analysis", "ballistics", "forensic anthropology", "trace evidence", "forensic pathology", "forensic psychology"],
    "Environmental Science": ["ecology", "environmental policy", "climate change", "conservation", "sustainable development", "environmental impact assessment", "pollution control", "wildlife management", "natural resource management", "environmental ethics"],
    "Physics": ["quantum mechanics", "relativity", "thermodynamics", "optics", "nuclear physics", "electromagnetism", "classical mechanics", "particle physics", "astrophysics", "condensed matter physics"],
    "Marine Science": ["oceanography", "marine biology", "coastal management", "marine ecosystems", "marine geology", "ocean currents", "marine pollution", "aquaculture", "marine conservation", "deep-sea exploration"],
    "Veterinary Science": ["animal health", "veterinary medicine", "veterinary surgery", "animal behavior", "zoonotic diseases", "wildlife care", "equine medicine", "veterinary pharmacology", "animal nutrition", "veterinary pathology"],
    "Criminology": ["crime analysis", "victimology", "criminal profiling", "juvenile delinquency", "white-collar crime", "organized crime", "penology", "restorative justice", "forensic psychology", "criminological theory"],
    "International Studies": ["global politics", "international relations", "foreign policy", "globalization", "diplomacy", "international law", "international trade", "geopolitics", "human rights", "international conflict"],
    "Languages & Linguistics": ["syntax", "phonetics", "semantics", "language acquisition", "sociolinguistics", "bilingualism", "language teaching", "morphology", "language processing", "translation"],
    "Literature": ["literary analysis", "comparative literature", "poetry", "novels", "prose", "dramatic literature", "literary theory", "creative writing", "literary criticism", "historical literature"],
    "Philosophy": ["ethics", "metaphysics", "epistemology", "logic", "aesthetics", "existentialism", "political philosophy", "moral philosophy", "philosophy of mind", "philosophy of science"],
    "Social Work": ["case management", "counseling", "child welfare", "mental health", "community development", "social policy", "advocacy", "substance abuse", "group therapy", "family therapy"],
    "Politics": ["political theory", "public policy", "international relations", "democracy", "elections", "political institutions", "comparative politics", "political ideologies", "government", "political economy"],
    "Culinary Arts": ["cooking", "gastronomy", "food preparation", "baking", "pastry arts", "nutrition", "menu planning", "food presentation", "culinary techniques", "food safety"],
    "Hotel Management": ["hospitality management", "guest relations", "hotel operations", "event planning", "food and beverage", "front desk operations", "housekeeping management", "revenue management", "customer service", "tourism"],
    "Carers": ["elderly care", "childcare", "caregiving", "disability support", "home care", "nursing care", "mental health support", "patient care", "respite care", "palliative care"],
    "Carpentry": ["woodworking", "joinery", "construction", "cabinet making", "framing", "roofing", "trim carpentry", "furniture making", "wood finishing", "blueprint reading"],
    "Electrician": ["electrical wiring", "circuit breakers", "electrical installations", "safety protocols", "electrical systems", "conduit installation", "electrical maintenance", "residential wiring", "industrial wiring", "electricity distribution"],
    "Plumping": ["pipe fitting", "water systems", "sanitation systems", "plumbing maintenance", "drainage systems", "gas fitting", "fixture installation", "piping materials", "sewage systems", "heating systems"],
    "Flooring, Plastering & Tiling": ["flooring installation", "plastering", "tiling", "drywall installation", "grouting", "ceramic tiles", "stone tiles", "wall finishes", "wooden flooring", "subfloor preparation"],
    "Heating, Ventilation & Cooling": ["HVAC systems", "heating systems", "air conditioning", "ventilation", "refrigeration", "ductwork", "thermal systems", "energy efficiency", "HVAC maintenance", "thermodynamics"],
    "Bricklaying & Stonemasonry": ["bricklaying", "masonry", "stonework", "construction", "chimney repair", "foundation work", "concrete masonry", "wall construction", "restoration masonry", "brick structures"],
    "Surveying": ["land surveying", "geospatial data", "topographic surveys", "construction surveys", "GPS surveying", "boundary surveying", "surveying equipment", "mapping", "geodetic surveying", "aerial surveys"]
}


sizes = ["Small", "Medium", "Large"]
durations = ["4 Weeks", "6 Weeks", "8 Weeks", "12 Weeks", "24 Weeks"]
location_types = ["Online (Remote)", "On-site", "Flexible"]

# Sentence templates with varied order of search criteria
sentence_templates = [
    "I'm looking for a [discipline] project with a focus on [keyword] that can be done [location_type] and lasts for [duration] in the [industry] sector.",
    "Are there any [size] projects in [discipline] with a focus on [keyword] that are available for [duration] and can be done [location_type] in [industry]?",
    "Can I find projects in [discipline] that are [location_type], focus on [keyword] in the [industry], and last [duration]?",
    "Show me [location_type] projects in [industry] that focus on [discipline] and [keyword] and are [size].",
    "What projects related to [discipline] in the [industry] sector with a focus on [keyword] are available for [duration] and can be done [location_type]?",
    "I need a [size] project for [discipline] students in [industry] with a focus on [keyword] that is [location_type] and lasts for [duration].",
    "Are there any [location_type] projects focusing on [discipline] and [keyword] in [industry] that last for [duration] and are [size]?",
    "Find me a [location_type] project related to [discipline] in [industry] that is [size], focuses on [keyword], and lasts for [duration]."

    # 1 search criterion
    "Show me projects in [industry].",
    "I need a [discipline] project.",
    "Are there any projects focused on [keyword]?",
    "Find me a [size] project.",
    "What projects can be done [location_type]?",
    "Show me projects that last for [duration].",

    # 2 search criteria
    "Are there [size] projects in [industry]?",
    "Can I see [discipline] projects available [location_type]?",
    "Find projects that focus on [keyword] and last for [duration].",
    "Show me projects in [industry] that are [location_type].",
    "Are there projects related to [discipline] that can be done [location_type]?",
    "I need [size] projects that last for [duration].",
    
    # 3 search criteria
    "What projects in [industry] are available for [duration] and focus on [keyword]?",
    "Show me [discipline] projects in [industry] that are [size].",
    "Are there any [location_type] projects focused on [discipline] in [industry]?",
    "Find me projects that focus on [keyword], are [size], and last for [duration].",
    "I want projects in [discipline] that can be done [location_type] and focus on [keyword].",
    "Show me [size] projects in [industry] that last for [duration].",

    # 4 search criteria
    "Are there any [size] projects in [industry] focused on [keyword] and that last [duration]?",
    "Find [location_type] projects in [discipline] that are [size] and last for [duration].",
    "Show me [industry] projects focused on [discipline] and [keyword] that are [size].",
    "I need [size] projects in [discipline] that can be done [location_type] and last for [duration].",
    "What [industry] projects are focused on [discipline], [keyword], and available [location_type]?",
    "Find projects that focus on [keyword], are [size], and last for [duration] in [discipline].",

    # 5 search criteria
    "Show me [discipline] projects in [industry] that focus on [keyword], are [location_type], and last [duration].",
    "Are there any [size] [location_type] projects in [discipline] that focus on [keyword] and last [duration]?",
    "Find me [industry] projects that focus on [discipline] and [keyword], are [size], and last for [duration].",
    "What [industry] projects are available in [discipline], that focus on [keyword], last for [duration], and are [location_type]?",
    "I want [location_type] projects in [industry] focused on [discipline] and [keyword] that are [size] and last [duration].",
    "Are there any [discipline] projects in [industry] that focus on [keyword], are [size], and last [duration]?",

    # 6 search criteria
    "Show me [location_type] [size] projects in [industry] focused on [discipline] and [keyword] that last [duration].",
    "Find [discipline] projects in [industry] that are [size], focus on [keyword], are [location_type], and last [duration].",
    "Are there any [size] [discipline] projects in [industry] that focus on [keyword], are [location_type], and last [duration]?",
    "Show me [location_type] [size] projects in [industry] that focus on [discipline], [keyword], and last [duration].",
    "Find me [industry] projects that focus on [discipline], are [size], focus on [keyword], and last for [duration] and are [location_type].",
    "Are there any [location_type] [industry] projects focused on [discipline] and [keyword], that are [size], and last [duration]?"

    # 1 search criterion
    "Show me the latest [industry] projects.",
    "I need to find a project in [discipline].",
    "What projects involve [keyword]?",
    "Are there any [size] projects available?",
    "What projects can I do [location_type]?",
    "Show me a project that lasts [duration].",

    # 2 search criteria
    "Are there [discipline] projects that focus on [keyword]?",
    "Find projects in [industry] that are [size].",
    "I need projects that can be done [location_type] and last for [duration].",
    "Can I see projects related to [discipline] that last [duration]?",
    "Show me [location_type] projects in the [industry] sector.",
    "What projects are related to [keyword] and last for [duration]?",

    # 3 search criteria
    "I want [size] projects in [discipline] that can be done [location_type].",
    "What [industry] projects are available [location_type] that focus on [keyword]?",
    "Show me [location_type] projects that last [duration] and focus on [discipline].",
    "Can I find [size] projects in [industry] that focus on [keyword]?",
    "Are there [discipline] projects in [industry] that last for [duration]?",
    "Show me projects related to [keyword] that can be done [location_type] and are [size].",

    # 4 search criteria
    "Are there any [size] projects in [discipline] that can be done [location_type] and last [duration]?",
    "Find [location_type] projects in [industry] that focus on [keyword] and last for [duration].",
    "What projects in [industry] are [size] and focus on [discipline] and [keyword]?",
    "Show me projects that last [duration] in [industry] and focus on [discipline].",
    "I need [size] projects that are [location_type], last [duration], and focus on [keyword].",
    "What projects in [discipline] that focus on [keyword] can be done [location_type] and are [size]?",

    # 5 search criteria
    "Are there [location_type] [size] projects in [discipline] that focus on [keyword] and last [duration]?",
    "Show me [industry] projects in [discipline] that are [size], focus on [keyword], and last [duration].",
    "Can I find [size] projects in [industry] that focus on [discipline] and are [location_type]?",
    "I need [location_type] projects in [discipline] that are [size] and last [duration] in [industry].",
    "What [discipline] projects focus on [keyword], are [size], last [duration], and can be done [location_type]?",
    "Find [size] projects in [industry] that focus on [discipline], [keyword], and can be done [location_type].",

    # 6 search criteria
    "Show me [location_type] projects in [industry] that are [size], focus on [discipline], involve [keyword], and last [duration].",
    "Are there [size] [discipline] projects in [industry] that focus on [keyword], can be done [location_type], and last [duration]?",
    "I want [location_type] projects in [discipline] that are [size], focus on [keyword], last [duration], and are in [industry].",
    "What [size] projects in [industry] focus on [discipline] and [keyword], last [duration], and are [location_type]?",
    "Find [location_type] projects in [discipline] that focus on [keyword], are [size], and last [duration] in [industry].",
    "Show me [industry] projects in [discipline] that are [size], focus on [keyword], are [location_type], and last [duration]."
]

import random

def generate_example():
    # Randomly choose values for industry, discipline, size, duration, and location_type
    industry = random.choice(industries)
    discipline = random.choice(disciplines)
    size = random.choice(sizes)
    duration = random.choice(durations)
    location_type = random.choice(location_types)

    # Get the keywords associated with the chosen discipline
    discipline_keywords = keywords.get(discipline, [""])
    keyword = random.choice(discipline_keywords)

    # Choose a random sentence template
    sentence_template = random.choice(sentence_templates)

    # Replace placeholders with the chosen values
    sentence = sentence_template.replace("[industry]", f"[{industry}](industry)")
    sentence = sentence.replace("[discipline]", f"[{discipline}](discipline)")
    sentence = sentence.replace("[size]", f"[{size}](size)")
    sentence = sentence.replace("[duration]", f"[{duration}](duration)")
    sentence = sentence.replace("[location_type]", f"[{location_type}](location_type)")
    sentence = sentence.replace("[keyword]", f"[{keyword}](keyword)")

    return sentence

# Generate 25000 examples
examples = [generate_example() for _ in range(6000)]

# Output the examples in NLU format to a custom file
file_name = "custom_nlu_examples_with_keywords.yml"
with open(file_name, "w") as file:
    file.write("version: '3.1'\n\n")
    file.write("nlu:\n")
    file.write("- intent: ask_project\n")
    file.write("  examples: |\n")
    for example in examples:
        file.write(f"    - {example}\n")

print(f"6000 examples generated and saved in {file_name}")
