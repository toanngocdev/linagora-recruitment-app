import axios from "axios";
import { UserServices } from "@/services";
import { PurchaseTypes, UserTypes } from "@/types";

interface ResponsePurchase {
  purchases: PurchaseTypes.Purchase[];
}

interface ResponseProduct {
  products: PurchaseTypes.Product[];
}

interface NewUserPurchase extends PurchaseTypes.Purchase {
  totalPurchases: number;
  product: PurchaseTypes.Product | null;
}

export const getPurchaseByUser = async (
  username: string
): Promise<PurchaseTypes.Purchase[] | undefined> => {
  try {
    const response = await axios.get<ResponsePurchase | undefined>(
      `purchases/by_user/${username}`
    );

    if (response && response.data) return response.data.purchases;

    return Promise.reject();
  } catch (error) {
    console.error(error);
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get<ResponseProduct | undefined>(`products`);

    if (response && response.data) return response.data.products;

    return Promise.reject();
  } catch (error) {
    console.error(error);
  }
};

export const getTopFiveProducts = async (username: string) => {
  const users = await fetchUsers();
  const listProductIds = await getPurchasedProductIds(users);
  const sortedPopularProducts = await getSortedPopularProducts(
    listProductIds,
    username
  );

  return sortedPopularProducts;
};

const fetchUsers = async (): Promise<UserTypes.User[]> => {
  const users = await UserServices.getUsers();

  if (!users) {
    return [];
  }

  return users;
};

const fetchPurchasesByUser = async (
  username: string
): Promise<PurchaseTypes.Purchase[]> => {
  const purchases = await getPurchaseByUser(username);

  if (!purchases) return [];

  return purchases;
};

const getPurchasedProductIds = async (
  users: UserTypes.User[]
): Promise<number[]> => {
  const purchasePromises: any[] = [];
  const listProductIds: number[] = [];

  users.forEach((u) => {
    purchasePromises.push(fetchPurchasesByUser(u.username));
  });

  const responsePurchase = await Promise.all<PurchaseTypes.Purchase[][]>(
    purchasePromises
  );

  if (!responsePurchase) return [];

  responsePurchase.forEach((purchases) => {
    purchases.forEach((p) => {
      listProductIds.push(p.productId);
    });
  });

  return listProductIds;
};

const getSortedPopularProducts = async (
  listProductIds: number[],
  username: string
): Promise<NewUserPurchase[]> => {
  const countProducts: { [key: string]: number } = {};

  listProductIds.forEach((l) => {
    countProducts[l] = countProducts[l] ? (countProducts[l] += 1) : 1;
  });

  const currentUserPurchases = await fetchPurchasesByUser(username);

  const products = await getProducts();

  const mappedUserPurchases = currentUserPurchases.map((purchase) => {
    return {
      ...purchase,
      totalPurchases: countProducts[purchase.productId],
      product:
        products?.find((p) => {
          return p.id === purchase.productId;
        }) || null
    };
  });

  const sortedUserPurchases = mappedUserPurchases.sort(
    (a, b) => b.totalPurchases - a.totalPurchases
  );

  return sortedUserPurchases;
};
