import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";

const OrderContext = createContext();
export const useOrdercontext = () => {
  return useContext(OrderContext);
};

export const OrderContextProvider = ({ children }) => {
  const [orders, setorders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        onSnapshot(collection(db, "order"), (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setorders([...list]);
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const memodata = useMemo(() => orders, [orders]);

  const updateData = (updatedProduct) => {
    if (typeof updatedProduct === "object" && updatedProduct.id) {
      setorders((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === updatedProduct.id
        );

        if (existingProductIndex !== -1) {
          const newData = [...prevData];
          newData[existingProductIndex] = {
            ...newData[existingProductIndex],
            ...updatedProduct,
          };
          return newData;
        } else {
          return [...prevData, updatedProduct];
        }
      });
    } else if (Array.isArray(updatedProduct)) {
      setorders(updatedProduct);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <OrderContext.Provider value={{ orders: memodata, updateData }}>
      {children}
    </OrderContext.Provider>
  );
};
