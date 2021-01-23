let lego = {
  eq: '(start)-eq-{bx}',
  bx: '(eq)-bx-{i}',
  i: '(bx)-i-{sign|sym|num|br|fr}',
  sign: '(i)-sign-{text}',
  sym: '(i)-sym-{text|super|sub}',
  num: '(i)-num-{text|super|sub}', //add number
  br: '(i)-br|eq-{bx}',
  
  super: '(sym|num)-super|eq-{bx}',
  sub: '(sym|num)-sub|eq-{bx}',
  
  fr:'(i)-fr-{top|bot}',
  top: '(fr)-top|eq-{bx}',
  bot: '(fr)-bot|eq-{bx}',  
}