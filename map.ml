open Random

let get_num = 
	Random.self_init();
	3 + (Random.int 7)

let rec display_row n_col start = 
	match n_col with
	| 0 -> print_endline "#"
	| _ -> if n_col = start then print_string "#";
		   print_string " . ";
		   (display_row (n_col-1) start)

let rec plain n_col start = 
	match n_col with
	| 0 -> print_endline "#"
	| _ -> if n_col = start then print_string "#";
		   print_string " # ";
		   (plain (n_col-1) start)

let rec display_room n_row n_col first =
	match n_row with
	| 0 -> plain n_col n_col
	| _ -> if n_row = first then (plain n_col n_col);
		   display_row n_col n_col;
		   (display_room (n_row-1) (n_col) (first))

let create_room = 
	let c = 3 + (Random.int 7) in
		(display_room c (3+ (Random.int 7)) c)

let _ = 
	Random.self_init();
	create_room;
	print_int get_num
