
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText,
  Loader2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '../lib/use-toast';

interface BulkUploadProps {
  type: 'products' | 'users';
  onClose: () => void;
}

interface ValidationResult {
  validRows: Array<{ rowNumber: number; data: any }>;
  errorRows: Array<{ rowNumber: number; data: any; errors: string[] }>;
  totalRows: number;
  validCount: number;
  errorCount: number;
}

interface ProcessResult {
  successCount: number;
  failedCount: number;
  failed: Array<{ rowNumber: number; data: any; error: string }>;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ type, onClose }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<'upload' | 'validate' | 'process' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({ title: "Error", description: "CSV file must have at least a header and one data row" });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, i) => {
          let value = values[i] || '';
          
          // Convert boolean strings
          if (value.toLowerCase() === 'true') value = true;
          else if (value.toLowerCase() === 'false') value = false;
          
          row[header] = value;
        });
        return row;
      });

      setCsvData(data);
      setStep('validate');
    };
    reader.readAsText(file);
  };

  const validateData = async () => {
    if (!csvData.length) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/bulk-upload/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: csvData }),
      });

      if (!response.ok) throw new Error('Validation failed');

      const result = await response.json();
      setValidationResult(result);
      
      toast({
        title: "Validation Complete",
        description: `${result.validCount} valid, ${result.errorCount} errors`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate data" });
    } finally {
      setLoading(false);
    }
  };

  const processUpload = async () => {
    if (!validationResult?.validRows.length) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/bulk-upload/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          validRows: validationResult.validRows 
        }),
      });

      if (!response.ok) throw new Error('Processing failed');

      const result = await response.json();
      setProcessResult(result);
      setStep('complete');
      
      toast({
        title: "Upload Complete",
        description: `${result.successCount} ${type} created successfully`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process upload" });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/bulk-upload/template/${type}`);
      if (!response.ok) throw new Error('Failed to get template');

      const template = await response.json();
      
      // Create CSV content
      const csvContent = [
        template.headers.join(','),
        ...template.sampleData.map((row: any) => 
          template.headers.map((header: string) => row[header] || '').join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: "Error", description: "Failed to download template" });
    }
  };

  const handleEditRow = (rowIndex: number, data: any) => {
    setEditingRow(rowIndex);
    setEditedData({ ...data });
  };

  const saveEditedRow = async () => {
    if (editingRow === null || !validationResult) return;

    // Update the error row with edited data
    const updatedErrorRows = [...validationResult.errorRows];
    updatedErrorRows[editingRow].data = { ...editedData };

    // Re-validate the single row
    setLoading(true);
    try {
      const response = await fetch('/api/admin/bulk-upload/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: [editedData] }),
      });

      if (!response.ok) throw new Error('Validation failed');

      const result = await response.json();
      
      if (result.validCount > 0) {
        // Move from error rows to valid rows
        const validRow = { rowNumber: updatedErrorRows[editingRow].rowNumber, data: editedData };
        updatedErrorRows.splice(editingRow, 1);
        
        setValidationResult({
          ...validationResult,
          validRows: [...validationResult.validRows, validRow],
          errorRows: updatedErrorRows,
          validCount: validationResult.validCount + 1,
          errorCount: validationResult.errorCount - 1,
        });
        
        toast({ title: "Success", description: "Row fixed and moved to valid rows" });
      } else {
        // Update errors
        updatedErrorRows[editingRow].errors = result.errorRows[0].errors;
        setValidationResult({
          ...validationResult,
          errorRows: updatedErrorRows,
        });
        
        toast({ title: "Validation Failed", description: "Please fix the remaining errors" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate edited row" });
    } finally {
      setLoading(false);
      setEditingRow(null);
      setEditedData({});
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-luxury max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 lv-heading">
                Bulk Upload {type === 'products' ? 'Products' : 'Users'}
              </h2>
              <p className="text-gray-600 lv-body">
                Upload multiple {type} via CSV file
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
                <p className="text-gray-600 mb-4">
                  Upload a CSV file with {type} data. Make sure to follow the template format.
                </p>
                
                <div className="space-y-4">
                  <Button onClick={downloadTemplate} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                  
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select CSV File
                    </Button>
                  </div>
                </div>
              </div>

              {file && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024).toFixed(2)} KB • {csvData.length} rows
                          </p>
                        </div>
                      </div>
                      <Button onClick={validateData} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Validate Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {step === 'validate' && validationResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {validationResult.validCount}
                    </div>
                    <div className="text-sm text-gray-600">Valid Rows</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {validationResult.errorCount}
                    </div>
                    <div className="text-sm text-gray-600">Error Rows</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {validationResult.totalRows}
                    </div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </CardContent>
                </Card>
              </div>

              {validationResult.errorCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Errors to Fix ({validationResult.errorCount})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {validationResult.errorRows.map((errorRow, index) => (
                        <div key={index} className="border border-red-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="destructive">Row {errorRow.rowNumber}</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditRow(index, errorRow.data)}
                                disabled={editingRow === index}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            {Object.entries(errorRow.data).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium text-gray-700">{key}:</span>
                                <span className="ml-2 text-gray-600">
                                  {editingRow === index ? (
                                    <Input
                                      value={editedData[key] || ''}
                                      onChange={(e) => setEditedData({
                                        ...editedData,
                                        [key]: e.target.value
                                      })}
                                      className="mt-1"
                                    />
                                  ) : (
                                    String(value)
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-1">
                            {errorRow.errors.map((error, errorIndex) => (
                              <div key={errorIndex} className="text-sm text-red-600 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                {error}
                              </div>
                            ))}
                          </div>

                          {editingRow === index && (
                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" onClick={saveEditedRow} disabled={loading}>
                                {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setEditingRow(null);
                                  setEditedData({});
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back to Upload
                </Button>
                <Button 
                  onClick={processUpload} 
                  disabled={validationResult.validCount === 0 || loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Process Upload ({validationResult.validCount} items)
                </Button>
              </div>
            </div>
          )}

          {step === 'complete' && processResult && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Upload Completed Successfully!
                </h3>
                <p className="text-gray-600">
                  {processResult.successCount} {type} have been created successfully.
                  {processResult.failedCount > 0 && ` ${processResult.failedCount} items failed.`}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {processResult.successCount}
                    </div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {processResult.failedCount}
                    </div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
