import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { AssigneeSelect } from "@components/selects/assignee";
import { useOrganizationMembers } from "@/hooks";

import { User } from "@tdata/shared/types";

class MockedResizeObserver {
  constructor(_: ResizeObserverCallback) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.mock("@/hooks", () => ({
  useOrganizationMembers: vi.fn(),
}));

describe("AssigneeSelect", () => {
  const mockUsers: User[] = [
    { id: "1", name: "Alice", imageUrl: "alice.jpg", email: "alice@email.com", role: "Member", createdAt: new Date() },
    { id: "2", name: "Bob", imageUrl: "bob.jpg", email: "bob@email.com", role: "Member", createdAt: new Date() },
  ];

  beforeEach(() => {
    vi.mocked(useOrganizationMembers).mockReturnValue(mockUsers);

    // Cmdk uses this, so we need to mock it as JSDOM doesn't have a support for ResizeObserver
    vi.stubGlobal("ResizeObserver", MockedResizeObserver);
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders correctly", () => {
    // ARRANGE: Render the Select Component
    render(<AssigneeSelect />);

    // ASSERT: Expect the Select Component to be rendered
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("opens the dropdown when clicked", () => {
    // ARRANGE: Render the Select Component
    render(<AssigneeSelect />);

    // ACT: Click on the dropdown
    fireEvent.click(screen.getByRole("combobox"));

    // ASSERT: Expect the dropdown to be open
    expect(screen.getByPlaceholderText("Search assignees...")).toBeInTheDocument();
  });

  it("selects an assignee", () => {
    // ARRANGE: Render the Select Component
    const onChange = vi.fn();
    render(<AssigneeSelect onChange={onChange} singleUser />);

    // ACT: Select Alice
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Alice"));

    // ASSERT: Expect Alice to be selected
    expect(onChange).toHaveBeenCalledWith({ newValue: [mockUsers[0]], previousValue: [] });
  });

  it("removes an assignee", () => {
    // ARRANGE: Render the Select Component
    const onChange = vi.fn();
    render(<AssigneeSelect assignee={[mockUsers[0]]} onChange={onChange} singleUser />);

    // ACT: Select Alice and then UnAssign
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("UnAssign"));

    // ASSERT: Expect Alice to be removed
    expect(onChange).toHaveBeenCalledWith({ newValue: [], previousValue: [mockUsers[0]] });
  });

  it("allows multiple selection", () => {
    // ARRANGE: Render the Select Component
    const onChange = vi.fn();
    render(<AssigneeSelect onChange={onChange} />);

    // ACT: Open the dropdown and select Alice and Bob
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Alice"));
    fireEvent.click(screen.getByText("Bob"));

    // ASSERT: Expect Alice and Bob to be selected
    expect(onChange).toHaveBeenCalledWith({ newValue: [mockUsers[0]], previousValue: [] });
    expect(onChange).toHaveBeenCalledWith({ newValue: [mockUsers[0], mockUsers[1]], previousValue: [mockUsers[0]] });
  });

  it("allows multiple selection removal", () => {
    // ARRANGE: Render the Select Component and Open the dropdown and select Alice and Bob
    const onChange = vi.fn();
    render(<AssigneeSelect onChange={onChange} />);
    const assigneeSelect = screen.getByRole("combobox");
    fireEvent.click(assigneeSelect);
    fireEvent.click(screen.getByText("Alice"));
    fireEvent.click(screen.getByText("Bob"));

    // ACT: Remove Alice
    fireEvent.mouseOver(assigneeSelect);
    const aliceRemoveBtn = screen.getByTestId(`assignee-remove-btn-${mockUsers[0].id}`);
    expect(aliceRemoveBtn).toBeInTheDocument();
    fireEvent.click(aliceRemoveBtn);

    // ASSERT: Expect Alice to be removed
    expect(onChange).toHaveBeenCalledWith({ newValue: [mockUsers[1]], previousValue: [mockUsers[0], mockUsers[1]] });
  });
});
