open Input

let _ = 
	match Input.inp 1 with
	| 0 -> print_endline "program termination requested" 
	| 1 -> print_endline "valid input!"
	| _ -> print_endline "invalid input"

