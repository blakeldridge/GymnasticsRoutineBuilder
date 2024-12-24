import re
import sys
import json
import os

# Updated regex pattern to ensure proper splitting
skill_pattern = r'(\d+\.\s?)'  # Capture the number and dot in the split
difficulties = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]

def convert_page(data, group, apparatus):
    # Splitting the data by the updated regex pattern
    skills = re.split(skill_pattern, data)
    
    # Combine the captured splits to maintain the number and dot
    cleaned_skills = []
    for i in range(1, len(skills), 2):  # Start from index 1 to get the skill descriptions
        skill_number = skills[i].strip()  # Get the number and dot
        skill_description = skills[i + 1].strip() if i + 1 < len(skills) else ""
        
        # Create the skill dictionary if the description is not empty
        if skill_description:
            skill = {
                "Name": skill_description.replace("\n", ""),
                "difficulty": difficulties[(int(skill_number[0]) - 1) % len(difficulties)],
                "group": group,
                "apparatus": apparatus
            }
            cleaned_skills.append(skill)
    return cleaned_skills

def convert_vault_page(data, group, apparatus):
    s = []
    skills = re.split(skill_pattern, data)
    for skill in reversed(skills):
        if re.match(r'\d+\.\s?', skill) or len(skill) < 10:
            skills.remove(skill)
    difficulties = re.findall(r'\d\.\d', data)

    for i in range(len(difficulties)):
        s.append(
            {
                "Name": skills[i + 1].replace("\n", ""),
                "difficulty": difficulties[i],
                "group": group,
                "apparatus": apparatus
            }
        )
    return s

def save_skills_to_json(all_skills, output_file):
    # If the file exists, load existing data
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as json_file:
            apparatus_skills = json.load(json_file)
    else:
        # Initialize an empty dictionary if the file doesn't exist
        apparatus_skills = {}

    # Organize skills by apparatus and add to existing data
    for skill in all_skills:
        apparatus = skill["apparatus"]
        if apparatus not in apparatus_skills:
            apparatus_skills[apparatus] = []
        apparatus_skills[apparatus].append(skill)

    # Write the updated skills to the JSON file
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(apparatus_skills, json_file, ensure_ascii=False, indent=4)
        
if __name__ == "__main__":
    args = sys.argv
    if len(args) != 4:
        print("Incorrect format, should use: python parseSkills.py <filename> <output_json>")
    else:
        filename = args[1]
        output_json = args[2]
        apparatus = args[3]  # This is the group or apparatus name to be used

        all_skills = []
        with open(filename, "r", encoding="utf-8") as file:
            pages = file.read().split("EG ")
            for page in pages:
                if len(page) == 0:
                    continue
                if page[0] == "I":
                    skills = convert_vault_page(page, page[0:3], apparatus)
                    all_skills += skills
                elif page[0] == "V":
                    skills = convert_vault_page(page, page[0], apparatus)
                    all_skills += skills

        print("Total Skills Found: " + str(len(all_skills)))
        
        # Save skills to JSON file
        save_skills_to_json(all_skills, output_json)
        print(f"Skills saved to {output_json}")
