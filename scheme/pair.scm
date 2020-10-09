(begin 
  (define pair (lambda (l) 
    (if (empty? (cdr l))
      l
      (list (car l) (car (cdr l)))
    ))
  )

  (define l (list 1 2 3 4))
  (print (pair l)) ; 
  (print (pair (cdr l)))
  (print (pair (list 1)))
  (print (list (pair (list 1 2)) (pair (list 3 4))))

  (print (quote --- ))
  
  (define append (lambda (list1 list2) 
    (if (empty? list1) 
      list2
      (cons (car list1) (append (cdr list1) list2))
  )))

  (define pair-up (lambda (l) 
    (if (empty? l)
      l
      (cons (pair l)  (pair-up (cdr (cdr l))))
    )
  ))

  (define nth-pair (lambda (l n) 
    (if (= n 0)
      (car l)
      (nth-pair (car (cdr l)) (- n 1))
    )
  ))

  (print (pair-up (list 1 2)))
  (print (pair-up (list 1 2 3)))
  (print (pair-up (list 1 2 3 4)))
  (print (pair-up (list 1 2 3 4 5)))
  (define x (pair-up (list 1 2 3 4 5 6 7 8)))

  (print (list (nth-pair x 0) (nth-pair x 1) (nth-pair x 2) (nth-pair x 3)))
  nil
)