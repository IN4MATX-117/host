import pandas as pd
import pymysql
import re
from sqlalchemy import create_engine
from sqlalchemy import text

# Connecting with the MySQL
username = 'root'
password = '12345678'
host = '127.0.0.1'
database = 'UCI_Alumni'
connection_string = f'mysql+pymysql://{username}:{password}@{host}/{database}'

# Create an engine
engine = create_engine(connection_string)

# Read the files
full_names_uml = '/./full_names_data.csv'
related_forms_uml = "/./related_forms_data.csv"
cik_data_path = '/./cik-lookup-data.txt'
partial_names_path = "/./partial_names_data.csv"

full_names_data = pd.read_csv(full_names_uml)
related_forms_data = pd.read_csv(related_forms_uml)
partial_names_data = pd.read_csv(partial_names_path, header=None)
partial_names_data.columns = ['Parsing_name', 'Link', 'Company_CIK', 'Bio']
# CIK-searching
def process_cik_file(file_path):
    data = []
    with open(file_path, 'r', encoding='latin-1') as file:
        for line in file:
            if ':' in line:
                name, cik = line.split(':', 1)
                cik_cleaned = cik.strip().replace(':', '').lstrip('0')
                data.append({'Name': name.strip(), 'CIK': cik_cleaned})
    return data

# File path and process the data
cik_data = process_cik_file(cik_data_path)
cik_df = pd.DataFrame(cik_data)

# Insert Data into the CIK_Search table
if not cik_df.empty:
    cik_df.to_sql('CIK_Search', con=engine, index=False, if_exists='append')
    print("CIK_Search: Data inserted successfully.")
else:
    print("CIK_Search: No data to insert.")


# Preprocess the full_names_data
full_names_data['Personal_CIK'] = full_names_data['Personal_CIK'].astype(str)
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
full_names_data['Personal_CIK'] = full_names_data['Personal_CIK'].astype(str)
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
    new_unique_persons_entries[["Personal_CIK", "Name", "Parsing_name", 'Company_CIK', 'Bio', 'UML', 'NumberOfShares', 'Note', 'Status', 'WithName']].to_sql('Persons', con=engine, index=False, if_exists='append')
    print("Persons: New unique data inserted successfully.")
    persons_updated = True
else:
    print("Persons: No new unique data to insert.")


# Filling Link
related_forms_data['personal_cik'] = related_forms_data['personal_cik'].astype(str)
related_forms_data['SECFormType'] = related_forms_data['formType']
related_forms_data['FilingDate'] = related_forms_data['filedAt']
related_forms_data['Link'] = related_forms_data['filingUrl']


# Fetch existing personal_cik and Link pairs from the FillingLinks table
existing_fillinglinks_pairs = pd.read_sql("SELECT personal_cik, Link FROM FillingLinks", con=engine)

# Merge the new data with existing pairs to find duplicates
merged_fillinglinks_data = pd.merge(related_forms_data, existing_fillinglinks_pairs, on=["personal_cik", "Link"], how='left', indicator=True)

# Filter out existing entries
new_unique_fillinglinks_entries = merged_fillinglinks_data[merged_fillinglinks_data['_merge'] == 'left_only'].drop(columns=['_merge'])

if not new_unique_fillinglinks_entries.empty:
    new_unique_fillinglinks_entries[["personal_cik", 'SECFormType', 'FilingDate', 'Link']].to_sql('FillingLinks', con=engine, index=False, if_exists='append')
    print("Filling Link: New data inserted successfully.")
else:
    print("Filling Link: No new data to insert.")

# Company

# Fetch CIK_Search data from the database
cik_search_data = pd.read_sql("SELECT Name AS Company_name, CIK AS Company_CIK FROM CIK_Search", con=engine)

# Convert Company_CIK in both DataFrames to string to ensure data type alignment
full_names_data['Company_CIK'] = full_names_data['Company_CIK'].astype(str)
cik_search_data['Company_CIK'] = cik_search_data['Company_CIK'].astype(str)

# Merge CIK_Search data with full_names_data
try:
    merged_data = pd.merge(full_names_data, cik_search_data, on='Company_CIK', how='inner')
    print("Merge successful.")
except Exception as e:
    print(f"Merge failed: {e}")

# Process and insert data into the Company table
if not merged_data.empty:
    # Rename columns and drop duplicates
    company_data = merged_data[['Company_CIK', 'Company_name']]
    company_data = company_data.drop_duplicates()
    company_data['StockTicker'] = "None"
    company_data['SharePrice'] = "None"
    #company_data['SharePrice'] = full_names_data['SharePrice'].apply(lambda x: -1 if x == "non_stock_price" else x)
    company_data[['Company_CIK', 'Company_name', 'StockTicker','SharePrice']].to_sql('Company', con=engine, index=False, if_exists='replace')
    print("Company: Data merged and inserted successfully.")
else:
    print("Company: No data to merge or insert.")


# parsing_name
existing_persons_data = pd.read_sql("SELECT * FROM Persons", con=engine)
# Merge partial_names_data with existing_persons_data on the 'Link' and 'UML' fields
with engine.connect() as connection:
    merged_data = pd.merge(existing_persons_data, partial_names_data[['Parsing_name', 'Link']],
                           left_on='UML', right_on='Link', how='left')
    # Debugging output to check if columns are as expected
    print(merged_data.columns)
    # Check if the necessary columns are present
    if 'Parsing_name_y' in merged_data.columns:
        for index, row in merged_data.iterrows():
            if pd.notna(row['Parsing_name_y']) and (row['Parsing_name_x'] is None or row['Parsing_name_x'] != row['Parsing_name_y']):
                sql_query = text("""
                UPDATE Persons
                SET Parsing_name = :new_parsing_name
                WHERE UML = :uml
                """)
                connection.execute(sql_query, {'new_parsing_name': row['Parsing_name_y'], 'uml': row['UML']})
        connection.commit()
        print("Parsing_name updated where applicable.")
    else:
        print("Error: 'Parsing_name_y' column not found in the merged data.")

merged_data = pd.merge(full_names_data, cik_search_data, on='Company_CIK', how='inner')

# Update existing records in the Company table
with engine.connect() as connection:
    for index, row in merged_data.iterrows():
        update_query = text("""
            UPDATE Company
            SET StockTicker = :stock_ticker, SharePrice = :share_price
            WHERE Company_CIK = :company_cik
        """)
        connection.execute(update_query, {'stock_ticker': row['StockTicker'], 'share_price': row['SharePrice'], 'company_cik': row['Company_CIK']})
    connection.commit()
    print("Company table updated successfully with new StockTicker and SharePrice values.")
