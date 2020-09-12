(begin 
  (define factorial-not-tail-call-optimizable (lambda (n) (
    if (= 1 n)     
      1
      (* n (factorial-not-tail-call-optimizable (- n 1)))
  )))

  (define factorial (lambda (n) 
    (fact-iter 1 1 (+ n 1)))
  )
  (define fact-iter (lambda (product counter max-count) 
    (if (>= counter max-count) 
      product 
      (fact-iter (* counter product) (+ counter 1) max-count)
    )
  ))
)