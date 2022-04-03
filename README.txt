Q1. Give three examples of Python programs that use binary operators and/or builtins from this PA, 
but have different behavior than your compiler.

Ans. 1 

1) What - If we try to run max(1,2,3) with 3 arguments our compiler throws a parsing error. 
          However, the python compiler returns the max value among the three.
   Why - Our compiler currently doesn't support more than 2 arguments therefore it gives an error.
   Fix - during parsing, we can add support for more than 2 arguments and pass all arguments to the
         javascript max function used.

2) What - If we run (3) in our compiler it gives a parsing error. 
          However, the python compiler returns and prints the number 3.
   Why - Our compiler doesn't support parsing of brackets therefore, it gives an error.
   Fix - we can add for open & close brackets by parsing them and evaluating the expression inside the 
         brackets individually using the existing code and then merging it with other expressions, if applicable.

3) What - If we run abs(1,2) in our compiler it gives a parsing error unknown buildin2.
          However, the python compiler returns a type error abs() takes exactly one argument (2 given).
   Why - Our compiler determines the function type (buildin1/buildin2) based on the length of the arguments, 
         therefore if the length is 2 it determines it's a buildin2 which is a wrong interpretation.
   Fix - Instead of determining based on the length of the arguments, we can define a mapping between the function
         and the arguments it can support and use that using parsing.

Q2. What resources did you find most helpful in completing the assignment?

Ans. 2  TA discussions and piazza posts.

Q3. Who (if anyone) in the class did you work with on the assignment? (See collaboration below)

Ans 3.  None