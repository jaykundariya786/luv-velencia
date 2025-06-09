import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  Target, 
  Calendar, 
  Clock,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Eye,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  icon?: string;
  actionUrl?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface NotificationCampaign {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  targetAudience: {
    type: 'all' | 'segment' | 'custom';
    criteria?: any;
    userIds?: string[];
    estimatedReach: number;
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    scheduledAt?: string;
    recurringPattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days?: number[];
      time: string;
    };
  };
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  createdAt: string;
  sentAt?: string;
}

interface NotificationStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  avgDeliveryRate: number;
  avgOpenRate: number;
  avgClickRate: number;
  recentPerformance: Array<{
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
}

const PushNotificationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics'>('campaigns');
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<NotificationCampaign | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    templateId: '',
    targetType: 'all' as 'all' | 'segment' | 'custom',
    targetCriteria: {},
    scheduleType: 'immediate' as 'immediate' | 'scheduled' | 'recurring',
    scheduledAt: '',
    recurringPattern: {
      frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
      days: [] as number[],
      time: '10:00'
    }
  });

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    title: '',
    body: '',
    icon: '',
    actionUrl: '',
    category: 'promotional',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignRes, templateRes, statsRes] = await Promise.all([
        fetch('/api/admin/notifications/campaigns'),
        fetch('/api/admin/notifications/templates'),
        fetch('/api/admin/notifications/stats')
      ]);

      const [campaignData, templateData, statsData] = await Promise.all([
        campaignRes.json(),
        templateRes.json(),
        statsRes.json()
      ]);

      setCampaigns(campaignData.campaigns || []);
      setTemplates(templateData.templates || []);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to fetch notification data');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const response = await fetch('/api/admin/notifications/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm)
      });

      if (response.ok) {
        toast.success('Campaign created successfully');
        setShowCampaignModal(false);
        setCampaignForm({
          name: '',
          templateId: '',
          targetType: 'all',
          targetCriteria: {},
          scheduleType: 'immediate',
          scheduledAt: '',
          recurringPattern: {
            frequency: 'daily',
            days: [],
            time: '10:00'
          }
        });
        fetchData();
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const createTemplate = async () => {
    try {
      const response = await fetch('/api/admin/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        toast.success('Template created successfully');
        setShowTemplateModal(false);
        setTemplateForm({
          name: '',
          title: '',
          body: '',
          icon: '',
          actionUrl: '',
          category: 'promotional',
          isActive: true
        });
        fetchData();
      } else {
        throw new Error('Failed to create template');
      }
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/campaigns/${campaignId}/send`, {
        method: 'POST'
      });

      if (response.ok) {
        toast.success('Campaign sent successfully');
        fetchData();
      } else {
        throw new Error('Failed to send campaign');
      }
    } catch (error) {
      toast.error('Failed to send campaign');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await fetch(`/api/admin/notifications/campaigns/${campaignId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast.success('Campaign deleted successfully');
          fetchData();
        } else {
          throw new Error('Failed to delete campaign');
        }
      } catch (error) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Push Notification Manager</h1>
          <p className="text-gray-600">Create and manage push notification campaigns</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgDeliveryRate.toFixed(1)}%</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgClickRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['campaigns', 'templates', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">
                          Created {format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.templateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{campaign.targetAudience.type}</div>
                      <div className="text-sm text-gray-500">{campaign.targetAudience.estimatedReach.toLocaleString()} users</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.stats.sent > 0 ? (
                        <div className="text-sm">
                          <div>Sent: {campaign.stats.sent.toLocaleString()}</div>
                          <div>Open: {campaign.stats.openRate.toFixed(1)}%</div>
                          <div>Click: {campaign.stats.clickRate.toFixed(1)}%</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => sendCampaign(campaign.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <span className="text-sm text-gray-500 capitalize">{template.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                <p className="text-sm text-gray-600">{template.body}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(template.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select
                  value={campaignForm.templateId}
                  onChange={(e) => setCampaignForm({...campaignForm, templateId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates.filter(t => t.isActive).map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={campaignForm.targetType}
                  onChange={(e) => setCampaignForm({...campaignForm, targetType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="segment">User Segment</option>
                  <option value="custom">Custom Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select
                  value={campaignForm.scheduleType}
                  onChange={(e) => setCampaignForm({...campaignForm, scheduleType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Send Immediately</option>
                  <option value="scheduled">Schedule for Later</option>
                  <option value="recurring">Recurring Campaign</option>
                </select>
              </div>

              {campaignForm.scheduleType === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={campaignForm.scheduledAt}
                    onChange={(e) => setCampaignForm({...campaignForm, scheduledAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Title</label>
                <input
                  type="text"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({...templateForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                <textarea
                  value={templateForm.body}
                  onChange={(e) => setTemplateForm({...templateForm, body: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="promotional">Promotional</option>
                  <option value="transactional">Transactional</option>
                  <option value="reminder">Reminder</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action URL (Optional)</label>
                <input
                  type="url"
                  value={templateForm.actionUrl}
                  onChange={(e) => setTemplateForm({...templateForm, actionUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationManager;