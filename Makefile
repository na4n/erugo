p.out: input.ml prompt_driver.ml
	ocamlc -o p.out input.ml prompt_driver.ml

run: p.out
	./p.out

clean: 
	rm -f *.cmo *.cmi *.out

