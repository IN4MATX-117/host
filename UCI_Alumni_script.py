import pandas as pd
import pymysql
import re
from sqlalchemy import create_engine, text

# Make sure to download the latest release of all the packages

# Connecting with MySQL
username = 'mytestuser'
password = 'My6$Password'
host = 'localhost'
database = 'uci_alumni'
connection_string = f'mysql+pymysql://{username}:{password}@{host}/{database}'

# Create an engine
engine = create_engine(connection_string)

# Read the files:  changing the path 
full_names_uml = '/XXX/full_names_data.csv'
related_forms_uml = "/XXX/related_forms_data.csv"

full_names_data = pd.read_csv(full_names_uml)
related_forms_data = pd.read_csv(related_forms_uml)

# Preprocess the full_names_data
full_names_data['Personal_CIK'] = full_names_data['Personal_CIK'].apply(lambda x: pd.to_numeric(x, errors='coerce') if x is not None else "N/A")
full_names_data['Name'] = full_names_data['Name'].fillna('N/A')
full_names_data['Parsing_name'] = full_names_data['Name'].apply(lambda x: "Null" if x != 'N/A' else None)
full_names_data['Company_CIK'] = full_names_data['Company_CIK'].fillna('N/A')
full_names_data['Bio'] = full_names_data['Bio'].fillna('N/A')
full_names_data['Note'] = None
full_names_data['Status'] = None
full_names_data['UML'] = full_names_data['Link']
full_names_data['NumberOfShares'] = full_names_data['shares']
full_names_data['WithName'] = full_names_data['Name'].apply(lambda x: "Yes" if x != 'N/A' else "No")

# Ensure Personal_CIK is treated as int for merging
full_names_data['Personal_CIK'] = full_names_data['Personal_CIK'].astype('Int64')

# Fetch existing Personal_CIK and UML pairs from the Persons table
existing_persons_pairs = pd.read_sql("SELECT Personal_CIK, UML FROM Persons", con=engine)

# Merge the new data with existing pairs to find duplicates
merged_persons_data = pd.merge(full_names_data, existing_persons_pairs, on=["Personal_CIK", "UML"], how='left', indicator=True)

# Filter out existing entries
new_unique_persons_entries = merged_persons_data[merged_persons_data['_merge'] == 'left_only'].drop(columns=['_merge'])

# Flag to check if Persons table was updated
persons_updated = False

# Insert the new unique data into the Persons table
if not new_unique_persons_entries.empty:
    new_unique_persons_entries[["Personal_CIK", "Name", "Parsing_name", 'Company_CIK', 'Bio', 'UML', 'NumberOfShares', 'Note', 'Status', 'WithName']].to_sql('persons', con=engine, index=False, if_exists='append')
    print("Persons: New unique data inserted successfully.")
    persons_updated = True
else:
    print("Persons: No new unique data to insert.")

# Ensure that the Fillings table is updated the first time and whenever the Persons table is updated
with engine.connect() as connection:
    if persons_updated or not connection.execute(text("SELECT COUNT(*) FROM Fillings")).scalar():
        full_names_data['Personal_CIK'] = pd.to_numeric(full_names_data['Personal_CIK'], errors='coerce')
        full_names_data['StockType'] = None
        full_names_data['SharePrice'] = None
        full_names_data['TransactionType'] = None


        if not full_names_data.empty:
            full_names_data[['Personal_CIK', 'StockType', 'SharePrice', 'TransactionType']].to_sql('fillings', con=engine, index=False, if_exists='append')
            print("Data successfully inserted into Fillings.")
        else:
            print("No new data to insert into Fillings.")

# Filling Link
related_forms_data['personal_cik'] = pd.to_numeric(related_forms_data['personal_cik'], errors='coerce')
related_forms_data['SECFormType'] = related_forms_data['formType']
related_forms_data['FilingDate'] = related_forms_data['filedAt']
related_forms_data['Link'] = related_forms_data['filingUrl']

# Ensure personal_cik is treated as int for merging
related_forms_data['personal_cik'] = related_forms_data['personal_cik'].astype('Int64')

# Fetch existing personal_cik and Link pairs from the FillingLinks table
existing_fillinglinks_pairs = pd.read_sql("SELECT personal_cik, Link FROM FillingLinks", con=engine)

# Merge the new data with existing pairs to find duplicates
merged_fillinglinks_data = pd.merge(related_forms_data, existing_fillinglinks_pairs, on=["personal_cik", "Link"], how='left', indicator=True)

# Filter out existing entries
new_unique_fillinglinks_entries = merged_fillinglinks_data[merged_fillinglinks_data['_merge'] == 'left_only'].drop(columns=['_merge'])

if not new_unique_fillinglinks_entries.empty:
    new_unique_fillinglinks_entries[["personal_cik", 'SECFormType', 'FilingDate', 'Link']].to_sql('fillinglinks', con=engine, index=False, if_exists='append')
    print("Filling Link: New data inserted successfully.")
else:
    print("Filling Link: No new data to insert.")

# Company
related_forms_data['extracted_cik'] = related_forms_data['companyNameLong'].apply(
    lambda x: re.findall(r'\(CIK (\d+)\)', x)[0] if re.search(r'\(CIK \d+\)', x) else None
)
related_forms_data['normalized_cik'] = related_forms_data['extracted_cik'].apply(lambda x: str(int(x)))
full_names_data['normalized_Company_CIK'] = full_names_data['Company_CIK'].apply(lambda x: str(int(x)))
# Extract company name from companyNameLong before the first "("
related_forms_data['Company_name'] = related_forms_data['companyNameLong'].apply(lambda x: x.split('(')[0].strip())
merged_data = pd.merge(full_names_data, related_forms_data, left_on='normalized_Company_CIK', right_on='normalized_cik', how='inner')

final_data = merged_data[['normalized_Company_CIK', 'Company_name', 'ticker']].rename(columns={
    'normalized_Company_CIK': 'Company_CIK',
    'ticker': 'StockTicker'
})
final_data.drop_duplicates(inplace=True)
final_data.to_sql('company', con=engine, index=False, if_exists='replace')
print("Data successfully inserted into the Company table.")