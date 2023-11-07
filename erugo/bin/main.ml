let () =
	let stdscr = Curses.initscr () in
	
	if Curses.curs_set 0 then () else ();
	if Curses.nodelay (stdscr)(false) then ();
	
	if Curses.waddchstr (stdscr) ([|int_of_char 'n';int_of_char 'o'|]) then ()
	else print_endline "ohno";
	if Curses.waddchstr (stdscr) ([|int_of_char 'a'; int_of_char 'b'|]) then ()
	else print_endline "ohnop2";

	Unix.sleep 10;
	
	Curses.clear ();
	Curses.endwin();

  (*if Curses.addch 2 then print_endline "yay";

  Unix.sleep 20;
  print_int (Curses.getbkgd stdscr);
  Curses.endwin();*)

