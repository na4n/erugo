type room = {length: int; width: int; next: room option}

let _ = 
	let a = {length = 2; width = 4; next = None} in
	print_int a.length


