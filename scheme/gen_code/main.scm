(begin 
  ; load helper functions
  ; (eval (parse (read-file (quote ./scheme/run-script.scm))))
  ; (run-script (quote ./scheme/nth.scm))
  
  ; create initial javascript runtime (probably envs, etc)
  ; define constants

  ; take in an expression

  ; (define define-statement (quote (define x 1)))
  (define handle-define (lambda (define-statement) (
    ; `let VAR = VALUE`
    (define output (join_space (quote (let {} = {}))))
    (template output (nth define-statement 1) (nth define-statement 2))
  )))
)