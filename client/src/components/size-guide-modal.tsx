
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: "mens" | "womens";
}

export default function SizeGuideModal({ isOpen, onClose, category = "mens" }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState("bottoms");

  const sizeData = {
    mens: {
      bottoms: [
        { size: "XXS", it: "42", us: "26", jeans: "26-29", waist: "67/26.4", hips: "87/34.2" },
        { size: "XS", it: "44", us: "30", jeans: "30-31", waist: "71/28", hips: "91/35.8" },
        { size: "S", it: "46", us: "32", jeans: "32-33", waist: "75/29.5", hips: "95/37.4" },
        { size: "M", it: "48", us: "34", jeans: "34-35", waist: "79/31.1", hips: "99/39" },
        { size: "L", it: "50", us: "36", jeans: "36-37", waist: "83/32.7", hips: "103/40.5" },
        { size: "XL", it: "52", us: "38", jeans: "38-39", waist: "87/34.2", hips: "107/42.1" },
        { size: "XXL", it: "54", us: "40", jeans: "40-41", waist: "91/35.8", hips: "111/43.7" },
        { size: "XXXL", it: "56", us: "42", jeans: "42-43", waist: "95/37.4", hips: "115/45.3" },
        { size: "-", it: "58", us: "44", jeans: "44-45", waist: "99/39", hips: "119/46.8" },
        { size: "-", it: "60", us: "46", jeans: "46", waist: "103/40.5", hips: "123/48.4" },
        { size: "-", it: "62", us: "48", jeans: "-", waist: "107/42.1", hips: "127/50" },
        { size: "-", it: "64", us: "50", jeans: "-", waist: "111/43.7", hips: "131/51.6" },
      ],
      tops: [
        { size: "XXS", it: "42", shoulders: "44/17.3", chest: "86/33.8" },
        { size: "XS", it: "44", shoulders: "45/17.7", chest: "90/35.4" },
        { size: "S", it: "46", shoulders: "46/18.1", chest: "94/37" },
        { size: "M", it: "48", shoulders: "47/18.5", chest: "98/38.6" },
        { size: "L", it: "50", shoulders: "48/18.9", chest: "102/40.2" },
        { size: "XL", it: "52", shoulders: "49/19.3", chest: "106/41.7" },
        { size: "XXL", it: "54", shoulders: "50/19.7", chest: "110/43.3" },
        { size: "XXXL", it: "56", shoulders: "51/20.1", chest: "114/44.9" },
        { size: "-", it: "58", shoulders: "52/20.5", chest: "118/46.5" },
        { size: "-", it: "60", shoulders: "53/20.9", chest: "122/48" },
        { size: "-", it: "62", shoulders: "54/21.3", chest: "126/49.6" },
        { size: "-", it: "64", shoulders: "55/21.6", chest: "130/51.1" },
      ],
    },
    womens: {
      bottoms: [
        { size: "XXS", it: "38", us: "00", jeans: "24", waist: "63/24.8", hips: "83/32.7" },
        { size: "XS", it: "40", us: "0", jeans: "25", waist: "67/26.4", hips: "87/34.3" },
        { size: "S", it: "42", us: "2", jeans: "26", waist: "71/28", hips: "91/35.8" },
        { size: "M", it: "44", us: "6", jeans: "28", waist: "75/29.5", hips: "95/37.4" },
        { size: "L", it: "46", us: "10", jeans: "30", waist: "79/31.1", hips: "99/39" },
        { size: "XL", it: "48", us: "12", jeans: "32", waist: "83/32.7", hips: "103/40.5" },
      ],
      tops: [
        { size: "XXS", it: "38", shoulders: "35/13.8", chest: "78/30.7" },
        { size: "XS", it: "40", shoulders: "36/14.2", chest: "82/32.3" },
        { size: "S", it: "42", shoulders: "37/14.6", chest: "86/33.9" },
        { size: "M", it: "44", shoulders: "38/15", chest: "90/35.4" },
        { size: "L", it: "46", shoulders: "39/15.4", chest: "94/37" },
        { size: "XL", it: "48", shoulders: "40/15.7", chest: "98/38.6" },
      ],
    },
  };

  const measuringTips = {
    general: [
      "The size charts display sizes based on body measurements.",
      "Use our measuring tips and refer to the sketches below to determine your size.",
    ],
    bottoms: [
      "Stand straight on a flat surface with your heel against a wall.",
      "Measure around the narrowest part of your waist.",
      "Measure around the fullest part of your hips.",
      "For jeans, refer to the waist measurement in inches.",
    ],
    tops: [
      "Measure across the back from shoulder seam to shoulder seam.",
      "Measure around the fullest part of your chest.",
      "Keep the measuring tape parallel to the floor.",
      "Take measurements over undergarments or close-fitting clothing.",
    ],
  };

  const currentData = sizeData[category];

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
