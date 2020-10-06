(begin 
  (define sum (lambda (term a next b)
    (if (> a b) 0 
      (+ (term a) 
        (sum term (next a) next b))
    )
  ))
  (define inc (lambda (n) (+ n 1)))
  (define cube (lambda (n) (* n n n )))
  (define sum-cubes (lambda (a b) (sum cube a inc b)))
  (printv (quote sum-cubs) (sum-cubes 1 10))

  (define identity (lambda (x) x))
  (define sum-integers (lambda (a b) 
    (sum identity a inc b)
  ))
  (printv (quote sum-integers) (sum-integers 1 10))

  (define integral 
    (lambda (f a b dx) 
      (* (sum f (+ a (/ dx 2)) (lambda (x) (+ x dx)) b) dx)
    )
  )
  
  (integral cube 0 1 0.01)
)