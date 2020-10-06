(begin
  (define nth (lambda (l n) 
    (if (= n 0)
      (car l)
      (nth (cdr l) (- n 1))
    )
  ))
  (define range-iter (lambda (current stop l) 
    (if (= current stop) 
      l
      (cons current (range-iter (+ current 1) stop l))
    )
  ))

  (print (nth (list 1 2 3 4) 0))
  (print (nth (list 1 2 3 4) 1))
  (print (nth (list 1 2 3 4) 2))
  (print (nth (list 1 2 3 4) 3))
  (print (nth (list 1 2 3 4) 4))
  (print (nth (list 1 2 3 4) 5))

  (define ri (range-iter 0 10 nil))
  (print ri)
  (printflat ri)
  nil
)