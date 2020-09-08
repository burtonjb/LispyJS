(begin
  (define sum (lambda ( n acc)
    (if (= 0 n) 
      acc
      (sum (- n 1) (+ n acc)
    ))))
 (sum 5000 0)
)