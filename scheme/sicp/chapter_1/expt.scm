(begin 
  (define expt-linear (lambda (b n) 
    (if (= n 0) 1 
    (* b (expt-linear b (- n 1))))
  ))
  (define expt (lambda (b n) (expt-iter b n 1)))
  (define expt-iter (lambda (b counter product) 
    (if (= counter 0) product 
      (expt-iter b (- counter 1) (* b product))
    )
  ))
)