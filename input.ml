(*let validate s =
	match s with
	| "k" -> None
	| _ -> Some s
*)

let inp i =
	match i with
	| 1 -> (match (read_line()) with
		   | "k" -> 0
		   | "w" | "a" | "s" | "d" -> 1
		   | _ -> 2)
	| _ -> print_endline "input is not accepting input"; 2
	
(*let _ =
	input 1*)
