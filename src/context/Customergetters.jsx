import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useMemo } from "react";

const CustomersContext = createContext();

export const useCustomerContext = () => {
    return useContext(CustomersContext);
}

export const CustomersProvider = ({ children }) => {
    const [customer, setCustomer] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const q = query(collection(db, 'customers'), where('is_customer', '==', true));
                const querySnapshot = await getDocs(q);
                const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomer(list);
                setIsDataFetched(true);
            } catch (error) {
                console.log(error);
            }
        };

        if (!isDataFetched) {
            fetchCustomer();
        }
    }, [isDataFetched]);
    // Log the customer state when it changes

    const memoizedData = useMemo(() => customer, [customer]);

    return (
        <CustomersContext.Provider value={{ customer: memoizedData }}>
            {children}
        </CustomersContext.Provider>
    );
};
