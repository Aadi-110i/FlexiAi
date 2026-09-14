import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// ── Mock AI responses ─────────────────────────────────────────

const MOCK_RESPONSES = [
  `I'd be happy to help with that! Here's a comprehensive approach:

**Key Concepts**

1. **Start with the fundamentals** — Understanding the core principles will make everything else click.

2. **Iterative approach** — Build incrementally, test often, and refactor as you learn more.

3. **Best practices**:
   - Write clean, readable code
   - Document your decisions
   - Use TypeScript for type safety
   - Test critical paths

**Example Implementation**

\`\`\`typescript
// A well-structured module
export class Solution {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async execute(input: string): Promise<Result> {
    const processed = this.preprocess(input);
    return this.compute(processed);
  }

  private preprocess(input: string): string {
    return input.trim().toLowerCase();
  }

  private compute(data: string): Result {
    return { success: true, data };
  }
}
\`\`\`

**Next Steps**

- Review the architecture diagram
- Set up your development environment
- Start with a minimal working prototype
- Gradually add features and refinements

Would you like me to dive deeper into any specific aspect?`,

  `Great question! Let me break this down systematically.

**The Core Problem**

When dealing with complex systems, the key is to maintain clear separation of concerns. Each component should have a single, well-defined responsibility.

**Architecture Overview**

\`\`\`
Client Layer
    ↓
API Gateway
    ↓
Business Logic
    ↓
Data Layer
\`\`\`

**Implementation Strategy**

Start by defining your data models clearly:

\`\`\`typescript
interface User {
  id: string;
  email: string;
  createdAt: Date;
  role: 'admin' | 'user' | 'viewer';
}

interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
}
\`\`\`

**Recommended Libraries**

- **Authentication**: Better Auth or Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis for session management
- **Validation**: Zod for runtime type checking

This approach gives you a solid foundation that scales well. Let me know if you want to explore any part in more detail!`,

  `Excellent! Here's what I recommend based on current best practices:

**Short Answer**

Use a layered architecture with clear boundaries between your presentation, business logic, and data layers.

**Detailed Explanation**

The most important thing is consistency. Pick patterns and stick to them. Here are the ones that work best:

1. **Repository Pattern** for data access
2. **Service Layer** for business logic  
3. **Controller/Handler** for request handling
4. **DTO Pattern** for data transfer

**Code Example**

\`\`\`typescript
// Repository - handles data access only
class UserRepository {
  async findById(id: string): Promise<User | null> {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }
}

// Service - handles business logic
class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}
\`\`\`

**Performance Considerations**

- Cache frequently accessed data in Redis
- Use database indexes strategically
- Implement pagination for large datasets
- Consider connection pooling for high traffic

Does this address your question? I can elaborate on any of these points!`,
];

function getRandomResponse(userMessage: string): string {
  // Use message content to pick a somewhat relevant response
  const idx = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[idx];
}

// ── SSE streaming route ───────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json() as { messages: Array<{ role: string; content: string }> };
  const lastMessage = body.messages[body.messages.length - 1];
  const userMessage = lastMessage?.content ?? "";

  const response = getRandomResponse(userMessage);
  const words = response.split(" ");

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function send(event: string, data: string) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
      }

      // Start event
      send("start", JSON.stringify({ id: Date.now().toString() }));

      // Simulate streaming tokens word by word
      let accumulated = "";
      for (let i = 0; i < words.length; i++) {
        const word = i === 0 ? words[i] : " " + words[i];
        accumulated += word;
        send("token", JSON.stringify({ token: word }));

        // Variable delay for natural feel
        const delay = 15 + Math.random() * 25;
        await new Promise((r) => setTimeout(r, delay));
      }

      // Done
      send("done", JSON.stringify({ content: accumulated }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
