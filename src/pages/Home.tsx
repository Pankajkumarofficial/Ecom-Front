import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skelton } from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem): string | undefined => {
    if (cartItem.stock < 1) {
      return toast.error("Out of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Item Added To Cart Successfully")
  };

  if (isError) {
    toast.error("Cannot Fetch the Products");
  }

  return (
    <>
      <div className="home">
        <section></section>
        <h1>
          Latest Products
          <Link to={"/search"} className="findmore">
            More
          </Link>
        </h1>
        <main>
          {isLoading ? (
            <Skelton width="80vw" />
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i.name}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photo={i.photo}
                handler={addToCartHandler}
              />
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
