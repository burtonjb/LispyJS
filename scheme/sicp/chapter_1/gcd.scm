(begin 
  (define gcd (lambda (a b) 
    (if (= b 0) 
      a
      (gcd b (% a b))
    )
  ))
)