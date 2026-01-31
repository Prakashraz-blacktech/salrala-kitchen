/* eslint-disable @typescript-eslint/no-explicit-any */

import "nepali-datepicker-reactjs/dist/index.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, LogOut, Save, X, Grid } from "lucide-react";
import { DhaiImage, MasuImage, OmletImage } from "@/assets";
import { createKhana } from "@/database/service/add-khana.service";
import useAuth from "@/hooks/useAuth";
import { ADToBS } from "bikram-sambat-js";
import { SuccessDialog } from "./khana-added";
import { Link, useNavigate } from "react-router";

interface AddOn {
  name: string;
  price: number;
  image: string;
}

const addOns: AddOn[] = [
  { name: "Dhai", price: 40, image: DhaiImage },
  { name: "Omlet", price: 25, image: OmletImage },
  { name: "Masu", price: 120, image: MasuImage },
];

export default function AddMealScreen() {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const { currentUser, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const [selectedAddOns, setSelectedAddOns] = useState<
    { name: string; price: number; quantity: number }[]
  >([]);

  const [addOtherItem, setAddOtherItem] = useState<{
    name: string;
    price: number;
  }>({
    name: "",
    price: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleAddOn = (name: string) => {
    const existingItem = selectedAddOns.find((item) => item.name === name);

    if (existingItem) {
      // Update existing item by incrementing quantity
      setSelectedAddOns((prev) =>
        prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setSelectedAddOns((prev) => [
        ...prev,
        {
          name: name,
          price: addOns.find((a) => a.name === name)?.price || 0,
          quantity: 1,
        },
      ]);
    }
  };

  const handleAddCustomItem = () => {
    if (addOtherItem.name.trim() && addOtherItem.price > 0) {
      setSelectedAddOns((prev) => [
        ...prev,
        {
          name: addOtherItem.name.trim(),
          price: addOtherItem.price,
          quantity: 1,
        },
      ]);
      // Clear the form
      setAddOtherItem({ name: "", price: 0 });
      setShowCustomInput(false);
      setIsModalOpen(false);
    }
  };

  const removeSelectedItem = (itemName: string) => {
    setSelectedAddOns((prev) => prev.filter((item) => item.name !== itemName));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    if (currentUser?.id && !isLoading) {
      await createKhana({
        userId: currentUser?.id,
        quantity,
        addOns: selectedAddOns,
      }).then((res: any) => {
        if (res?.success) {
          setIsSubmitting(false);
          setIsModalOpen(false);
          setSelectedAddOns([]);
          setIsSuccessDialogOpen(true);
        }
      });
    }
    setIsSubmitting(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setShowCustomInput(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowCustomInput(false);
    setAddOtherItem({ name: "", price: 0 });
  };


  return (
    <div className="min-h-screen flex overflow-hidden justify-center items-center">
      <div className="w-full px-4 max-w-sm">
        <div className="p-4 space-y-6">
          <div className="text-center">
            <p className="text-center mb-2 text-sm text-green-700">
              today: {ADToBS(new Date())}
            </p>
            <h1 className="text-2xl font-bold text-green-600">
              Hi 👋 <br />
              {currentUser?.fullName}
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-green-600">
              Number of Meals
            </h2>
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5 text-gray-600" />
              </Button>

              <span className="text-4xl font-bold text-green-600 min-w-[3rem] text-center">
                {quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-green-600">Add Ons</h2>
              <Button
                size={"sm"}
                className="bg-green-600 hover:bg-green-700 p-0 text-white rounded-md"
                onClick={handleModalOpen}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {selectedAddOns.length === 0 ? (
              <p className="text-gray-500 text-center italic">
                No additional items added
              </p>
            ) : (
              <div className="space-y-2">
                {selectedAddOns.map((item) => {
                  const addOn = addOns.find((a) => a.name === item.name);
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {addOn ? (
                          <img
                            src={addOn?.image}
                            alt={addOn.name}
                            className="w-12 h-12"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold text-xs">
                              CUSTOM
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.quantity > 1 && (
                            <span className="text-sm text-gray-600 ml-2">
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-700">
                          Rs.{item.price * item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/20 text-red-600 bg-transparent"
                          onClick={() => removeSelectedItem(item.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>

          <div className="flex gap-3 pt-2">
            <Link
              to={"/me"}
              className="flex justify-center items-center h-12 border-2 border-purple-200 px-2 text-purple-600 hover:bg-purple-50 rounded-xl bg-transparent"
            >
              <Grid className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Button
            
              variant="outline"
              className="flex-1 h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
              onClick={() => {
                localStorage.removeItem("new-sarala");
                navigate("/")
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200 bg-white overflow-scroll rounded-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-green-600">
                  {showCustomInput ? "Add Custom Item" : "Add Items"}
                </h3>
                {!showCustomInput && (
                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={() => setShowCustomInput(true)}
                  >
                    Add Extra Item
                  </Button>
                )}
              </div>

              {!showCustomInput ? (
                <>
                  <div className="space-y-3">
                    {addOns.map((addOn) => (
                      <button
                        key={addOn.name}
                        onClick={() => toggleAddOn(addOn.name)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                          selectedAddOns.some(
                            (item) => item.name === addOn.name
                          )
                            ? "bg-green-500 text-white shadow-lg transform scale-105"
                            : "bg-white/90 border backdrop-blur-sm text-gray-900 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={addOn.image || "/placeholder.svg"}
                              alt={addOn.name}
                              className="w-12 h-12"
                            />
                            <div>
                              <span className="font-medium">{addOn.name}</span>
                              {(selectedAddOns?.find(
                                (item) => item.name === addOn.name
                              )?.quantity || 0) > 1 && (
                                <span
                                  className={`text-sm ml-2 ${
                                    selectedAddOns.some(
                                      (item) => item.name === addOn.name
                                    )
                                      ? "text-white"
                                      : "text-gray-600"
                                  }`}
                                >
                                  x
                                  {selectedAddOns.find(
                                    (item) => item.name === addOn.name
                                  )?.quantity || 0}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`font-semibold ${
                              selectedAddOns.some(
                                (item) => item.name === addOn.name
                              )
                                ? "text-white"
                                : "text-green-600"
                            }`}
                          >
                            Rs.{addOn.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={handleModalClose}
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white border-0"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleModalClose}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0"
                    >
                      Done
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={addOtherItem.name}
                        onChange={(e) =>
                          setAddOtherItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter item name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (Rs.)
                      </label>
                      <input
                        type="number"
                        value={addOtherItem.price || ""}
                        onChange={(e) =>
                          setAddOtherItem((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="Enter amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCustomInput(false);
                        setAddOtherItem({ name: "", price: 0 });
                      }}
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white border-0"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddCustomItem}
                      disabled={
                        !addOtherItem.name.trim() || addOtherItem.price <= 0
                      }
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Done
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
      />
    </div>
  );
}
