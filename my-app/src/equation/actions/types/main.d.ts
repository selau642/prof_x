import type { interaction } from '../interaction'

export interface Tree{
    name: string
    type: string
    list: Array<string>
    parentNode: Tree
    props: Tree_Props
    full_name: string
    [tree_name:string]: string | Array<string> | Tree | Function | Tree_Props 
    checkDot?(): void
    updateProps?(): void
    renderFraction?(): void // Fraction
}

interface Tree_Props{
    arrow_direction?: string    // top
    arrow_type?: string         // top_red
    selected?: boolean          // true/false
    show_arrow?: boolean        // true/false
    sign?: "+" | "-" | false | undefined 
    sub_formula?: string          // +abc
    contain_fraction: boolean     // has fraction in child tree?
    text?: string
    from?: string
    eq?: Eq
}
interface Eq {
    name: string // eq_1, eq_2
}

type Grid_Direction = 'top_left' 
    | 'top'
    | 'top_right'
    | 'left'
    | 'right'
    | 'bottom_left'
    | 'bottom'
    | 'bottom_right'

export interface Border{
    name: string,
    top?: number
    bottom?: number
    right?: number
    left?: number
    direction?: Grid_Direction
    updateUI( In: interaction ): Tree[] | Promise<Tree[]>
    // afterRenderUI?( In: interaction ): void
    svelte_tick?( In: interaction ): void
    // [key: grid_direction ]: Array<any>
}

/** for offset left, right of box to make swap more accurate */
interface Drag_Clone{ 
	height: number //drag clone elem height
	elem_start_x: number
	elem_start_y: number
	mouse_start_x: number
	mouse_start_y: number
	arrow_direction: "top" | "bottom"
}

/** e.g. swap.left, flip.top */
interface Action{
    name: string
    tree_type_list: string[]
    isInContext(In: interaction): boolean
    makeBorder(In: interaction): Border 
}


type Tree_List = Tree[] // for in-br