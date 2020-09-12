(begin 
  (define fib-tree (lambda (n) ; the call stack for this grows at the rate of the fib numbers, so exponentially
    (if (= 0 n) 0 
      (if (= 1 n) 1
        (+ (fib-tree (- n 1)) (fib-tree (- n 2)))
      )  
    )
  ))
  (define fib (lambda (n) (fib-iter 1 0 n))) ; the call stack for this grows linearly
  (define fib-iter (lambda (a b count) 
    (if (= count 0) 
      b
      (fib-iter (+ a b) a (- count 1))
    )
  ))
)
    