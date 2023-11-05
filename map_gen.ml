open Random
open Map

let rec create_floor n =
	match n with
	| 0 -> {row = 3 + Random.int(7); column = 3 + Random.int(7); door = 3 + Random.int(7); next = None} 
	| _ -> {row = 3 + Random.int(7); column = 3 + Random.int(7); door = 3 + Random.int(7); next = Some (create_floor (n-1))}

let rec unwrap_floor rooms fn =
		match rooms with
		| Some cur_room -> (
			(fn cur_room.row cur_room.column);
			(unwrap_floor cur_room.next fn)
		)
		| None -> None

let floor = create_floor (1 + Random.int(9))

let _ = 
	Random.self_init();
	(unwrap_floor (Some floor) (Map.display_room))
