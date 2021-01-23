let parse_path = {
    start_to_eq: '(f)-[eq]',
  
    eq_to_br: '(eq)-bx-i-[br]',
    br_to_br: '(br)-bx-i-[br]',
    sign_to_br: '[bx]-i-(br)',
    divide_to_br: '(bot)-bx-i-[br]',
    
    eq_to_sym: '(eq)-[bx]-i-sym-text',
    br_to_sym: '(br)-[bx]-i-sym-text',
    sign_to_sym: '[bx]-(i)-sym-text',
    sym_to_sym: '[(bx)]-i-sym-text',
    num_to_sym: '[(bx)]-i-sym-text',
    multiply_to_sym: '[(bx)]-i-sym-text',
    divide_to_sym: '(bot)-[bx]-i-sym-text',
    
    eq_to_num: '(eq)-[bx]-i-num-text',
    br_to_num: '(br)-[bx]-i-num-text',
    sign_to_num: '[bx]-(i)-num-text',
    sym_to_num: '[(bx)]-i-num-text',
    num_to_num: 'text', //12 parse as twelve not one x two
    divide_to_num: '(bot)-[bx]-i-num-text',
    multiply_to_num: '[(bx)]-i-num-text',
    
    eq_to_sign: '(eq)-bx-[i]-sign-text',
    br_to_sign: '(br)-bx-[i]-sign-text',
    multiply_to_sign: '(bx)-[i]-sign-text',
    divide_to_sign: '(bot)-bx-[i]-sign-text',
    
    close_br_to_sign: '[bx]-i-br-(bx)',
    close_fr_to_sign: '[p]-bx-i-fr-bot-(bx)', //-i-br-bx'
    close_fr_sym_to_sign: '[p]-bx-i-fr-bot-(bx)',
    close_bx_to_sign: '[p]-(bx)',
  
    any_to_divide: false,
    // call special functon
    // 1. bx-i-sign-(copy first sign)
    // 2. bx-i-frac-top
    // 3. bx-i-cut all and delete first sign
   
      
    
  }