# getting the UCI Alumni name, company cik, bio, link from full_name.csv file 
# query for finding the UCI Alumni perosnal cik via Searching_CIK, 
# and storing the personal cik, name, bio, def_14A link into the Database_schema. 
# database: Database_schema
# output: Persons.csv, FilingLinks.csv

import mysql.connector # type: ignore
import csv
# 读一个行就用fetch_cik_by_name("HENRY CHRISTIAN O") get the cik and insert into the database
def process_file(file_path):
    with open(file_path, 'r', encoding='latin-1') as file:
        reader = csv.reader(file)
        return [(row[0],) for row in reader]
def fetch_cik_by_name(connection, name):
    cursor = connection.cursor()
    query = "SELECT Name, CIK FROM CIK_Search WHERE Name LIKE %s"
    cursor.execute(query, ('%' + name + '%',))
    return cursor.fetchall()

# cleaning the data, converting the data type
def clean_company_name(name):
    if name is None:
        return None
    # Define special characters to remove from the start and end of the string
    special_chars = "!@#$%^&*()_+-=[]{}|;:',.<>?/"
    # Strip special characters from both ends
    cleaned_name = name.strip(special_chars)
    return cleaned_name

def clean_and_convert_cik(cik_str):
    if cik_str is not None:
        cik_str = ''.join(filter(str.isdigit, cik_str))
        try:
            return int(cik_str)
        except ValueError:
            return None
    return None

def check_cik_exists(connection, cik):
    cursor = connection.cursor()
    query = "SELECT CIK FROM Persons WHERE CIK = %s"
    cursor.execute(query, (cik,))
    result = cursor.fetchone()
    cursor.close()
    return result

def check_cik_exists_link(connection, cik):
    cursor = connection.cursor()
    query = "SELECT CIK FROM FilingLinks WHERE CIK = %s"
    cursor.execute(query, (cik,))
    result = cursor.fetchone()
    cursor.close()
    return result
def clean_and_convert_data(data_tuple):
    cleaned_data = []
    for index, item in enumerate(data_tuple):
        if item is not None:
            item = item.strip()  # Remove any leading/trailing whitespace
        if index == 0:  # CIK processing
            item = clean_and_convert_cik(item)  # Clean and convert CIK
        # Further processing for other fields if necessary
        cleaned_data.append(item)
    return tuple(cleaned_data)


# inserting the cleaned data into the main database
def insert_into_persons(connection, data):
    if not check_cik_exists(connection, data[0][0]):
        cursor = connection.cursor()
        insert_query = """
        INSERT INTO Persons (CIK, Name, Company, StockTicker, Bio, Note, Status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        Name= VALUES(Name), 
        Company=VALUES(Company), 
        StockTicker=VALUES(StockTicker), 
        Bio=VALUES(Bio), 
        Note=VALUES(Note), 
        Status=VALUES(Status)
        """
        try:
            cursor.executemany(insert_query, data)
            #print("inserting data", data)
            connection.commit()
        except Exception as e:
            connection.rollback()
            print(f"Error inserting data: {e}")
        finally:
            cursor.close()
    else:
        print(f"Skipping duplicate CIK {data[0]}")


def insert_into_filing_links(connection, CIK, SECFormType, FilingDate, Link):
    if not check_cik_exists_link(connection, CIK):
        cursor = connection.cursor()
        # Using default values for SECFormType and FilingDate if not provided
        insert_query = """
        INSERT INTO FilingLinks (CIK, SECFormType, FilingDate, Link) VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE SECFormType=VALUES(SECFormType), FilingDate=VALUES(FilingDate), Link=VALUES(Link)
      """
        try:
            cursor.execute(insert_query, (CIK, SECFormType, FilingDate, Link))
            #print("LINK",CIK, SECFormType, FilingDate, Link )
            connection.commit()
        except Exception as e:
            connection.rollback()
            print(f"Error inserting data into FilingLinks: {e}")
        finally:
            cursor.close()
    else:
        print(f"Skipping duplicate CIK {CIK}")

def process_and_store(file_path):
    src_connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Wjj030529!',
        database='CIK_Searching'
    )
    target_connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Wjj030529!',
        database='Main_database'
    )

    with open(file_path, 'r', encoding = 'utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            name = row[0]  # Name
            bio = row[2] if len(row) > 2 else None
            link = row[3] if len(row) > 3 else None
            company = None
            stock_ticker= None
            note = None
            Status= None

            cik_records = fetch_cik_by_name(src_connection, name)
            if cik_records:
                for record in cik_records:
                    # the persons data
                    UCI_Alumni_data = (record[1], name, company, stock_ticker, bio, note, Status)
                    cleaned_and_converted_data = [clean_and_convert_data(UCI_Alumni_data)]
                    insert_into_persons(target_connection, cleaned_and_converted_data)

                    # filing link data
                    cleaned_cik = clean_and_convert_cik(record[1])
                    if check_cik_exists(target_connection, cleaned_cik):
                        filing_link_data = (cleaned_cik, "def-14A", None, link)
                        insert_into_filing_links(target_connection, *filing_link_data)
                    else:
                        print(
                            f"CIK {cleaned_cik} not found in Persons, skipping insert into FilingLinks.")
                    break
    src_connection.close()
    target_connection.close()


if __name__ == "__main__":
    file_path = './full_names.csv'
    process_and_store(file_path)

