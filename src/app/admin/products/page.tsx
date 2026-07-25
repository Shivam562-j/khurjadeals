"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types/product";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";

export default function ProductsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenAdd = searchParams.get("add") === "true";

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Pottery & Ceramics");
  const [condition, setCondition] = useState("new");
  const [status, setStatus] = useState("active");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?limit=100"); // fetch all
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    if (shouldOpenAdd) {
      const paramTitle = searchParams.get("title") || "";
      const paramDesc = searchParams.get("description") || "";
      const paramName = searchParams.get("contactName") || "";
      const paramPhone = searchParams.get("contactPhone") || "";

      setEditingId(null);
      setTitle(paramTitle);
      setDescription(paramDesc);
      setCategory("Others");
      setCondition("used");
      setStatus("active");
      setPrice("");
      setLocation("");
      setContactName(paramName);
      setContactPhone(paramPhone);
      setIsFeatured(false);
      setImages([]);
      setIsModalOpen(true);
    }
  }, [shouldOpenAdd, searchParams]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Pottery & Ceramics");
    setCondition("new");
    setStatus("active");
    setPrice("");
    setLocation("");
    setContactName("");
    setContactPhone("");
    setIsFeatured(false);
    setImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingId(prod._id);
    setTitle(prod.title);
    setDescription(prod.description);
    setCategory(prod.category);
    setCondition(prod.condition);
    setStatus(prod.status);
    setPrice(String(prod.price));
    setLocation(prod.location);
    setContactName(prod.contactName);
    setContactPhone(prod.contactPhone);
    setIsFeatured(prod.isFeatured || false);
    setImages(prod.images || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch {}
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const productPayload = {
      title,
      description,
      category,
      condition,
      status,
      price: Number(price),
      location,
      contactName,
      contactPhone,
      isFeatured,
      images,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
        if (shouldOpenAdd) {
          router.push("/admin/products");
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save product");
      }
    } catch {}
    setIsSubmitLoading(false);
  };

  const [category, setCategory] = useState("Bikes & Scooters");

  const categories = [
    { label: "Phones & Mobiles", value: "Phones & Mobiles" },
    { label: "Laptops & Computers", value: "Laptops & Computers" },
    { label: "Bikes & Scooters", value: "Bikes & Scooters" },
    { label: "Cars & Vehicles", value: "Cars & Vehicles" },
    { label: "Electric Vehicles (EV)", value: "Electric Vehicles" },
    { label: "Electrical Appliances (Fridge/AC/Washer)", value: "Electrical Appliances" },
    { label: "Others / General", value: "Others" },
  ];

  const conditionOptions = [
    { label: "Brand New", value: "new" },
    { label: "Pre-owned (Used)", value: "used" },
    { label: "Refurbished", value: "refurbished" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Sold", value: "sold" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Bazaar Products</h1>
          <p className="text-sm text-neutral-450">
            Create, update, or remove used products and vehicles.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : products.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-850 rounded-2xl">
          <p className="text-neutral-400">No products found. Add your first item!</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950/20 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Condition</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/50">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-neutral-950/10">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{prod.title}</div>
                      <span className="text-xs text-neutral-500 font-normal">
                        📍 {prod.location}
                      </span>
                    </td>
                    <td className="py-4 px-6 capitalize">{prod.category}</td>
                    <td className="py-4 px-6 capitalize">{prod.condition}</td>
                    <td className="py-4 px-6 font-bold text-[var(--primary)]">
                      ₹{prod.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        prod.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : prod.status === "sold"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-neutral-800 text-neutral-400"
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-400 px-2 py-1 rounded bg-red-950/10 hover:bg-red-950/30 border border-red-900/10 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Title *"
            placeholder="e.g. Used Honda Shine Bike 2021 Model / EV Scooter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextArea
            label="Description *"
            placeholder="Write product condition highlights and details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category *"
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <Select
              label="Condition *"
              options={conditionOptions}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹) *"
              type="number"
              placeholder="e.g. 450"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Select
              label="Status *"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <Input
            label="Location (General Area) *"
            placeholder="e.g. GT Road, Pottery Market"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name *"
              placeholder="Seller name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Input
              label="Contact Mobile *"
              placeholder="10 digit number"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-350 block">
              Images ({images.length} uploaded)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
            />
            {isUploading && <p className="text-xs text-[var(--primary)] animate-pulse">Uploading images...</p>}

            {/* Previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-12 rounded overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-bl font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded bg-neutral-950 border-neutral-800 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-white">
              Mark as Featured Product
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitLoading}>
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
