#!../flask/bin/python
from flask import Flask, render_template, send_from_directory, request, jsonify
import MySQLdb
import ast
import json

app = Flask(__name__)

# Connect to database
dbname = 'cs3200project'
db = MySQLdb.connect(host="localhost", 
                     user="root",
                     passwd="",
                     db=dbname)

# Return HTML for front end
@app.route('/')
def homepage():
    return render_template('ddFrontEnd.html')

# Return javascript for front end
@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


# Select an entry from the specified table and arguments
@app.route('/select/<table>', methods=['GET'])
def select_entry(table):
    # retrieve array and translate it into python array
    data = ast.literal_eval(request.args.get("values"))

    # filter out any values that are empty
    data = [a for a in data if '' not in a]
    
    # assemble the query from filters provided
    filter_string=""
    for x in range(0, len(data)):
        if x==0:
            filter_string="WHERE {column}='{value}'".format(
                column=data[0][0],
                value=data[0][1]
            )
        else:
            filter_string+=" AND {column}='{value}'".format(
                column=data[x][0],
                value=data[x][1]
            )

    query = "SELECT * FROM {table_name} {filter_string}".format(
        table_name=dbname+"." + table,
        filter_string=filter_string
    )
    print "Query: " + query

    # execute query
    cursor = db.cursor()
    cursor.execute(query)

    # return JSON representation of query
    return assemble_json(cursor)

# update an entry in the database with the given table / id
@app.route('/update/<table>/<entryid>', methods=['POST'])
def update_entry(table, entryid):
    data = ast.literal_eval(request.data)

    # filter out any values that are empty
    data = [a for a in data if '' not in a]

    # create the update query based on what parameters are passed
    update_string = ""
    print "update string"
    print data
    for x in range(0, len(data)):
        if x == 0:
            update_string += data[0][0] + "='" + data[0][1] + "'"
        else:
            update_string += ", " + data[x][0] + "='" + data[x][1] + "'"


    query = "UPDATE {table_name} SET {new_values} WHERE {id}".format(
            table_name=table,
            new_values=update_string,
            id=table + "_id=" + entryid
        )

    print query;

    # execute query and commit changes to database
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

# insert an entry into the specified table
@app.route('/insert/<table>', methods=['POST'])
def insert_entry(table):
    data = ast.literal_eval(request.data)

    # filter out any values that are empty
    data = [a for a in data if '' not in a]

    # assemble the insert query string
    columns=""
    values=""
    for x in range(0, len(data)):
        if x == 0:
            columns += data[0][0]
            values += "'" + data[0][1] + "'"
        else:
            columns += ", " + data[x][0]
            values += ", '" + data[x][1] + "'"

    query = "INSERT INTO {table_name} ({column_values}) VALUES ({row_values})".format(
        table_name=dbname + "." + table,
        column_values=columns,
        row_values=values,
    )
    print query

    # execute query and commit changes to database
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

# delete an entry with given id from the given table 
@app.route('/delete/<table>/<entryid>', methods=['POST'])
def delete_entry(table, entryid):
    # assemble delete query
    query = "DELETE from " + dbname + "." + table  + " WHERE " + table + "_id=" + entryid
    
    print query
    
    # execute query and commit to the database
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

# return all rows in the given table
@app.route('/viewall/<table>', methods=['GET'])
def viewall(table):
    query = "SELECT * from " + dbname + "." +  table
    cursor = db.cursor()
    cursor.execute(query)
    
    return assemble_json(cursor)

# Return a json list of the row values, zipped with corresponding column names
def assemble_json(cursor):
    columns = [desc[0] for desc in cursor.description]

    result = []
    rows = cursor.fetchall()

    print columns
    print rows
    print list(rows)
    for row in rows:
        row = dict(zip(columns, row))
        result.append(row)

    print result
    # convert datetimes to readable string (json cannot interpret them)
    for x in result:
        if 'release_date' in x:
            x['release_date'] = str(x['release_date'].date())
        if 'date_founded' in x:
            x['date_founded'] = str(x['date_founded'].date())

    return json.dumps({"rows": result})

def build_or_string(rows, key, row_id):
    or_string = ""
    length = len(rows)

    count = 0
    for row in rows:
        if count == (length - 1) :
            or_string+= (row_id + " == '" +row.get(key)+"'")
        else :
            or_string+= (row_id + " == '" +row.get(key) + "' OR ")
        count += 1
    return or_string

@app.route('/select/connections/<table>/<name>', methods=['GET'])
def select_connections(table, name):
    if table == "games_characters" :
        query = "Select * from cs3200project.character vs join (Select character_id from (select * from cs3200project.game where name = '"+name+"') fst join cs3200project.character_to_game sec on fst.game_id = sec.game_id) ids on vs.character_id = ids.character_id"
    elif table == "char_games" :
        query = "Select * from cs3200project.game vs join  (Select game_id from (select * from cs3200project.character where name = '"+name+"') fst join cs3200project.character_to_game sec on fst.character_id = sec.character_id) ids on vs.game_id = ids.game_id"
    elif table == "console_games":
        query = "Select * from cs3200project.game vs join  (Select game_id from (select * from cs3200project.console where name = '"+name+"') fst join cs3200project.game_to_console sec on fst.console_id = sec.console_id) ids on vs.game_id = ids.game_id"
    else:
        query = "Select * from cs3200project.console vs join (Select game_id from (select * from cs3200project.game where name = '"+name+"') fst join cs3200project.game_to_console sec on fst.game_id = sec.game_id) ids on vs.console_id = ids.console_id"
    
    print query
    cursor = db.cursor()
    cursor.execute(query)
    return  assemble_json(cursor)

def build_or_string(rows, key, row_id):
    or_string = ""
    length = len(rows)
    count = 0
    for row in rows:
        if count != length :
            or_string+= (row_id + " = " +row.get(key) + " OR ")
        else :
            or_string+= (row_id + " = " +row.get(key))
        count+=1
    return or_string

def make_query(query):
    cursor = db.cursor()
    cursor.execute(query)
    return assemble_array(cursor)

def make_insert_gtcon_call(conname, gamename):
    query = "SELECT console_id FROM console where name = '"+conname+"'"
    print query
    data1 = make_query(query)
    query2 = "SELECT game_id FROM game where name = '"+gamename+"'"
    print query2
    data2 = make_query(query2)

    conid = data1[0]['console_id']
    gameid =  data2[0]['game_id']
    columns = "console_id, game_id"
    values = "{con_id}, {game_id}".format(
        con_id = conid,
        game_id = gameid
    ) 
    final_query = "INSERT INTO game_to_console ({column_values}) VALUES ({row_values})".format(
        column_values=columns,
        row_values=values
    )

    print final_query

    cursor = db.cursor()
    cursor.execute(final_query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

def make_insert_ctg_call(charname, gamename):
    query = "SELECT character_id FROM cs3200project.character where name = '"+charname+"'"
    print query
    data1 = make_query(query)
    query2 = "SELECT game_id FROM game where name = '"+gamename+"'"
    print query2
    data2 = make_query(query2)

    character_id = data1[0]['character_id']
    gameid =  data2[0]['game_id']
    columns = "character_id, game_id"
    values = "{character_id}, {game_id}".format(
        character_id = character_id,
        game_id = gameid
    ) 
    final_query = "INSERT INTO game_to_console ({column_values}) VALUES ({row_values})".format(
        column_values=columns,
        row_values=values
    )

    print final_query

    cursor = db.cursor()
    cursor.execute(final_query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/insert/connect/<table>/<fid>/<secid>', methods=['POST'])
def insert_connect(table, fid, secid):
    if table == 'game_to_console' :
        make_insert_gtcon_call(fid, secid)
    else :
        make_insert_ctg_call(fid, secid)

if __name__ == '__main__':
    app.run(debug=True)