
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  Send,
  Eye,
  MoreHorizontal,
  Package
} from 'lucide-react';
import { useToast } from '../lib/use-toast';
import LoadingSpinner from '../components/LoadingSpinner';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  responses: Array<{
    id: number;
    message: string;
    respondedBy: string;
    respondedAt: string;
  }>;
}

interface ContactMessageStats {
  total: number;
  unresolved: number;
  resolved: number;
  inProgress: number;
  highPriority: number;
}

const ContactMessages: React.FC = () => {
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactMessageStats>({
    total: 0,
    unresolved: 0,
    resolved: 0,
    inProgress: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [sendingResponse, setSendingResponse] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [searchTerm, statusFilter, priorityFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/contact-messages?${params}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages);
      setStats(data.stats);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch contact messages" });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: number, status: string, priority?: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status, priority: priority || msg.priority, updatedAt: new Date().toISOString() }
          : msg
      ));

      // Update stats
      await fetchMessages();

      toast({ title: "Success", description: "Message status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update message status" });
    }
  };

  const sendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    try {
      setSendingResponse(true);
      const response = await fetch(`/api/admin/contact-messages/${selectedMessage.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: responseText,
          notifyCustomer 
        }),
      });

      if (!response.ok) throw new Error('Failed to send response');

      const newResponse = await response.json();
      
      // Update the selected message with the new response
      const updatedMessage = {
        ...selectedMessage,
        responses: [...selectedMessage.responses, newResponse],
        status: 'in_progress',
        updatedAt: new Date().toISOString(),
      };
      
      setSelectedMessage(updatedMessage);
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? updatedMessage : msg
      ));

      setResponseText('');
      toast({ title: "Success", description: "Response sent successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send response" });
    } finally {
      setSendingResponse(false);
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
        setShowMessageDetail(false);
      }

      toast({ title: "Success", description: "Message deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete message" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'unresolved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'inquiry': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'suggestion': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exchange': return <Package className="w-4 h-4 text-orange-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold lv-heading">Contact Messages</h1>
          <p className="text-gray-600 lv-body mt-2">
            Manage customer feedback and inquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.unresolved}</div>
            <div className="text-sm text-gray-600">Unresolved</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={fetchMessages} 
                variant="outline" 
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTypeIcon(message.type)}
                    <h3 className="font-semibold text-lg">{message.subject}</h3>
                    <Badge className={getStatusColor(message.status)}>
                      {message.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(message.priority)}>
                      {message.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {message.name} ({message.email})
                    </div>
                    {message.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {message.phone}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                    {message.orderId && (
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {message.orderId}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {message.message}
                  </p>

                  {message.responses.length > 0 && (
                    <div className="text-sm text-green-600">
                      ✓ {message.responses.length} response(s) sent
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowMessageDetail(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  <Select 
                    value={message.status} 
                    onValueChange={(status) => updateMessageStatus(message.id, status)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-600">No contact messages match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={showMessageDetail} onOpenChange={setShowMessageDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedMessage && getTypeIcon(selectedMessage.type)}
              <span>{selectedMessage?.subject}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{selectedMessage.name}</div>
                  <div className="text-sm text-gray-600">{selectedMessage.email}</div>
                  {selectedMessage.phone && (
                    <div className="text-sm text-gray-600">{selectedMessage.phone}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex space-x-2 mb-2">
                    <Badge className={getStatusColor(selectedMessage.status)}>
                      {selectedMessage.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                  {selectedMessage.orderId && (
                    <div className="text-sm text-blue-600">
                      Order: {selectedMessage.orderId}
                    </div>
                  )}
                </div>
              </div>

              {/* Original Message */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-2">Original Message</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Responses */}
              {selectedMessage.responses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Responses ({selectedMessage.responses.length})</h4>
                  {selectedMessage.responses.map((response) => (
                    <div key={response.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-700">Admin Response</span>
                        <span className="text-sm text-blue-600">
                          {new Date(response.respondedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* New Response */}
              <div className="space-y-4">
                <h4 className="font-semibold">Send Response</h4>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notifyCustomer}
                      onChange={(e) => setNotifyCustomer(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">
                      Send email notification to customer
                    </span>
                  </label>
                  
                  <Button 
                    onClick={sendResponse} 
                    disabled={!responseText.trim() || sendingResponse}
                  >
                    {sendingResponse ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <Label>Update Status:</Label>
                <Select 
                  value={selectedMessage.status} 
                  onValueChange={(status) => {
                    updateMessageStatus(selectedMessage.id, status);
                    setSelectedMessage({ ...selectedMessage, status });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unresolved">Unresolved</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Priority:</Label>
                <Select 
                  value={selectedMessage.priority} 
                  onValueChange={(priority) => {
                    updateMessageStatus(selectedMessage.id, selectedMessage.status, priority);
                    setSelectedMessage({ ...selectedMessage, priority });
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessages;
