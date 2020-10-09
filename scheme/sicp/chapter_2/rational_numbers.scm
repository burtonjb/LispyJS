(begin
  ; helper function to create the rational number
  (define gcd (lambda (a b) (
    if (= b 0) a 
    (gcd b (% a b))
  )))

  ; functions to create rational numbers (represented as a 2-list)
  (define make-rat (lambda (n d) 
    (begin 
      (define x (gcd n d))
      (cons (/ n x) (/ d x))
    )
  ))
  (define numer (lambda (x) (car x)))
  (define denom (lambda (x) (car (cdr x))))

  ; operations on rational numbers
  (define add-rat (lambda (x y) (
    make-rat 
      (+ (* (numer x) (denom y))
        (* (numer y) (denom x)))
        (* (denom x) (denom y))
  )))
  (define sub-rate (lambda (x y) 
    (make-rat 
      (- (* (numer x) (denom y))
      (* (numer y) (denom x)))
      (* (denom x) (denom y)))  
  ))
  (define multi-rat (lambda (x y) 
    (make-rat 
      (* (numer x) (numer y))
      (* (denom x) (denom y)))
  ))
  (define div-rat (lambda (x y) 
    (make-rat 
      (* (numer x) (denom y))
      (* (denom x) (numer y)))
  ))

  (define half (make-rat 1 2))
  (define quarter (make-rat 1 4))
  (print (add-rat half quarter))
  (print (sub-rate quarter half))
  (print (multi-rat quarter half))
  (print (div-rat half quarter))
  nil
)