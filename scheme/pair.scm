(begin 
  (define pair (lambda (l) 
    (if (empty? (cdr l))
      l
      (cons (car l) (car (cdr l)))
    ))
  )

  (define l (list 1 2 3 4))
  (print (pair l)) ; 
  (print (pair (cdr l)))
  (print (pair (list 1)))
  (print (list (pair (list 1 2)) (pair (list 3 4))))

  (print (quote --- ))
  
  (define pair-up (lambda (l) 
    (if (empty? l)
      l
      (cons (pair l) (pair-up (cdr (cdr l))))
    )
  ))
  (print (pair-up (list 1 2)))
  (print (pair-up (list 1 2 3)))
  (print (pair-up (list 1 2 3 4)))
  (print (pair-up (list 1 2 3 4 5 6)))
)