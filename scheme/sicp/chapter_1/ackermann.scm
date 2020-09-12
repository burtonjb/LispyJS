(begin 
  (define A (lambda (x y) ; the output of this function matches the MIT scheme implementation, even if it doesn't match wolfram alpha/wikipedia
    (if (= y 0) 
      0 
      (if (= x 0) 
        (* 2 y) 
        (if (= y 1) 
          2 
          (A (- x 1) (A x (- y 1)))
      )
    ))
  ))
)