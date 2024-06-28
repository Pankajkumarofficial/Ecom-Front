import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import type { CartItem as CartItemType } from "../types/types";

type cartItemProps = {
    cartItem: CartItemType;
    incrementHandler: (cartItem: CartItemType) => void
    decrementHandler: (cartItem: CartItemType) => void
    removeHandler: (id: string) => void
}

const CartItem = ({ cartItem, incrementHandler, decrementHandler, removeHandler }: cartItemProps) => {
    const { photo, productId, name, quantity, price } = cartItem;

    return (
        <>
            <div className="cart-item">
                <img src={`${server}/${photo}`} alt={name} />
                <article>
                    <Link to={`/product/${productId}`}>{name}</Link>
                    <span>${price}</span>
                </article>
                <div>
                    <button onClick={() => decrementHandler(cartItem)}>-</button>
                    <p>{quantity}</p>
                    <button onClick={() => incrementHandler(cartItem)}>+</button>
                </div>
                <button onClick={() => removeHandler(productId)}>
                    <FaTrash />
                </button>
            </div>
        </>
    )
}

export default CartItem