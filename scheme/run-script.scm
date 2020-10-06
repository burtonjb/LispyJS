(begin 
  ; (eval (parse (read-file (quote ./scheme/run-script.scm))))
  (define run-script (lambda (x) 
    (eval (parse (read-file x)))
  ))
  (run-script (quote ./scheme/basic.scm))
)