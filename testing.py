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

def main():
	select_connections("char_games","Mario")
	select_connections("games_characters","Super Smash Bros.")
	select_connections("console_games","N64")
	select_connections("games_consoles","Destiny")

if __name__ == '__main__':
	main()