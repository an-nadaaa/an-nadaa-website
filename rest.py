import requests
import json

# API URL to fetch country data
api_url = "https://restcountries.com/v3.1/all"

# Fetch the country data
response = requests.get(api_url)
countries = response.json()

# Extract the required data
country_data = []
for country in countries:
    # Some countries might not have a calling code, so we use get to avoid errors
    country_name = country.get("name", {}).get("common", "Unknown")
    calling_code = country.get("idd", {}).get("root", "") + "".join(
        country.get("idd", {}).get("suffixes", [])
    )

    if calling_code:  # Only include countries that have a calling code
        country_data.append({"name": country_name, "code": calling_code})

# Output to a text file
with open("countries_with_codes.txt", "w") as f:
    json.dump(country_data, f, indent=4)

print(f"Data has been written to countries_with_codes.txt")
