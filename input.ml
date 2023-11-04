let validate s =
	match s with
	| "k" -> None
	| _ -> Some s

let inp i =
	match i with
	| 1 -> (match (validate (read_line())) with
		   | None -> print_endline "Program Termination Requested"
		   | _ -> print_endline "yay")
	| _ -> print_endline "input is not accepting input"
	
(*let _ =
	input 1*)
