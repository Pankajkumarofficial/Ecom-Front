import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skelton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation, } from "../../../redux/api/productApi";
import { server } from "../../../redux/store";
import { userReducerInitialState } from "../../../types/reducer-types";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [categoryUpdate, setCategoryUpdate] = useState<string>("");
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data && data.products) {
      setNameUpdate(data.products.name);
      setPriceUpdate(data.products.price);
      setStockUpdate(data.products.stock);
      setCategoryUpdate(data.products.category);
      setPhotoUpdate(data.products.photo);
    }
  }, [data]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data || !data.products) return;

    const formData = new FormData();

    formData.set("name", nameUpdate);
    formData.set("price", priceUpdate.toString());
    formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    formData.set("category", categoryUpdate);

    const res = await updateProduct({
      formData,
      userId: user?._id!,
      productId: data.products._id,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    if (!data || !data.products) return;

    const res = await deleteProduct({
      userId: user?._id!,
      productId: data.products._id,
    });

    responseToast(res, navigate, "/admin/product");
  };

  if (isError) return <Navigate to={"/404"} />;

  console.log('isLoading:', isLoading);
  console.log('data:', data);
  console.log('isError:', isError);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skelton length={20} />
        ) : (
          data && data.products && (
            <>
              <section>
                <strong>ID - {data.products._id}</strong>
                <img src={`${server}/${photoUpdate}`} alt="Product" />
                <p>{nameUpdate}</p>
                {stockUpdate > 0 ? (
                  <span className="green">{stockUpdate} Available</span>
                ) : (
                  <span className="red"> Not Available</span>
                )}
                <h3>₹{priceUpdate}</h3>
              </section>
              <article>
                <button className="product-delete-btn" onClick={deleteHandler}>
                  <FaTrash />
                </button>
                <form onSubmit={submitHandler}>
                  <h2>Manage</h2>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={nameUpdate}
                      onChange={(e) => setNameUpdate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={priceUpdate}
                      onChange={(e) => setPriceUpdate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="eg. laptop, camera etc"
                      value={categoryUpdate}
                      onChange={(e) => setCategoryUpdate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Photo</label>
                    <input type="file" onChange={changeImageHandler} />
                  </div>

                  {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                  <button type="submit">Update</button>
                </form>
              </article>
            </>
          )
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
