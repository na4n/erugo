open Global
open Random
open Map

let rec create_floor n =
	match n with
	| 0 -> {row = 3 + Random.int(7); column = 3 + Random.int(7); next = None} 
	| _ -> {row = 3 + Random.int(7); column = 3 + Random.int(7); next = Some (create_floor (n-1))}

let rec unwrap_floor (room : Global.room option) fn =
		match room with
		| Some cur_room -> (
			(fn cur_room.row cur_room.column);
			(unwrap_floor cur_room.next fn)
		)
		| None -> None

let rec create_hallway (floor : Global.room option) : Global.hallway option =
		match floor with
		| None -> None
		| Some x -> Some {row = 1 + Random.int(x.row-1); length = (1 + Random.int(5)); next = (create_hallway x.next)}

let rec unwrap_hallway hallway =
		match hallway with
		| Some hw -> print_int hw.row;
								 print_endline "";

								 print_int hw.length;
								 print_endline "";

								 (unwrap_hallway hw.next)
		| None -> None

let floor = create_floor (1 + Random.int(9))

let hallway = match (create_hallway (Some floor)) with
							| Some x -> x
							| None -> {row=0;length=0;next=None}
let _ = 
	Random.self_init();
	(* (unwrap (Some floor) (Map.display_room)) *)
	(unwrap_hallway (Some hallway))
