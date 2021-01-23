// import { stopDragSelect } from './clone_stores.js'


export function x_drag(node) {
		
	let x;
	let y;

	node.addEventListener('mousedown', handleMousedown);
	
	function handleMousedown(event)
	{
		// stopDragSelect.update( state => 'x_drag' )

		x = event.clientX;
		y = event.clientY;
		
		node.dispatchEvent(new CustomEvent('x_drag_start', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}
	
	function handleMousemove(event)
	{
		const dx = event.clientX - x;
		const dy = event.clientY - y;
	
		x = event.clientX;
		y = event.clientY;
		
		node.dispatchEvent(new CustomEvent('x_drag_move', {
			detail: { x, y, dx, dy }
		}));
	}
	

	function handleMouseup(event)
	{

		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('x_drag_end', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);

	}



	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}

