(begin 
  ; [g(x + dx) - (g(x)] / dx
  (define derive (lambda (g)  
    (lambda (x)
      (/  (- (g (+ x dx)) (g x))
          dx)))
  )
  (define dx 0.0001)
  (define cube (lambda (x) (* x x x)))
  ((derive cube) 5)
)