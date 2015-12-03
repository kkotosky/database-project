#!../flask/bin/python
from flask import Flask, render_template
import MySQLdb
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


@app.route('/select/<table>', methods=['GET'])
def select_entry(table):
    query = "SELECT * FROM {table_name}".format(
        table_name=table
    )

    print query

    cursor = db.cursor()
    cursor.execute(query)

    return assemble_json(cursor)

@app.route('/update/<table>/<entryid>', methods=['POST'])
def update_entry(table):
    print "Hello update"

@app.route('/insert/<table>', methods=['POST'])
def insert_entry(table):
    query = "INSERT INTO {table_name} ({column_values}) VALUES ({row_values})".format(
        table_name=table,
        column_values="",
        row_values="",
    )

    print query

    cursour = db.cursor()
    cursor.execut(query)

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


if __name__ == '__main__':
    app.run(debug=True)