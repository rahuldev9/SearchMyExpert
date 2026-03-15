import { useState } from "react";
import { createPortal } from "react-dom";
import PayButton from "@/components/PayButton";
import CashFree from "@/components/CashFreePay";
import { CreditCard, Wallet, X, Loader2 } from "lucide-react";

const PaymentOptions = ({ project }: { project: any }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  if (project.paymentStatus !== "PENDING") return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Pay Now
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              className="bg-white w-[90%] sm:w-[420px] md:w-[500px] lg:w-[560px] 
max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  Select Payment
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Payment Options */}
              <div className="flex flex-col gap-4">
                {/* Online Payment */}
                {selected !== "cashfree" && (
                  <div
                    onClick={() => setSelected("stripe")}
                    className={`border rounded-xl p-4 sm:p-5 flex items-center gap-4 transition
        ${
          selected === "stripe"
            ? "border-blue-500 shadow-md"
            : "hover:border-blue-500 hover:shadow-md cursor-pointer"
        }`}
                  >
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <CreditCard className="text-blue-600" size={22} />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base">
                        Pay Online
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        UPI / Card / Netbanking
                      </span>
                    </div>

                    <div className="ml-auto">
                      {selected === "stripe" ? (
                        <Loader2
                          className="animate-spin text-blue-500"
                          size={22}
                        />
                      ) : (
                        <PayButton project={project} />
                      )}
                    </div>
                  </div>
                )}

                {/* Cashfree */}
                {selected !== "stripe" && (
                  <div
                    onClick={() => setSelected("cashfree")}
                    className={`border rounded-xl p-4 sm:p-5 flex items-center gap-4 transition
        ${
          selected === "cashfree"
            ? "border-green-500 shadow-md"
            : "hover:border-green-500 hover:shadow-md cursor-pointer"
        }`}
                  >
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Wallet className="text-green-600" size={22} />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base">
                        Cashfree
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        Secure gateway payment
                      </span>
                    </div>

                    <div className="ml-auto">
                      {selected === "cashfree" ? (
                        <Loader2
                          className="animate-spin text-green-500"
                          size={22}
                        />
                      ) : (
                        <CashFree project={project} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cancel */}
              <button
                onClick={() => setOpen(false)}
                className="w-full mt-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default PaymentOptions;
