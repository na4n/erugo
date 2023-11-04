let validate_input s = 
	match s with
	| "k" -> None
	| "w" | "a" | "s" | "d" -> Some s
	| _ -> Some "incorrect input"

let eioajwe = 
	match validate_input (read_line ()) with
	| Some x -> print_endline x
	| _ -> print_endline "none"

let _ =
	print_endline "test"
