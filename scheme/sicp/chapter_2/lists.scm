(begin 

  (define list-ref (lambda (items n) ; get the nth element from the list, or the last element
    (if (= n 0)
      (car items)
      (list-ref (cdr items) (- n 1))
    ) 
  ))

  (define squares (list 1 4 9 16 25))
  (print (list-ref squares 3)) ; outputs 16

  (define length (lambda (items) 
    (if (empty? items) 
      0
      (+ 1 (length (cdr items)))
    )
  ))
  (define odds (list 1 3 5 7 9))
  (print (length odds)) ; outputs 5

  (define append (lambda (list1 list2) 
    (if (empty? list1) 
      list2
      (cons (car list1) (append (cdr list1) list2))
  )))
  (printflat (append squares odds)) ;it outputs a nested list instead of a flat list, but I'm not too worried right now
  (printflat (append odds squares))

  (define map (lambda (proc items) 
    (if (empty? items)
      nil
      (cons (proc (car items)) 
        (map proc (cdr items)))
    )
  ))
  (printflat (map (lambda (x) (* x x)) odds))

  nil
)