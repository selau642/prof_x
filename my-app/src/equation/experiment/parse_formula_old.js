
// structure
// 1. eq-bx-i-( sign | sym | num | br | fr )
// 2. fr-( top | bot )
// 2. ( top | bot |br )-eq

// let pointer_position = {
//     eq:{         
//         next:'i',      // eq-bx-[i]-?
//         prev: []        
//     },
//     open_bracket: { 
//         next:'i',      // bx-(i)-br-bx-[i]-?
//         prev: ['sign',         
//             // -( 
//             // bx-[(i)]-sign, bx-(i)-br-bx-[i]-?
//             'symbol','number', 
//             // a(, 3(, 
//             // ([bx])-i-sym, (bx)-i-br-bx-[i]-?
//             'eq',              
//             // eq-bx-[(i)],  eq-bx-(i)-br-bx-[i]-?
//             'open_bracket',
//             // ( (               
//             // br-bx-[(i)], br-bx-(i)-br-bx-[i]
//             'divide',                     
//             // / (
//             // bot-bx-[(i)], bot-bx-(i)-br-bx-[i] 
//             'multiply',                   
//             // * (
//             // bx-[(i)], bx-(i)-br-bx-[i]
//             'close_bracket'               
//             // ) (
//             // [(bx)]-i-br, (bx)-i-br-bx-[i] 
//             ],
//         },
//     close_bracket: {
//         next:'bx',    // p-[bx]-i-br-c
//         prev: [
//             'symbol', 'number', 
//             // a), 3)
//             // br-[(bx)]-i-sym|num, [bx]-i-br-(bx)-i-sym|num 
//             'open_bracket',
//             // ()
//             // bx-i-(br)-bx-[i]-?, [bx]-i-(br)-bx-i-?
//             'close_bracket',
//             // ))
//             // br-[(bx)]-i-br-bx-i, [bx]-i-br-(bx)-i-br-bx-i
//             ]
//         },
//     sign: {
//         next: 'i',              // bx-[i]-sign
//         prev: [
//             'eq',
//             // eq-bx-[i], eq-bx-<[i]>-sign
//             'open_bracket',
//             // )(
//             // [bx]-i-br, [bx]-i-br-bx-[i]-sign
//             'close_bracket',
//             // )-
//             // [bx]-i-br, new bx, (eq)-bx-<i>-sign
//             'symbol', 'number',
//             // a-, 3-
//             // [bx]-i-sym, new bx, eq-(bx)-<i>-sign
//             'multiply'
//             // *-
//             // bx-[i]-?, bx-[i]-sign    
//         ]
//         },
//     symbol:{ 
//         next: 'bx',            // [bx]-i-sym
//         prev: [ 
//                 'eq',
//                 // eq-bx-[i]-?, eq-<bx>-[i]-sym 
//                 'open_bracket',
//                 // (a
//                 // br-bx-[i]-?, br-<bx>-[i]-sym
//                 'close_bracket',
//                 // )a
//                 // [bx]-br, [bx]-i-sym
//                 'sign',
//                 // -a
//                 // [bx]-i-sign, [bx]-i-sym              
//                 'symbol', 'number',
//                 // 3a, ba
//                 // [bx]-i-(sym|num), [bx]-i-sym
//             ]
//         },
//     number:{
//         next: 'bx',            // [bx]-i-num
//         prev: [ 
//                 'eq',
//                 // eq-bx-[i]-?, eq-<bx>-[i]-num 
//                 'open_bracket',
//                 // (3
//                 // br-bx-[i]-?, br-<bx>-[i]-num
//                 'close_bracket',
//                 // )3
//                 // [bx]-br, [bx]-i-num
//                 'sign',
//                 // -3
//                 // [bx]-i-sign, [bx]-i-num              
//                 'symbol', 'number',
//                 // 23, b3
//                 // [bx]-i-(sym|num), [bx]-i-num
//             ]
//         },
    
//     multiply: {
//         end: 'i',          // bx-[i]-?
//         prev:[
//                'close_bracket',
//                // )*
//                // [bx]-i-br, [bx]-<i>-?
//                'symbol', 'number',
//                // a*, 3*
//                // [bx]-i-num, [bx]-<i>-?
//             ]
//         },
//     divide: {
//         end:'i', // bot-bx-[i]-?
//         prev:[
//             'open_bracket',
//             // )/
//             // bx-i-(br)-bx-[i], bx-i-(fr)-bot-bx-[i]-?
//             'symbol', 'number'
//             // a/, 3/
//             // bx-i-(sym|num), bx-i-(fr)-bot-bx-[i]-?
//         ]
//         },           
// }