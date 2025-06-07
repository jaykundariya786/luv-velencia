
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { useSizeGuide } from "@/hooks/use-size-guide";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: "mens" | "womens";
}

export default function SizeGuideModal({ isOpen, onClose, category = "mens" }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState("bottoms");
  const { data: sizeGuideData, isLoading, error } = useSizeGuide(category);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          <div className="p-8 text-center">Loading size guide...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          <div className="p-8 text-center text-red-600">Failed to load size guide</div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentData = sizeGuideData?.sizeData;
  const measuringTips = sizeGuideData?.measuringTips;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-8 pb-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-medium uppercase tracking-[0.2em] text-center w-full">
                {category.toUpperCase()}'S READY-TO-WEAR
              </DialogTitle>
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
                The size charts display sizes based on body measurements. Use our measuring tips and 
                refer to the sketches below to determine your size.
              </p>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="bottoms" 
                  className="uppercase text-sm tracking-[0.1em] font-medium py-4 px-6 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none bg-transparent text-gray-600 data-[state=active]:text-black"
                >
                  Bottoms
                </TabsTrigger>
                <TabsTrigger 
                  value="tops" 
                  className="uppercase text-sm tracking-[0.1em] font-medium py-4 px-6 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none bg-transparent text-gray-600 data-[state=active]:text-black"
                >
                  Tops
                </TabsTrigger>
                <TabsTrigger 
                  value="measuring" 
                  className="uppercase text-sm tracking-[0.1em] font-medium py-4 px-6 border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent rounded-none bg-transparent text-gray-600 data-[state=active]:text-black"
                >
                  Measuring Tips
                </TabsTrigger>
              </TabsList>

              {/* Bottoms Tab */}
              <TabsContent value="bottoms" className="mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">Size</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">IT</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">US</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">Jeans</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">
                          Waist<br />
                          <span className="text-gray-500 normal-case">(CM/IN)</span>
                        </th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">
                          Hips<br />
                          <span className="text-gray-500 normal-case">(CM/IN)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.bottoms.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-black">{row.size}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.it}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.us}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.jeans}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.waist}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Tops Tab */}
              <TabsContent value="tops" className="mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">Size</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">IT</th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">
                          Shoulders<br />
                          <span className="text-gray-500 normal-case">(CM/IN)</span>
                        </th>
                        <th className="text-center py-4 px-4 font-medium uppercase text-xs tracking-[0.1em] text-gray-700">
                          Chest<br />
                          <span className="text-gray-500 normal-case">(CM/IN)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.tops.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-black">{row.size}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.it}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.shoulders}</td>
                          <td className="py-4 px-4 text-center text-gray-700">{row.chest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Measuring Tips Tab */}
              <TabsContent value="measuring" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4 uppercase text-sm tracking-[0.1em] text-black">General Tips</h3>
                    <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                      {measuringTips.general.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-gray-400">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4 uppercase text-sm tracking-[0.1em] text-black">How to Measure</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3 text-black">For Bottoms:</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {measuringTips.bottoms.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-gray-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3 text-black">For Tops:</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {measuringTips.tops.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-gray-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
