open Curses

let _=
	let win = Curses.initscr() in
	
	let _ =
		if mvwaddstr win 0 0 "Hello, Curses!" then
			Curses.refresh();
			Curses.ignore(Curses.getch());
			Curses.endwin

