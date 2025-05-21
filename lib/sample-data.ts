import type { Note } from "./types"

export function generateSampleNotes(): Note[] {
  return [
    {
      id: "note-1",
      title: "Meeting Notes",
      content:
        "<p>Key points from today's team meeting:</p><ul><li>Launch new feature by end of month</li><li>Address customer feedback on dashboard</li><li>Schedule design review for next week</li></ul>",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      tags: ["Work", "Meeting", "Important"],
    },
    {
      id: "note-2",
      title: "Project Ideas",
      content:
        "<p>Potential side projects to work on:</p><ul><li>Mobile app for habit tracking</li><li>Recipe collection tool with AI suggestions</li><li>Smart home dashboard</li></ul>",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      tags: ["Ideas", "Personal", "Project"],
    },
    {
      id: "note-3",
      title: "Learning Resources",
      content:
        "<p>Resources for learning new technologies:</p><ul><li>Advanced React patterns course</li><li>System design interview prep</li><li>TypeScript best practices guide</li></ul>",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      tags: ["Learning", "Research"],
    },
    {
      id: "note-4",
      title: "Weekly Tasks",
      content:
        "<p><strong>This week's priorities:</strong></p><ul><li>Complete project proposal</li><li>Review pull requests</li><li>Prepare for client presentation</li></ul>",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      tags: ["Tasks", "Work"],
    },
    {
      id: "note-5",
      title: "Book Recommendations",
      content:
        "<p>Books to read:</p><ul><li>Atomic Habits by James Clear</li><li>The Psychology of Money by Morgan Housel</li><li>Deep Work by Cal Newport</li></ul>",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      tags: ["Personal", "Reading"],
    },
  ]
}
