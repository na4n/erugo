open Global
open Random
open Map

let rec create_floor n =
	match n with
	| 0 -> {row = 3 + Random.int(7); column = 3 + Random.int(7); next = None} 
	| _ -> {row = 3 + Random.int(7); column = 3 + Random.int(7); next = Some (create_floor (n-1))}

let rec unwrap t =
	match t with
	| Some x -> ( (*print_string "length: ";
				print_int x.length;
				print_endline "";

				print_string "width: ";
				print_int x.width;
				print_endline "\n"; *)

				(display_room x.row x.column x.row);

				(unwrap x.next))

	| None -> None

let _ = 
	Random.self_init();
	
	let c = create_floor (1 + Random.int (9)) in
	(unwrap (Some c))

