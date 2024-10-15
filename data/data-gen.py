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
    "Midwifery", "Occupational", "Paramedics", "Physiotherapy", "Psychology", "Primary Teaching", "Secondary Teaching",
    "Special Education", "Tertiary Education", "Astronomy", "Biochemistry", "Biology", "Chemistry", "Geology",
    "Genetics", "Food Science", "Forensic Science", "Environmental Science", "Physics", "Marine Science",
    "Veterinary Science", "Criminology", "International Studies", "Languages & Linguistics", "Literature", "Philosophy",
    "Social Work", "Politics", "Culinary Arts", "Hotel Management", "Carers", "Carpentry", "Electrician", "Plumping",
    "Flooring, Plastering & Tiling", "Heating, Ventilation & Cooling", "Bricklaying & Stonemasonry", "Surveying"
]

sizes = ["Small", "Medium", "Large"]
durations = ["4 Weeks", "6 Weeks", "8 Weeks", "12 Weeks", "24 Weeks"]
location_types = ["Online (Remote)", "On-site", "Flexible"]

# Sentence templates with varied order of search criteria
sentence_templates = [
    "I'm looking for a [discipline] project that can be done [location_type] and lasts for [duration] in the [industry] sector.",
    "Are there any [size] projects in [discipline] that are available for [duration] and can be done [location_type] in [industry]?",
    "Can I find projects in [discipline] that are [location_type], focus on [industry], and last [duration]?",
    "Show me [location_type] projects in [industry] that focus on [discipline] and are [size].",
    "What projects related to [discipline] in the [industry] sector are available for [duration] and can be done [location_type]?",
    "I need a [size] project for [discipline] students in [industry] that is [location_type] and lasts for [duration].",
    "Are there any [location_type] projects focusing on [discipline] in [industry] that last for [duration] and are [size]?",
    "Find me a [location_type] project related to [discipline] in [industry] that is [size] and lasts [duration].",
    "I'm searching for a [size] project that can be done [location_type], focuses on [discipline], and is in the [industry] sector.",
    "Show me projects related to [discipline] that are [size], last [duration], and are available in the [industry] sector.",
    "Can I see a [location_type] project in [industry] that is [size] and focuses on [discipline]?",
    "What projects in [discipline] and [industry] are [location_type] and available for [duration]?",
    "Are there any [size] projects about [discipline] in [industry] that are [location_type] and last [duration]?",
    "Show me a project in [industry] that focuses on [discipline], is [location_type], and lasts [duration].",
    "I want a [size] project related to [discipline] in the [industry] sector that can be done [location_type] and lasts [duration].",
    "Can I find [size] projects related to [discipline] that are [location_type] and focus on [industry] for [duration]?",
    "Show me [discipline] projects in [industry] that are [size] and [location_type].",
    "I need a [location_type] project in [industry] that lasts [duration] and focuses on [discipline].",
    "Are there any [industry] projects focused on [discipline] that are [size], [location_type], and last [duration]?",
    "Find me [discipline] projects in [industry] that are [location_type], [size], and last [duration].",
    "I'm looking for [industry] projects on [discipline] that are [location_type] and [size].",
    "What projects related to [industry] and [discipline] are [location_type] and last for [duration]?",
    "I want a [location_type] project in [discipline] that is [size] and available in the [industry] sector.",
    "Are there any [size] projects about [discipline] in [industry] that are [location_type] and last [duration]?",
    "Show me a [discipline] project that is [size], lasts [duration], and is [location_type] in [industry].",
    "Can I find [location_type] projects related to [discipline] that are [size] and in the [industry] sector?",
    "I need a [industry] project that is [location_type], lasts [duration], and focuses on [discipline].",
    "What projects related to [industry] and [discipline] are [location_type] and last [duration]?",
    "Show me projects about [discipline] in [industry] that are [size] and last [duration].",
    "Find me [location_type] projects in [discipline] that last [duration] and focus on [industry]."
    "Show me [industry] projects.",
    "I want projects in [discipline].",
    "Are there any [size] projects available?",
    "What projects can be done [location_type]?",
    "Find projects that last for [duration].",
    "Show me [location_type] projects.",
    "I need [size] projects.",
    "Are there projects related to [discipline]?",
    "What projects are available in [industry]?",
    "Can I find projects that last [duration]?"
    "Show me [industry] projects that are [location_type].",
    "Find projects in [discipline] that last [duration].",
    "Are there [size] projects in [industry]?",
    "I need [location_type] projects in [discipline].",
    "Can I see projects in [discipline] that last [duration]?",
    "What [industry] projects are [location_type]?",
    "Show me [size] projects that last [duration].",
    "Are there [location_type] projects related to [discipline]?",
    "Find me projects in [industry] that are [size].",
    "I want projects in [industry] that last [duration]."
    "Show me [industry] projects that are [size] and [location_type].",
    "Find projects in [discipline] that are [location_type] and last [duration].",
    "Are there [size] projects in [industry] that last [duration]?",
    "I need [location_type] projects in [discipline] that are [size].",
    "Can I see projects in [discipline] that last [duration] and are [location_type]?",
    "What [industry] projects are [location_type] and last [duration]?",
    "Show me [size] projects in [industry] that are [location_type].",
    "Are there [location_type] projects in [discipline] that are [size]?",
    "Find me projects in [industry] that are [size] and last [duration].",
    "What [size] projects are available?",
    "Show me available projects in [industry].",
    "Are there any projects related to [discipline]?",
    "Can I see projects that last [duration]?",
    "Show me [size] projects.",
    "I need projects that last for [duration].",
    "What projects can be done [location_type]?",
    "Show me [discipline] projects.",
    "Find me [industry] projects.",
    "What projects are available in [location_type]?"
    "I want [size] projects in [industry] that are [location_type]."
    "Show me [industry] projects that are [size].",
    "Find me [discipline] projects that last for [duration].",
    "I need [size] projects that are [location_type].",
    "Show me projects in [discipline] that can be done [location_type].",
    "Are there any [industry] projects that last for [duration]?",
    "Show me [size] projects in [location_type].",
    "Can I see [industry] projects that last for [duration]?",
    "Find [size] projects related to [discipline].",
    "Show me [industry] projects that last [duration].",
    "Find me projects in [discipline] that are [size]."
    "Find [discipline] projects that are [size] and last for [duration].",
    "What [industry] projects can be done [location_type] and are [size]?",
    "Show me [industry] projects that last [duration] and are [size].",
    "Are there any [discipline] projects that can be done [location_type] and last [duration]?",
    "Find me [industry] projects that are [size] and [location_type].",
    "Show me [industry] projects that last for [duration] and are [location_type].",
    "What projects in [discipline] can be done [location_type] and are [size]?",
    "Show me [industry] projects in [discipline] that are [location_type].",
    "Find [size] projects that last for [duration] and are in [location_type].",
    "Are there [discipline] projects that are [size] and can be done [location_type]?"
     "Show me [industry] projects that are [size], last [duration], and can be done [location_type].",
    "Find [discipline] projects that are [size], can be done [location_type], and last for [duration].",
    "Are there any [industry] projects related to [discipline] that are [size] and [location_type]?",
    "Show me [industry] projects that focus on [discipline], last [duration], and are [size].",
    "What [discipline] projects in [industry] are [size], last [duration], and are [location_type]?",
    "Find me [industry] projects in [discipline] that are [size] and can be done [location_type].",
    "Show me [size] projects in [industry] that last [duration] and can be done [location_type].",
    "Are there [discipline] projects in [industry] that are [location_type] and last [duration]?",
    "Show me [size] projects in [industry] that focus on [discipline] and last for [duration].",
    "Can I see [industry] projects that focus on [discipline], are [size], and can be done [location_type]?"
     "Show me [industry] projects that focus on [discipline], are [size], last [duration], and can be done [location_type].",
    "Find [industry] projects related to [discipline] that are [size], can be done [location_type], and last for [duration].",
    "Are there any [industry] projects on [discipline] that are [size], last [duration], and are [location_type]?",
    "Show me [size] projects in [industry] related to [discipline], that last [duration], and are [location_type].",
    "What [industry] projects in [discipline] are [size], can be done [location_type], and last [duration]?",
    "Find me [industry] projects that focus on [discipline], are [size], last [duration], and are [location_type].",
    "Are there any [discipline] projects in [industry] that are [size], can be done [location_type], and last [duration]?",
    "Show me [size] projects in [industry] related to [discipline] that last [duration] and can be done [location_type].",
    "Find [industry] projects in [discipline] that are [size], last [duration], and can be done [location_type].",
    "What [industry] projects are related to [discipline], are [size], last [duration], and are [location_type]?"
]

def generate_example():
    # Randomly choose values for industry, discipline, size, duration, and location_type
    industry = random.choice(industries)
    discipline = random.choice(disciplines)
    size = random.choice(sizes)
    duration = random.choice(durations)
    location_type = random.choice(location_types)

    # Choose a random sentence template
    sentence_template = random.choice(sentence_templates)

    # Replace placeholders with the chosen values
    sentence = sentence_template.replace("[industry]", f"[{industry}](industry)")
    sentence = sentence.replace("[discipline]", f"[{discipline}](discipline)")
    sentence = sentence.replace("[size]", f"[{size}](size)")
    sentence = sentence.replace("[duration]", f"[{duration}](duration)")
    sentence = sentence.replace("[location_type]", f"[{location_type}](location_type)")

    return sentence

# Generate 1500 examples
examples = [generate_example() for _ in range(25000)]

# Output the examples in NLU format to a custom file
file_name = "custom_nlu_examples.yml"
with open(file_name, "w") as file:
    file.write("version: '3.1'\n\n")
    file.write("nlu:\n")
    file.write("- intent: ask_project\n")
    file.write("  examples: |\n")
    for example in examples:
        file.write(f"    - {example}\n")

print(f"25000 examples generated and saved in {file_name}")
