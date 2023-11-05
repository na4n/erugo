open Curses


let _ = Curses.initscr

(* let main () =
  let win = initscr () in
  (* Initialize curses *)
  raw ();
  keypad win true;
  noecho ();

  (* Clear the screen *)
  clear ();

  (* Create a window that covers the entire screen *)
  let height, width = getmaxyx win in
  let fullscreen_win = newwin height width 0 0 in
  box fullscreen_win 0 0;
  wrefresh fullscreen_win;

  (* Main program loop *)
  let rec loop () =
    let ch = getch () in
    if ch = int_of_char 'q' then
      ()
    else (
      (* Handle other key presses and draw content here *)
      (* For example: mvwprintw fullscreen_win 1 1 "Hello, OCaml Curses!"; *)
      wrefresh fullscreen_win;
      loop ()
    )
  in

  loop ();

  (* Clean up and exit *)
  delwin fullscreen_win;
  endwin ()

let () =
  main () *)
