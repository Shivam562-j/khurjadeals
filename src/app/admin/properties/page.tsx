"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Property } from "@/types/property";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";

export default function PropertiesManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenAdd = searchParams.get("add") === "true";

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("residential");
  const [listingType, setListingType] = useState("sell");
  const [status, setStatus] = useState("active");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/properties?limit=100"); // fetch all for list
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
    if (shouldOpenAdd) {
      const paramTitle = searchParams.get("title") || "";
      const paramDesc = searchParams.get("description") || "";
      const paramName = searchParams.get("contactName") || "";
      const paramPhone = searchParams.get("contactPhone") || "";

      setEditingId(null);
      setTitle(paramTitle);
      setDescription(paramDesc);
      setType("residential");
      setListingType("sell");
      setStatus("active");
      setPrice("");
      setArea("");
      setAreaUnit("sqft");
      setLocation("");
      setAddress("");
      setContactName(paramName);
      setContactPhone(paramPhone);
      setIsFeatured(false);
      setFeatures("");
      setImages([]);
      setIsModalOpen(true);
    }
  }, [shouldOpenAdd, searchParams]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setType("residential");
    setListingType("sell");
    setStatus("active");
    setPrice("");
    setArea("");
    setAreaUnit("sqft");
    setLocation("");
    setAddress("");
    setContactName("");
    setContactPhone("");
    setIsFeatured(false);
    setFeatures("");
    setImages([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingId(prop._id);
    setTitle(prop.title);
    setDescription(prop.description);
    setType(prop.type);
    setListingType(prop.listingType);
    setStatus(prop.status);
    setPrice(String(prop.price));
    setArea(String(prop.area));
    setAreaUnit(prop.areaUnit);
    setLocation(prop.location);
    setAddress(prop.address || "");
    setContactName(prop.contactName);
    setContactPhone(prop.contactPhone);
    setIsFeatured(prop.isFeatured || false);
    setFeatures(prop.features ? prop.features.join(", ") : "");
    setImages(prop.images || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(properties.filter((p) => p._id !== id));
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

    const propertyPayload = {
      title,
      description,
      type,
      listingType,
      status,
      price: Number(price),
      area: Number(area),
      areaUnit,
      location,
      address,
      contactName,
      contactPhone,
      isFeatured,
      features: features.split(",").map((f) => f.trim()).filter(Boolean),
      images,
    };

    try {
      const url = editingId ? `/api/properties/${editingId}` : "/api/properties";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProperties();
        // remove URL query parameter if present
        if (shouldOpenAdd) {
          router.push("/admin/properties");
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save property");
      }
    } catch {}
    setIsSubmitLoading(false);
  };

  const typeOptions = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Plot", value: "plot" },
    { label: "Agricultural", value: "agricultural" },
  ];

  const listingOptions = [
    { label: "Sell", value: "sell" },
    { label: "Rent", value: "rent" },
    { label: "Lease", value: "lease" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Sold", value: "sold" },
    { label: "Rented", value: "rented" },
    { label: "Inactive", value: "inactive" },
  ];

  const areaUnitOptions = [
    { label: "Sq. Ft", value: "sqft" },
    { label: "Sq. Yard", value: "sqyd" },
    { label: "Acre", value: "acre" },
    { label: "Bigha", value: "bigha" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Properties</h1>
          <p className="text-sm text-neutral-450">
            Create, update, or remove real estate listings.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">
          Add Property
        </Button>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : properties.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-850 rounded-2xl">
          <p className="text-neutral-400">No properties found. Add your first listing!</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950/20 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Property</th>
                  <th className="py-4 px-6">Type / Purpose</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Area</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/50">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-neutral-950/10">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{prop.title}</div>
                      <span className="text-xs text-neutral-500 font-normal">
                        📍 {prop.location}
                      </span>
                    </td>
                    <td className="py-4 px-6 capitalize">
                      {prop.type} · <span className="font-semibold text-xs">{prop.listingType}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[var(--primary)]">
                      ₹{prop.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      {prop.area} {prop.areaUnit}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        prop.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : prop.status === "sold" || prop.status === "rented"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-neutral-800 text-neutral-400"
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prop._id)}
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
        title={editingId ? "Edit Property" : "Add Property"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Property Title *"
            placeholder="e.g. 100 Gaj Commercial Shop on G.T. Road"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextArea
            label="Description *"
            placeholder="Describe the property highlights..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property Type *"
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <Select
              label="Purpose *"
              options={listingOptions}
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asking Price (₹) *"
              type="number"
              placeholder="e.g. 1800000"
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Area (Size) *"
              type="number"
              placeholder="e.g. 100"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
            <Select
              label="Area Unit *"
              options={areaUnitOptions}
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              required
            />
          </div>

          <Input
            label="Location (General Area) *"
            placeholder="e.g. GT Road, near Junction"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <Input
            label="Exact Address"
            placeholder="e.g. Shop 14, Main Bazaar Road, Khurja"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name *"
              placeholder="Owner or Agent name"
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

          <Input
            label="Features / Amenities"
            placeholder="Separated by comma, e.g. Water supply, Parking, Main Road face"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />

          {/* Image Upload field */}
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
            {isUploading && <p className="text-xs text-[var(--primary)] animate-pulse">Uploading images to Cloudinary...</p>}

            {/* Uploaded previews */}
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
              Mark as Featured Listing
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
              Save Property
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
