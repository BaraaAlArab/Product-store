import {create} from "zustand";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({products}),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return {success: false, message: "Please fill all the fields.."};
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to create product",
        };
      }
      set((state) => ({products: [...state.products, data.data]}));
      return {success: true, message: "product created"};
    } catch {
      return {
        success: false,
        message: "An error occurred while creating the product.",
      };
    }
  },
  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products", {cache: "no-store"});
      const data = await res.json();
      if (res.ok && data.success) {
        set({products: data.data});
      }
    } catch {
      console.error("Failed to fetch products:");
    }
  },
  DeleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to delete product",
        };
      }
      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return {success: true, message: "Product deleted"};
    } catch {
      return {
        success: false,
        message: "An error occurred while deleting the product.",
      };
    }
  },
  UpdateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Failed to update product",
        };
      }
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? {...product, ...updatedProduct} : product,
        ),
      }));
      return {success: true, message: "Product updated"};
    } catch {
      return {
        success: false,
        message: "An error occurred while updating the product.",
      };
    }
  },
}));
