; Create a function to generate all items in range(0, i)
( begin
 ( define range
  ( lambda
   ( i l)
   ( if
    ( = i 0) l
    ( range
     ( - i 1)
     ( cons i l)))))
 ( define l2
  ( range 12
   ( list)))
 ( reduce-right
  ( lambda
   ( x y)
   ( + x y)) l2)
)
; l2 = 1,2,3,4,5,6,7,8,9,10,11,12
; returns 78

