(begin 
  (define run-script (lambda (x) 
    (eval (parse (read-file x)))
  ))
  (run-script (quote ./scheme/basic.scm))
)