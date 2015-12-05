def make_insert_gtcon_call(conname, gamename):
	query = "SELECT * FROM console where name == '"+conname+"';"
	print query
	data1 = [{"console_id":1}]
	#data1 = make_query(query)
	query2 = "SELECT * FROM games where name == '"+gamename+"';"
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
	final_query = "INSERT INTO gtcon ({column_values}) VALUES ({row_values})".format(
		column_values=columns,
		row_values=values
	)
	print(final_query)

def make_insert_ctg_call(charname, gamename):
	query = "SELECT * FROM characters where name == '"+charname+"';"
	print query
	data1 = [{"character_id":3}]
	#data1 = make_query(query)
	query2 = "SELECT * FROM games where name == '"+gamename+"';"
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
	final_query = "INSERT INTO gtcon ({column_values}) VALUES ({row_values})".format(
		column_values=columns,
		row_values=values
	)

	print(final_query)

def main():
	make_insert_gtcon_call('conname', 'gamename')
	make_insert_ctg_call('charname', 'gamename')

if __name__ == '__main__':
	main()