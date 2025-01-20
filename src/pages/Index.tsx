import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import InvoicePDF from "@/components/InvoicePDF";
import { toast } from "sonner";

interface InvoiceItem {
  name: string;
  cost: number;
  quantity: number;
}

const Index = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState<InvoiceItem>({
    name: "",
    cost: 0,
    quantity: 1,
  });
  const [invoiceDate, setInvoiceDate] = useState<Date>();
  const [shootDate, setShootDate] = useState<Date>();
  const [clientName, setClientName] = useState("");

  const handleAddItem = () => {
    if (!currentItem.name || currentItem.cost <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    setItems([...items, currentItem]);
    setCurrentItem({ name: "", cost: 0, quantity: 1 });
    toast.success("Item added successfully");
  };

  const total = items.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900 text-center">Invoice Generator</h1>
          
          {/* Client Name Input */}
          <div className="space-y-1">
            <label htmlFor="client-name" className="text-sm font-medium text-gray-700">
              Client Name
            </label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              className="w-full"
            />
          </div>
          
          {/* Input Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <div className="space-y-1">
              <label htmlFor="item-name" className="text-sm font-medium text-gray-700">
                Item Name
              </label>
              <Input
                id="item-name"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Equipment name"
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="item-cost" className="text-sm font-medium text-gray-700">
                Cost
              </label>
              <Input
                id="item-cost"
                type="number"
                value={currentItem.cost || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, cost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="item-quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <Input
                id="item-quantity"
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full"
              />
            </div>
          </div>
          
          <Button onClick={handleAddItem} className="w-full">
            Add Item
          </Button>

          {/* Items List */}
          {items.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900">{item.name}</span>
                    <div className="flex space-x-4">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-gray-900">${(item.cost * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-gray-100 rounded-md font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Date Pickers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Invoice Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !invoiceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={setInvoiceDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Shoot Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !shootDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shootDate ? format(shootDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={shootDate}
                    onSelect={setShootDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Generate PDF Button */}
          <InvoicePDF
            items={items}
            total={total}
            invoiceDate={invoiceDate}
            shootDate={shootDate}
            clientName={clientName}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;