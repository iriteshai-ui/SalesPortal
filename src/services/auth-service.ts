import { MOCK_USERS } from "@/constants";
import { User } from "@/models";

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!mockUser) {
      return { success: false, error: "Invalid email or password." };
    }

    const syntheticUser: User = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      employeeId: mockUser.id,
      branch: "Head Office, Mumbai",
      designation: mockUser.role,
      isActive: true,
      role: { id: mockUser.id, name: mockUser.role, products: mockUser.products },
      products: mockUser.products,
    };

    const fakeToken = `uat-token-${mockUser.id}`;
    return { success: true, user: syntheticUser, token: fakeToken };
  },

  bypassLogin(mockUser: (typeof MOCK_USERS)[0]): { user: User; token: string } {
    const syntheticUser: User = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      employeeId: mockUser.id,
      branch: "Head Office, Mumbai",
      designation: mockUser.role,
      isActive: true,
      role: { id: mockUser.id, name: mockUser.role, products: mockUser.products },
      products: mockUser.products,
    };
    const fakeToken = "uat-bypass-token";
    return { user: syntheticUser, token: fakeToken };
  }
};
