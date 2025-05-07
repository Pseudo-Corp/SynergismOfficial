import { delay, http, type HttpHandler, HttpResponse } from 'msw'
import type { Message } from '../../Messages'

// Mock messages data - includes different types and priority levels for testing
const mockMessages: Message[] = [
  {
    id: 1,
    title: '🎉 Welcome to Synergism!',
    content:
      'Thanks for playing the greatest idle game of all time! Check out the new features in this update including improved performance and bug fixes.',
    type: 'success',
    priority: 100,
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days from now
  },
  {
    id: 2,
    title: '⚠️ Server Maintenance Notice',
    content:
      'We will be performing server maintenance on Sunday at 3:00 AM UTC. The game will remain playable but cloud saves may be temporarily unavailable.\n\nMaintenance is expected to last 2 hours.',
    type: 'warning',
    priority: 80,
    is_active: true,
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days from now
  },
  {
    id: 3,
    title: 'ℹ️ New Community Discord Features',
    content:
      'Join our Discord server to access:\n• Exclusive roles and channels\n• Beta testing opportunities\n• Direct feedback to developers\n• Community events and giveaways\n\nLink: https://discord.gg/synergism',
    type: 'info',
    priority: 50,
    is_active: true,
    created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    updated_at: new Date(Date.now() - 21600000).toISOString()
  },
  {
    id: 4,
    title: '🔧 Bug Fix Update Available',
    content:
      'A small bug fix update is now live:\n• Fixed calculation errors in corruption loadouts\n• Improved memory usage\n• Fixed visual glitches in the research tab\n\nRefresh your page to get the latest version!',
    type: 'info',
    priority: 70,
    is_active: true,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 5).toISOString() // 5 days from now
  },
  {
    id: 5,
    title: '❌ Critical Error Fixed',
    content:
      'A critical bug affecting save files has been resolved. If you experienced data loss, please contact support with your save backup.',
    type: 'error',
    priority: 95,
    is_active: true,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
  },
  {
    id: 6,
    title: 'ℹ️ Holiday Event Coming Soon',
    content: 'Get ready for our upcoming holiday event! Special rewards and challenges await. Event starts next week.',
    type: 'info',
    priority: 40,
    is_active: true,
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    expires_at: new Date(Date.now() + 86400000 * 14).toISOString() // 14 days from now
  }
]

// Track which messages have been marked as read (in a real app this would be per-user)
const readMessageIds = new Set<number>()

export const messageHandlers: HttpHandler[] = [
  // GET /messages/unread - Fetch unread messages
  http.get('https://synergism.cc/messages/unread', async () => {
    await delay(500) // Simulate network delay

    // Filter out read messages and inactive messages
    const unreadMessages = mockMessages.filter(
      (message) => !readMessageIds.has(message.id) && message.is_active
    )

    return HttpResponse.json({
      success: true,
      data: unreadMessages
    })
  }),

  // POST /messages/:id/mark-read - Mark a message as read
  http.post('https://synergism.cc/messages/:id/mark-read', async ({ params }) => {
    await delay(300) // Simulate network delay

    const messageId = Number.parseInt(params.id as string)

    // Check if message exists
    const messageExists = mockMessages.some((msg) => msg.id === messageId)
    if (!messageExists) {
      return HttpResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    // Mark message as read
    readMessageIds.add(messageId)

    return HttpResponse.json({
      success: true
    })
  })
]
