#!../flask/bin/python
from flask import Flask, render_template, send_from_directory, request, jsonify
import MySQLdb
import ast
import json

app = Flask(__name__)

dbname = 'cs3200project'
db = MySQLdb.connect(host="localhost", 
                     user="root",
                     passwd="",
                     db=dbname)

@app.route('/')
def homepage():
    return render_template('ddFrontEnd.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/select/<table>', methods=['GET'])
def select_entry(table):
    # retrieve array and translate it into python array
    data = ast.literal_eval(request.args.get("values"))

    # filter out any values that are empty
    data = [a for a in data if '' not in a]
    
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
        table_name=table,
        filter_string=filter_string
    )
    print "Query: " + query

    cursor = db.cursor()
    cursor.execute(query)

    return assemble_json(cursor)

@app.route('/update/<table>/<entryid>', methods=['POST'])
def update_entry(table):
    print "Hello update"

    query = "UPDATE {table_name} SET {new_values} WHERE {id}".format(
            table_name=table,
            new_values="",
            id=table + "_id=" + entryid
        )

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/insert/<table>', methods=['POST'])
def insert_entry(table):
    data = ast.literal_eval(request.data)

    # filter out any values that are empty
    data = [a for a in data if '' not in a]

    columns=""
    values=""
    for x in range(0, len(data)):
        if x == 0:
            columns += data[0][0]
            values += "'" + data[0][1] + "'"
        else:
            columns += ", " + data[x][0]
            values += ", '" + data[x][1] + "'"

    print columns
    print values

    query = "INSERT INTO {table_name} ({column_values}) VALUES ({row_values})".format(
        table_name=table,
        column_values=columns,
        row_values=values,
    )

    print query

    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/delete/<table>/<entryid>', methods=['POST'])
def delete_entry(table, entryid):
    query = "delete from " + dbname + "." + table  + " where " + table + "_id=" + entryid
    print query
    cursor = db.cursor()
    cursor.execute(query)
    db.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/viewall/<table>', methods=['GET'])
def viewall(table):
    query = "select * from " + dbname + "." +  table
    cursor = db.cursor()
    cursor.execute(query)
    
    return assemble_json(cursor)

# Return a json list of the row values, zipped with corresponding column names
def assemble_json(cursor):
    columns = [desc[0] for desc in cursor.description]

    result = []
    rows = cursor.fetchall()
    for row in rows:
        row = dict(zip(columns, row))
        result.append(row)
    return json.dumps({"rows": result})

def make_query(query):
    cursor = db.cursor()
    cursor.execute(query)
    return assemble_array(cursor)

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

@app.route('/select/collections/<table>/<name>', methods=['GET'])
def select_connections(table, name):
    if table == "games_characters" :
        query = "SELECT * FROM game WHERE name = '"+ name + "';"
        data = make_query(query);
        query = "SELECT * FROM character_to_game WHERE game_id = '"+ data[0]['game_id']+"';"
        data = make_query(query);
        or_string = build_or_string(data, "character_id", "character_id")
        query = "SELECT * FROM character WHERE " + or_string + ";"
    elif table == "char_games" :
        query = "SELECT * FROM character WHERE name = '"+ name + "';"
        data = make_query(query);
        query = "SELECT * FROM character_to_game WHERE character_id = '"+ data[0]['character_id']+"';"
        data = make_query(query);
        or_string = build_or_string(data, "game_id", "game_id")
        query = "SELECT * FROM character WHERE " + or_string + ";"
    elif table == "console_games":
        query = "SELECT * FROM console WHERE name = '"+ name + "';"
        data = make_query(query);
        query = "SELECT * FROM game_to_console WHERE console_id = '"+ data[0]['console_id']+"';"
        data = make_query(query);
        or_string = build_or_string(data, "game_id", "game_id")
        query = "SELECT * FROM character WHERE " + or_string + ";"
    else:
        query = "SELECT * FROM game WHERE name = '"+ name + "';"
        data = make_query(query);
        query = "SELECT * FROM character_to_game WHERE game_id = '"+ data[0]['game_id']+"';"
        data = make_query(query);
        or_string = build_or_string(data, "console_id", "console_id")
        query = "SELECT * FROM console WHERE " + or_string + ";"

    cursor = db.cursor()
    cursor.execute(query)
    return  assemble_json(cursor)

def build_or_string(rows, key, row_id):
    or_string = ""
    length = len(rows)
    count = 0
    for row in rows:
        if count != length :
            or_string+= (row_id + " == " +row.get(key) + " OR ")
        else :
            or_string+= (row_id + " == " +row.get(key))
        count+=1
    return or_string

@app.route('/bulkdelete/<table>/<tableid>/<deleteid>/', methods=['POST'])
def bulk_delete(table, tableid, deleteid):
    query = "DELETE FROM "+ table +" WHERE "+ tableid +" = '"+ deleteid + "';"
    data = make_query(query);
    db.commit()

def make_insert_gtcon_call(conname, gamename):
    query = "SELECT * FROM console where name == '"+conname+"';"
    print query
    data1 = [{"console_id":1}]
    #data1 = make_query(query)
    query2 = "SELECT * FROM game where name == '"+gamename+"';"
    data2 = [{"game_id":3}]
    #data2 = make_query(query2)
    print query2

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

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    
    print(final_query)

def make_insert_ctg_call(charname, gamename):
    query = "SELECT * FROM character where name == '"+charname+"';"
    print query
    data1 = [{"character_id":3}]
    #data1 = make_query(query)
    query2 = "SELECT * FROM game where name == '"+gamename+"';"
    print query2
    data2 = [{"game_id":3}]
    #data2 = make_query(query2)

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

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/insert/connect/<table>/<fid>/<secid>')
def insert_connect(table, fid, secid):
    if table == 'game_to_console' :
        make_insert_gtcon_call(fid, secid)
    else :
        make_insert_ctg_call(fid, secid)

if __name__ == '__main__':
    app.run(debug=True)