import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const ServiceContext = createContext();

export const UseServiceContext = () => {
  return useContext(ServiceContext);
};

export const ServiceContextProvider = ({ children }) => {
  const [ServiceData, SetServiceData] = useState([]);
  useEffect(() => {
    const fetchservice = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "ServiceAreas"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        SetServiceData([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchservice();
  }, []);

  const memodata = useMemo(() => ServiceData, [ServiceData]);

  // update data function
  const updateServiceData = (servicesdatas) => {
    if (typeof servicesdatas === "object" && servicesdatas.id) {
      SetServiceData((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === servicesdatas.id
        );
        if (existingProductIndex !== -1) {
          const newData = [...prevData];
          newData[existingProductIndex] = {
            ...newData[existingProductIndex],
            ...servicesdatas,
          };
          return newData;
        } else {
          return [...prevData, servicesdatas];
        }
      });
    } else if (Array.isArray(servicesdatas)) {
      // Update the entire array
      SetServiceData(servicesdatas);
    }
  };

  // Function to add new data
  const addServiceData = async (servicesdatas) => {
    try {
      updateServiceData(servicesdatas);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete data
  const deleteServiceData = async (servicesdataid) => {
    try {
      SetServiceData((prevData) =>
        prevData.filter((servicedata) => servicedata.id !== servicesdataid)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        ServiceData: memodata,
        updateServiceData,
        deleteServiceData,
        addServiceData,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
